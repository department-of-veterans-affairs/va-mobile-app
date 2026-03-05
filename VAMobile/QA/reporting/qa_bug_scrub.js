#!/usr/bin/env node
'use strict'

/**
 * QA Bug Scrub Meeting Report — va-mobile-app
 *
 * Generates a markdown report covering:
 *   1. PRs approved by QA in the last week
 *   2. PRs sent back (changes requested) by QA in the last week
 *   3. PRs on deck (Ready for QA / PR in QA)
 *   4. PR forecast — open issues tagged front-end or back-end
 *   5. QA capacity health check
 *
 * Usage:
 *   node qa_bug_scrub.js
 *   node qa_bug_scrub.js --days 14
 *   node qa_bug_scrub.js --no-project
 */

const { spawnSync } = require('child_process')

// ── Constants ──────────────────────────────────────────────────────────────────

const REPO_OWNER = 'department-of-veterans-affairs'
const REPO_NAME = 'va-mobile-app'
const REPO = `${REPO_OWNER}/${REPO_NAME}`

const QA_TEAM = new Set(['eli-oat', 'SKMOstudio', 'digitalken'])

const STATUS_FIELD = 'Status'
const DEFAULT_DAYS = 7

const FORECAST_LABELS = ['front-end', 'back-end']

// Project board for PR pipeline tracking
const PR_PROJECT_KEYWORDS = ['mobile pr']
// Project board for sprint/issue tracking
const SPRINT_PROJECT_KEYWORDS = ['va mobile app team']

const HELP = `
Usage: node qa_bug_scrub.js [options]

Options:
  -d, --days N     Lookback window in days (default: ${DEFAULT_DAYS})
  --no-project     Skip GitHub Projects status data (faster)
  -h, --help       Show this help

Scopes required:
  repo             PR and review data (standard)
  read:project     Project status distribution (optional)
    → gh auth refresh --scopes read:project
`.trim()

// ── GraphQL Queries ────────────────────────────────────────────────────────────

const FETCH_PRS_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      first: 100
      after: $cursor
      orderBy: { field: UPDATED_AT, direction: DESC }
      states: [OPEN, CLOSED, MERGED]
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title state url createdAt mergedAt closedAt
        author { login }
        reviews(first: 50, states: [APPROVED, CHANGES_REQUESTED]) {
          nodes { author { login } state submittedAt }
        }
      }
    }
  }
}`

const FETCH_ISSUES_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    issues(
      first: 100
      after: $cursor
      orderBy: { field: UPDATED_AT, direction: DESC }
      states: [OPEN]
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title url createdAt
        author { login }
        labels(first: 20) { nodes { name } }
      }
    }
  }
}`

const FIND_PROJECT_QUERY = `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    projectsV2(first: 20) {
      nodes { id title number }
    }
  }
}`

