#!/usr/bin/env node
'use strict'

/**
 * Sprint PR Closures Report — va-mobile-app
 *
 * Discovers sprint date ranges from the "VA Mobile App Team" project board,
 * fetches merged PRs from the repo, and buckets them by merge date into
 * sprints. Outputs the last N sprints with names and merged PR counts.
 *
 * Usage:
 *   # Show the default number of recent sprints
 *   node sprint_closed_prs.js
 *
 *   # Show a specific number of recent sprints
 *   node sprint_closed_prs.js --sprints 5
 *
 * Requirements:
 *   - GitHub CLI (`gh`) installed and authenticated
 *   - Access to the `department-of-veterans-affairs/va-mobile-app` repository
 *   - GitHub token/CLI scopes:
 *       repo          (for PR data)
 *       read:project  (for project/iteration data)
 *
 *   To ensure the required scopes:
 *     gh auth refresh --scopes read:project
 *
 * This script is intended to be used from the VAMobile/QA/reporting folder
 * as part of the VA Mobile App reporting utilities.
 */

const { spawnSync } = require('child_process')

// ── Constants ──────────────────────────────────────────────────────────────────

const REPO_OWNER = 'department-of-veterans-affairs'
const REPO_NAME = 'va-mobile-app'
const REPO = `${REPO_OWNER}/${REPO_NAME}`

const DEFAULT_SPRINTS = 3

// Project board with iteration/sprint fields
const PROJECT_KEYWORDS = ['va mobile app team']

const HELP = `
Usage: node sprint_closed_prs.js [options]

Options:
  -s, --sprints N  Number of recent sprints to show (default: ${DEFAULT_SPRINTS})
  -h, --help       Show this help

Scopes required:
  repo             PR data (standard)
  read:project     Project iteration data
    → gh auth refresh --scopes read:project
`.trim()

// ── GraphQL Queries ────────────────────────────────────────────────────────────

const FIND_PROJECT_QUERY = `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    projectsV2(first: 20) {
      nodes { id title number }
    }
  }
}`

/**
 * Fetches project items to discover iteration field values (sprint definitions).
 * We only need the iteration metadata, not the item content.
 */
const FETCH_PROJECT_ITEMS_QUERY = `
query($projectId: ID!, $cursor: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldIterationValue {
                title
                startDate
                duration
                field { ... on ProjectV2IterationField { name } }
              }
            }
          }
        }
      }
    }
  }
}`

const FETCH_PRS_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      first: 100
      after: $cursor
      orderBy: { field: UPDATED_AT, direction: DESC }
      states: [MERGED]
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title mergedAt updatedAt
      }
    }
  }
}`

// ── Utilities ──────────────────────────────────────────────────────────────────

const log = (...args) => process.stderr.write(args.join(' ') + '\n')
const die = (msg) => {
  log('Error:', msg)
  process.exit(1)
}

const fmtDate = (d) => d.toISOString().slice(0, 10)

// ── Config ─────────────────────────────────────────────────────────────────────

const parseConfig = (argv) => {
  let sprints = DEFAULT_SPRINTS

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(HELP + '\n')
      process.exit(0)
    } else if ((arg === '--sprints' || arg === '-s') && argv[i + 1]) {
      sprints = parseInt(argv[++i], 10)
      if (isNaN(sprints) || sprints < 1) die('--sprints must be a positive integer')
    }
  }

  return { owner: REPO_OWNER, name: REPO_NAME, repo: REPO, sprints, now: new Date() }
}

// ── IO ─────────────────────────────────────────────────────────────────────────

const ghGraphql = (query, variables = {}) => {
  const args = ['api', 'graphql', '-F', `query=${query}`]
  for (const [k, v] of Object.entries(variables)) {
    if (v != null) args.push('-F', `${k}=${v}`)
  }

  const result = spawnSync('gh', args, { encoding: 'utf8' })
  if (result.status !== 0) return { ok: false, error: result.stderr.trim() }

  const payload = JSON.parse(result.stdout)
  if (payload.errors) return { ok: false, error: JSON.stringify(payload.errors) }

  return { ok: true, data: payload.data ?? {} }
}

/**
 * Find a project by keyword match on its title.
 * Returns the project node or null.
 */
const findProject = (config, keywords) => {
  const findResult = ghGraphql(FIND_PROJECT_QUERY, { owner: config.owner, name: config.name })
  if (!findResult.ok) {
    const scopeError = findResult.error.includes('INSUFFICIENT_SCOPES') || findResult.error.includes('read:project')
    log(
      scopeError
        ? '  → Skipping (missing read:project scope)\n     Fix: gh auth refresh --scopes read:project'
        : `  → Project query error: ${findResult.error}`,
    )
    return null
  }

  const projects = findResult.data.repository?.projectsV2?.nodes ?? []
  if (!projects.length) {
    log('  → No GitHub Projects V2 linked to this repository')
    return null
  }

  return projects.find((p) => keywords.some((kw) => p.title.toLowerCase().includes(kw))) ?? null
}

/**
 * Paginate through project items to discover all unique sprint definitions.
 * Returns a Map of sprint title → { title, startDate, duration }.
 */
const fetchSprintDefinitions = (projectId) => {
  const sprints = new Map()
  let cursor = null
  let page = 0

  while (true) {
    page++
    const vars = { projectId }
    if (cursor) vars.cursor = cursor

    const result = ghGraphql(FETCH_PROJECT_ITEMS_QUERY, vars)
    if (!result.ok) {
      log(`  → Project items error: ${result.error}`)
      return sprints
    }

    const conn = result.data.node.items

    for (const item of conn.nodes) {
      const iterField = item.fieldValues.nodes.find((fv) => fv.startDate && fv.title)
      if (!iterField) continue

      if (!sprints.has(iterField.title)) {
        sprints.set(iterField.title, {
          title: iterField.title,
          startDate: iterField.startDate,
          duration: iterField.duration,
        })
      }
    }

    if (!conn.pageInfo.hasNextPage) break
    cursor = conn.pageInfo.endCursor
  }

  log(`  → ${sprints.size} unique sprints discovered across ${page} page(s)`)
  return sprints
}

/**
 * Fetch merged PRs back to the earliest sprint start date.
 * Paginates automatically and stops once we pass the cutoff.
 */
const fetchMergedPRs = (config, since) => {
  const sinceStr = since.toISOString()
  log(`Fetching merged PRs since ${fmtDate(since)} …`)

  const prs = []
  let cursor = null
  let page = 0

  while (true) {
    page++
    const vars = { owner: config.owner, name: config.name }
    if (cursor) vars.cursor = cursor

    const result = ghGraphql(FETCH_PRS_QUERY, vars)
    if (!result.ok) die(`Fetching PRs: ${result.error}`)

    const conn = result.data.repository.pullRequests
    const nodes = conn.nodes

    for (const pr of nodes) {
      if (pr.mergedAt && pr.mergedAt >= sinceStr) prs.push(pr)
    }

    // Safe cutoff: pagination is ordered by UPDATED_AT (desc), so once the
    // oldest updatedAt on this page is before sinceStr, remaining pages are too.
    const oldestUpdatedAt = nodes.at(-1)?.updatedAt
    if (!conn.pageInfo.hasNextPage || (oldestUpdatedAt && oldestUpdatedAt < sinceStr)) break
    cursor = conn.pageInfo.endCursor
  }

  log(`  → ${prs.length} merged PRs across ${page} page(s)`)
  return prs
}

// ── Transform (pure) ───────────────────────────────────────────────────────────

/**
 * Bucket merged PRs into sprints by merge date and return the most recent N.
 * A PR belongs to the sprint whose [startDate, startDate+duration) range
 * contains the PR's merge date. Pure function.
 */
const buildModel = (config, sprintDefs, prs) => {
  // Build sorted sprint list with date ranges, excluding future sprints
  const now = config.now
  const sprints = [...sprintDefs.values()]
    .map((s) => {
      const start = new Date(s.startDate + 'T00:00:00Z')
      const end = new Date(start)
      end.setUTCDate(end.getUTCDate() + s.duration)
      return { ...s, start, end, prs: [] }
    })
    .filter((s) => s.start <= now)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))

  // Assign each PR to the sprint containing its merge date
  for (const pr of prs) {
    const mergeDate = new Date(pr.mergedAt)
    const sprint = sprints.find((s) => mergeDate >= s.start && mergeDate < s.end)
    if (sprint) sprint.prs.push(pr)
  }

  const recentSprints = sprints.slice(0, config.sprints)

  return { config, recentSprints, totalSprints: sprints.length }
}

// ── View (pure) ────────────────────────────────────────────────────────────────

/**
 * Render a markdown table from an array of row arrays.
 * First row is treated as the header.
 *
 * @param  {string[][]} rows
 * @param  {Array<'l'|'r'|'c'>} aligns
 * @returns {string}
 */
const mdTable = (rows, aligns) => {
  const sepCell = (a) => (a === 'r' ? '---:' : a === 'c' ? ':---:' : '---')
  const [header, ...body] = rows
  const sep = aligns.map(sepCell)
  return [header, sep, ...body].map((row) => `| ${row.join(' | ')} |`).join('\n')
}

/**
 * Render the complete report as a markdown string.
 * Pure — no IO.
 */
const renderReport = (model) => {
  const { config, recentSprints } = model

  const lines = []
  const emit = (...parts) => lines.push(parts.join(''))

  emit(`# Sprint PR Closures — ${REPO}`)
  emit()
  emit(`_Last ${config.sprints} sprints as of ${fmtDate(config.now)}_`)
  emit()

  if (!recentSprints.length) {
    emit('_No sprint data found. Ensure the project board has iteration fields and PRs are assigned to sprints._')
    emit()
    return lines.join('\n')
  }

  const tableRows = [['Sprint', 'Dates', 'PRs Merged']]
  for (const sprint of recentSprints) {
    const start = new Date(sprint.startDate + 'T00:00:00Z')
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + sprint.duration - 1)
    const dateRange = `${fmtDate(start)} → ${fmtDate(end)}`
    tableRows.push([sprint.title, dateRange, String(sprint.prs.length)])
  }

  emit(mdTable(tableRows, ['l', 'l', 'r']))

  const completedSprints = recentSprints.filter((s) => s.end <= config.now)
  const total = recentSprints.reduce((sum, s) => sum + s.prs.length, 0)
  const completedTotal = completedSprints.reduce((sum, s) => sum + s.prs.length, 0)
  const avg = completedSprints.length ? (completedTotal / completedSprints.length).toFixed(1) : 'N/A'

  emit()
  emit(`**Total:** ${total} PRs merged across ${recentSprints.length} sprints (avg ${avg}/completed sprint)`)
  emit()

  return lines.join('\n')
}