const FETCH_PROJECT_ITEMS_QUERY = `
query($projectId: ID!, $cursor: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          content {
            ... on PullRequest {
              number
              repository { nameWithOwner }
            }
            ... on Issue {
              number
              repository { nameWithOwner }
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2SingleSelectField { name } }
              }
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

// ── Utilities ──────────────────────────────────────────────────────────────────

const log = (...args) => process.stderr.write(args.join(' ') + '\n')
const die = (msg) => {
  log('Error:', msg)
  process.exit(1)
}

const fmtDate = (d) => d.toISOString().slice(0, 10)

// ── Config ─────────────────────────────────────────────────────────────────────

const parseConfig = (argv) => {
  let days = DEFAULT_DAYS
  let includeProject = true

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(HELP + '\n')
      process.exit(0)
    } else if ((arg === '--days' || arg === '-d') && argv[i + 1]) {
      days = parseInt(argv[++i], 10)
      if (isNaN(days) || days < 1) die('--days must be a positive integer')
    } else if (arg === '--no-project') {
      includeProject = false
    }
  }

  const now = new Date()
  const since = new Date(now)
  since.setUTCDate(since.getUTCDate() - days)
  since.setUTCHours(0, 0, 0, 0)

  return { owner: REPO_OWNER, name: REPO_NAME, repo: REPO, days, includeProject, since, now }
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

const fetchPRs = (config) => {
  const sinceStr = config.since.toISOString()
  log(`Fetching PRs updated since ${fmtDate(config.since)} …`)

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
      // Include if updated within our window (reviews, creation, merge)
      const hasRecentReview = (pr.reviews?.nodes ?? []).some((r) => r.submittedAt >= sinceStr)
      const createdRecently = pr.createdAt >= sinceStr
      const mergedRecently = pr.mergedAt && pr.mergedAt >= sinceStr
      const isOpen = !pr.mergedAt && !pr.closedAt

      if (hasRecentReview || createdRecently || mergedRecently || isOpen) {
        prs.push(pr)
      }
    }

    // Stop paginating if the oldest node is well before our window
    const oldest = nodes.at(-1)?.createdAt
    if (!conn.pageInfo.hasNextPage) break

    // If none of the nodes on this page are relevant and oldest is before window, stop
    const oldestDate = oldest ? new Date(oldest) : null
    if (oldestDate && oldestDate < config.since && !nodes.some((n) => !n.mergedAt && !n.closedAt)) break

    cursor = conn.pageInfo.endCursor
  }

  log(`  → ${prs.length} PRs retrieved across ${page} page(s)`)
  return prs
}

const fetchIssues = (config) => {
  log(`Fetching open issues with labels: ${FORECAST_LABELS.join(', ')} …`)

  const issues = []
  let cursor = null
  let page = 0

  while (true) {
    page++
    const vars = { owner: config.owner, name: config.name }
    if (cursor) vars.cursor = cursor

    const result = ghGraphql(FETCH_ISSUES_QUERY, vars)
    if (!result.ok) die(`Fetching issues: ${result.error}`)

    const conn = result.data.repository.issues
    const nodes = conn.nodes

    for (const issue of nodes) {
      const labels = (issue.labels?.nodes ?? []).map((l) => l.name)
      if (FORECAST_LABELS.some((tag) => labels.includes(tag))) {
        issue._labels = labels
        issues.push(issue)
      }
    }

    if (!conn.pageInfo.hasNextPage) break
    cursor = conn.pageInfo.endCursor
  }

  log(`  → ${issues.length} forecast issues across ${page} page(s)`)
  return issues
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
 * Paginate through all items in a project and collect status + sprint data.
 * Returns { statuses: {number: status}, items: {number: {status, sprint}} }
 */
const fetchProjectItems = (config, projectId) => {
  const statuses = {}
  const items = {}
  let cursor = null

  while (true) {
    const vars = { projectId }
    if (cursor) vars.cursor = cursor

    const result = ghGraphql(FETCH_PROJECT_ITEMS_QUERY, vars)
    if (!result.ok) {
      log(`  → Project items error: ${result.error}`)
      return { statuses: {}, items: {} }
    }

    const conn = result.data.node.items

    for (const item of conn.nodes) {
      const content = item.content
      if (!content?.number) continue

      const repoName = content.repository?.nameWithOwner ?? ''
      if (repoName && repoName !== config.repo) continue

      const statusField = item.fieldValues.nodes.find((fv) => fv.field?.name === STATUS_FIELD && fv.name)
      const iterField = item.fieldValues.nodes.find((fv) => fv.startDate && fv.title)

      const status = statusField?.name ?? null
      const sprint = iterField
        ? {
            title: iterField.title,
            startDate: iterField.startDate,
            duration: iterField.duration,
          }
        : null

      if (status) {
        statuses[content.number] = status
        items[content.number] = { status, sprint }
      }
    }

    if (!conn.pageInfo.hasNextPage) break
    cursor = conn.pageInfo.endCursor
  }

  return { statuses, items }
}

/**
 * Fetch project data from two boards:
 *   - "Mobile PRs" for PR pipeline statuses (on deck, etc.)
 *   - "VA Mobile App Team" for issue sprint/iteration data (forecast)
 */
const fetchProjectData = (config) => {
  // PR pipeline board
  log('Fetching PR project status data …')
  const prProject = findProject(config, PR_PROJECT_KEYWORDS)
  let prStatuses = {}
  if (prProject) {
    log(`  → Using PR project: "${prProject.title}"`)
    const prData = fetchProjectItems(config, prProject.id)
    prStatuses = prData.statuses
    log(`  → ${Object.keys(prStatuses).length} PRs with status data`)
  } else {
    log('  → PR project board not found')
  }

  // Sprint/issue board
  log('Fetching sprint project data …')
  const sprintProject = findProject(config, SPRINT_PROJECT_KEYWORDS)
  let issueData = {}
  if (sprintProject) {
    log(`  → Using sprint project: "${sprintProject.title}"`)
    const sprintData = fetchProjectItems(config, sprintProject.id)
    issueData = sprintData.items
    log(`  → ${Object.keys(issueData).length} items with sprint data`)
  } else {
    log('  → Sprint project board not found')
  }

  return { prStatuses, issueData }
}

// ── Transform (pure) ───────────────────────────────────────────────────────────

const filterApprovedPRs = (prs, sinceStr) => {
  return prs.filter((pr) =>
    pr.reviews.nodes.some((r) => r.state === 'APPROVED' && QA_TEAM.has(r.author?.login) && r.submittedAt >= sinceStr),
  )
}

const filterSentBackPRs = (prs, sinceStr) => {
  return prs.filter((pr) =>
    pr.reviews.nodes.some(
      (r) => r.state === 'CHANGES_REQUESTED' && QA_TEAM.has(r.author?.login) && r.submittedAt >= sinceStr,
    ),
  )
}

const filterOnDeckPRs = (prs, projectStatuses) => {
  const onDeckStatuses = new Set(['Ready for QA', 'PR in QA'])
  return prs.filter((pr) => {
    const status = projectStatuses[pr.number]
    return status && onDeckStatuses.has(status)
  })
}

// Statuses from the "VA Mobile App Team" sprint board.
// "In Progress" and "PR & QA" are the strongest signal a PR is imminent.
const IN_PROGRESS_STATUSES = new Set(['In Progress', 'PR & QA'])
const DONE_STATUSES = new Set(['Done', 'Released', 'Closed', 'On Hold'])

/**
 * Determine if a sprint is current based on its start date and duration.
 */
const isCurrentSprint = (sprint, now) => {
  if (!sprint?.startDate || !sprint?.duration) return false
  const start = new Date(sprint.startDate + 'T00:00:00Z')
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + sprint.duration)
  return now >= start && now <= end
}

/**
 * Filter forecast issues to only those in the active sprint on the project board.
 * Attach _projectStatus and _sprint to each issue for rendering.
 */
const filterForecastIssues = (issues, issueData, now) => {
  const inSprint = []

  for (const issue of issues) {
    const data = issueData[issue.number]
    if (!data) continue

    const { status, sprint } = data

    // Skip completed/on-hold work
    if (DONE_STATUSES.has(status)) continue

    const currentSprint = isCurrentSprint(sprint, now)

    // Include if: in current sprint with an active status, OR actively in progress
    if (currentSprint || IN_PROGRESS_STATUSES.has(status)) {
      issue._projectStatus = status
      issue._sprint = sprint
      issue._inProgress = IN_PROGRESS_STATUSES.has(status)
      inSprint.push(issue)
    }
  }

  // Sort: In Progress first, then by status
  inSprint.sort((a, b) => {
    if (a._inProgress && !b._inProgress) return -1
    if (!a._inProgress && b._inProgress) return 1
    return (a._projectStatus ?? '').localeCompare(b._projectStatus ?? '')
  })

  return inSprint
}

const buildModel = (config, prs, issues, projectData) => {
  const sinceStr = config.since.toISOString()
  const { prStatuses, issueData } = projectData

  const approved = filterApprovedPRs(prs, sinceStr)
  const sentBack = filterSentBackPRs(prs, sinceStr)
  const onDeck = filterOnDeckPRs(prs, prStatuses)
  const forecast = filterForecastIssues(issues, issueData, config.now)

  // Total tagged issues (before sprint filter) for context
  const totalTaggedIssues = issues.length

  // QA capacity: count unique QA determinations in our window
  let qaApprovals = 0
  let qaSendBacks = 0
  for (const pr of prs) {
    for (const r of pr.reviews?.nodes ?? []) {
      if (!QA_TEAM.has(r.author?.login) || r.submittedAt < sinceStr) continue
      if (r.state === 'APPROVED') qaApprovals++
      if (r.state === 'CHANGES_REQUESTED') qaSendBacks++
    }
  }

  return {
    config,
    approved,
    sentBack,
    onDeck,
    forecast,
    totalTaggedIssues,
    qaApprovals,
    qaSendBacks,
    qaDeterminations: qaApprovals + qaSendBacks,
    hasProjectData: Object.keys(prStatuses).length > 0,
    hasSprintData: Object.keys(issueData).length > 0,
  }
}

// ── View (pure) ────────────────────────────────────────────────────────────────

const prLink = (pr) => `[${pr.title} (#${pr.number})](${pr.url})`
const issueLink = (issue) => `[${issue.title} (#${issue.number})](${issue.url})`

const renderPRList = (items, linkFn) => {
  if (!items.length) return '_None._\n'
  return (
    items
      .map((item) => {
        const author = item.author?.login ?? ''
        return `- ${linkFn(item)} — ${author}`
      })
      .join('\n') + '\n'
  )
}

const renderForecastList = (items, linkFn) => {
  if (!items.length) return '_None._\n'
  return (
    items
      .map((item) => {
        const author = item.author?.login ?? ''
        const status = item._projectStatus ?? ''
        return `- ${linkFn(item)} — ${author} (${status})`
      })
      .join('\n') + '\n'
  )
}

const renderReport = (model) => {
  const {
    config,
    approved,
    sentBack,
    onDeck,
    forecast,
    totalTaggedIssues,
    qaApprovals,
    qaSendBacks,
    qaDeterminations,
    hasProjectData,
    hasSprintData,
  } = model

  const lines = []
  const emit = (...parts) => lines.push(parts.join(''))

  emit(`# QA Bug Scrub Report — ${REPO}`)
  emit()
  emit(`_${fmtDate(config.since)} → ${fmtDate(config.now)} · ${config.days}-day window_`)

  // ── PRs Approved ──────────────────────────────────────────────────────────
  emit()
  emit(`## PRs Approved in Last ${config.days} Days`)
  emit()
  emit(renderPRList(approved, prLink))

  // ── PRs Sent Back ─────────────────────────────────────────────────────────
  emit()
  emit(`## PRs Sent Back in Last ${config.days} Days`)
  emit()
  emit(renderPRList(sentBack, prLink))

  // ── PRs On Deck ───────────────────────────────────────────────────────────
  emit()
  emit('## PRs On Deck')
  emit()

  if (hasProjectData) {
    if (!onDeck.length) {
      emit('_No PRs currently in "Ready for QA" or "PR in QA"._')
    } else {
      emit(renderPRList(onDeck, prLink))
    }
  } else {
    emit('_Project status data not available. To enable:_')
    emit()
    emit('```')
    emit('gh auth refresh --scopes read:project')
    emit('```')
  }

  // ── PR Forecast ───────────────────────────────────────────────────────────
  emit()
  emit('## PR Forecast')
  emit()
  emit(`Issues tagged **${FORECAST_LABELS.join('** or **')}** in the active sprint that may generate incoming PRs:`)
  emit()

  if (!hasSprintData) {
    emit('_Sprint project data not available — cannot determine active sprint. To enable:_')
    emit()
    emit('```')
    emit('gh auth refresh --scopes read:project')
    emit('```')
  } else if (!forecast.length) {
    emit('_No matching issues in the active sprint._')
  } else {
    const inProgress = forecast.filter((i) => i._inProgress)
    const upcoming = forecast.filter((i) => !i._inProgress)

    if (inProgress.length) {
      emit(`### In Progress (${inProgress.length})`)
      emit()
      emit(renderForecastList(inProgress, issueLink))
    }
    if (upcoming.length) {
      emit(`### Sprint Backlog (${upcoming.length})`)
      emit()
      emit(renderForecastList(upcoming, issueLink))
    }

    emit(`> **${forecast.length}** sprint issues → **${totalTaggedIssues}** total in backlog`)
  }

  // ── QA Capacity Health Check ──────────────────────────────────────────────
  emit()
  emit('## QA Capacity Health Check')
  emit()

  emit(`- **QA Approvals (this week):** ${qaApprovals}`)
  emit(`- **QA Send-backs (this week):** ${qaSendBacks}`)
  emit(`- **Total QA Determinations:** ${qaDeterminations}`)
  emit(`- **PRs On Deck:** ${onDeck.length}`)
  emit(`- **Forecast Issues:** ${forecast.length}`)

  emit()
  if (onDeck.length > qaDeterminations * 2) {
    emit('> **Warning:** On-deck queue is growing faster than QA throughput — consider load balancing.')
  } else if (onDeck.length === 0 && forecast.length === 0) {
    emit('> **Healthy:** Queue is clear with no forecast items — QA has capacity.')
  } else {
    emit('> **Healthy:** QA throughput appears healthy relative to current queue depth.')
  }

  emit()
  emit(`> QA team: ${[...QA_TEAM].sort().join(', ')}`)
  emit()

  return lines.join('\n')
}

// ── Main ───────────────────────────────────────────────────────────────────────

const main = () => {
  const config = parseConfig(process.argv.slice(2))

  // Preflight
  const auth = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' })
  if (auth.status !== 0) die('gh CLI is not authenticated. Run: gh auth login')

  // IO
  const prs = fetchPRs(config)
  const issues = fetchIssues(config)
  const projectData = config.includeProject ? fetchProjectData(config) : { prStatuses: {}, issueData: {} }

  // Transform
  const model = buildModel(config, prs, issues, projectData)

  // View
  const report = renderReport(model)

  // Output
  process.stdout.write(report + '\n')
}

main()