// ── Main ───────────────────────────────────────────────────────────────────────

const main = () => {
  // 1. Init — parse argv into config (pure)
  const config = parseConfig(process.argv.slice(2))

  // 2. Preflight — confirm gh is authenticated
  const auth = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' })
  if (auth.status !== 0) die('gh CLI is not authenticated. Run: gh auth login')

  // 3. Effects — discover sprint definitions from project board (IO)
  log('Fetching sprint definitions …')
  const project = findProject(config, PROJECT_KEYWORDS)
  if (!project) die('Could not find project board. Ensure read:project scope is available.')

  log(`  → Using project: "${project.title}"`)
  const sprintDefs = fetchSprintDefinitions(project.id)
  if (!sprintDefs.size) die('No sprint/iteration fields found on this project board.')

  // Determine how far back to fetch PRs based on sprint date ranges
  const allSprints = [...sprintDefs.values()]
    .filter((s) => new Date(s.startDate + 'T00:00:00Z') <= config.now)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
  const targetSprints = allSprints.slice(0, config.sprints)
  if (!targetSprints.length) {
    die('No current/past sprints found after filtering. Check project iteration dates.')
  }
  const earliest = targetSprints.at(-1)
  const fetchSince = new Date(earliest.startDate + 'T00:00:00Z')

  // 4. Effects — fetch merged PRs within the sprint window (IO)
  const prs = fetchMergedPRs(config, fetchSince)

  // 5. Transform — bucket PRs into sprints (pure)
  const model = buildModel(config, sprintDefs, prs)

  // 6. View — render model to markdown (pure)
  const report = renderReport(model)

  // 7. Output (IO)
  process.stdout.write(report + '\n')
}

main()
