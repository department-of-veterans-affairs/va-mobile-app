#!/usr/bin/env node
'use strict';

/**
 * PR Velocity Report — va-mobile-app
 *
 * Usage:
 *   node pr_velocity.js
 *   node pr_velocity.js --weeks 8
 *   node pr_velocity.js --no-project
 */

const { spawnSync } = require('child_process');

// ── Constants ──────────────────────────────────────────────────────────────────

const REPO_OWNER = 'department-of-veterans-affairs';
const REPO_NAME  = 'va-mobile-app';
const REPO       = `${REPO_OWNER}/${REPO_NAME}`;

const QA_TEAM = new Set(['eli-oat', 'SKMOstudio', 'digitalken']);

const STATUS_FIELD      = 'Status';
const DEFAULT_WEEKS     = 12;
const FETCH_BUFFER_DAYS = 45; // extra lookback to catch long-running PRs merged in-window

// Known statuses in pipeline order — used for display ordering in the report.
const PIPELINE_STATUSES = [
  'PR Active',
  'PR In Review',
  'Ready for QA',
  'PR in QA',
  'PR Approved',
  'PR Changes Requested',
  'PR Merged',
];

const HELP = `
Usage: node pr_velocity.js [options]

Options:
  -w, --weeks N    Rolling window in weeks (default: ${DEFAULT_WEEKS})
  --no-project     Skip GitHub Projects status data (faster)
  -h, --help       Show this help

Scopes required:
  repo             PR and review data (standard)
  read:project     Project status distribution (optional)
    → gh auth refresh --scopes read:project
`.trim();

// ── GraphQL queries ───────────────────────────────────────────────────────────
//
// Kept as module-level constants so the data shapes are easy to find and audit.

const FETCH_PRS_QUERY = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(
      first: 100
      after: $cursor
      orderBy: { field: CREATED_AT, direction: DESC }
      states: [OPEN, CLOSED, MERGED]
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number title state createdAt mergedAt
        author { login }
        reviews(first: 50, states: [APPROVED, CHANGES_REQUESTED, COMMENTED]) {
          nodes { author { login } state submittedAt }
        }
      }
    }
  }
}`;

const FIND_PROJECT_QUERY = `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    projectsV2(first: 20) {
      nodes { id title number }
    }
  }
}`;

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
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2SingleSelectField { name } }
              }
            }
          }
        }
      }
    }
  }
}`;

// ── Utilities ─────────────────────────────────────────────────────────────────

const log = (...args) => process.stderr.write(args.join(' ') + '\n');
const die = (msg)     => { log('Error:', msg); process.exit(1); };

// ── Config (init) ─────────────────────────────────────────────────────────────

/**
 * Parse process.argv into a Config object.
 * Pure — no IO.
 *
 * @param  {string[]} argv  Typically process.argv.slice(2)
 * @returns {{
 *   owner: string, name: string, repo: string,
 *   weeks: number, includeProject: boolean,
 *   since: Date, now: Date, fetchFrom: Date
 * }}
 */
const parseConfig = (argv) => {
  let weeks          = DEFAULT_WEEKS;
  let includeProject = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(HELP + '\n');
      process.exit(0);
    } else if ((arg === '--weeks' || arg === '-w') && argv[i + 1]) {
      weeks = parseInt(argv[++i], 10);
      if (isNaN(weeks) || weeks < 1) die('--weeks must be a positive integer');
    } else if (arg === '--no-project') {
      includeProject = false;
    }
  }

  const now   = new Date();

  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - weeks * 7);
  since.setUTCHours(0, 0, 0, 0);

  const fetchFrom = new Date(since);
  fetchFrom.setUTCDate(fetchFrom.getUTCDate() - FETCH_BUFFER_DAYS);

  return { owner: REPO_OWNER, name: REPO_NAME, repo: REPO, weeks, includeProject, since, now, fetchFrom };
};

// ── Effects (IO boundary) ──────────────────────────────────────────────────────
//
// All side effects live here! Each function accepts plain data, does one IO
// operation, and returns plain data. Nothing else. Nope.

/**
 * Run a GraphQL query via the gh CLI.
 * Returns a discriminated union so callers handle errors explicitly.
 *
 * @param  {string}                  query
 * @param  {Record<string, string>}  [variables]
 * @returns {{ ok: true, data: object } | { ok: false, error: string }}
 */
const ghGraphql = (query, variables = {}) => {
  const args = ['api', 'graphql', '-F', `query=${query}`];
  for (const [k, v] of Object.entries(variables)) {
    if (v != null) args.push('-F', `${k}=${v}`);
  }

  const result = spawnSync('gh', args, { encoding: 'utf8' });

  if (result.status !== 0) return { ok: false, error: result.stderr.trim() };

  const payload = JSON.parse(result.stdout);
  if (payload.errors) return { ok: false, error: JSON.stringify(payload.errors) };

  return { ok: true, data: payload.data ?? {} };
};

/**
 * Fetch all PRs within the config's fetch window, newest first.
 * Paginates automatically and stops once we pass the fetchFrom date.
 *
 * @param  {ReturnType<typeof parseConfig>} config
 * @returns {object[]}
 */
const fetchPRs = (config) => {
  const fetchFromStr = config.fetchFrom.toISOString();
  log(`Fetching PRs since ${config.fetchFrom.toISOString().slice(0, 10)} …`);

  const prs = [];
  let cursor = null;
  let page   = 0;

  while (true) {
    page++;
    const vars = { owner: config.owner, name: config.name };
    if (cursor) vars.cursor = cursor;

    const result = ghGraphql(FETCH_PRS_QUERY, vars);
    if (!result.ok) die(`Fetching PRs: ${result.error}`);

    const conn  = result.data.repository.pullRequests;
    const nodes = conn.nodes;

    for (const pr of nodes) {
      const createdInRange = pr.createdAt >= fetchFromStr;
      const mergedInRange  = pr.mergedAt && pr.mergedAt >= fetchFromStr;
      if (createdInRange || mergedInRange) prs.push(pr);
    }

    const oldest = nodes.at(-1)?.createdAt;
    if (!conn.pageInfo.hasNextPage || (oldest && oldest < fetchFromStr)) break;
    cursor = conn.pageInfo.endCursor;
  }

  log(`  → ${prs.length} PRs retrieved across ${page} page(s)`);
  return prs;
};

/**
 * Fetch all PR -> status mappings from the linked GitHub Projects V2 board.
 * Degrades gracefully if the read:project scope is missing or no project exists.
 *
 * @param  {ReturnType<typeof parseConfig>} config
 * @returns {Record<number, string>}
 */
const fetchProjectStatuses = (config) => {
  log('Fetching project status data …');

  const findResult = ghGraphql(FIND_PROJECT_QUERY, { owner: config.owner, name: config.name });
  if (!findResult.ok) {
    const scopeError = findResult.error.includes('INSUFFICIENT_SCOPES') ||
                       findResult.error.includes('read:project');
    log(scopeError
      ? '  → Skipping (missing read:project scope)\n     Fix: gh auth refresh --scopes read:project'
      : `  → Project query error: ${findResult.error}`
    );
    return {};
  }

  const projects = findResult.data.repository?.projectsV2?.nodes ?? [];
  if (!projects.length) {
    log('  → No GitHub Projects V2 linked to this repository');
    return {};
  }

  const KEYWORDS = ['mobile', 'sprint', 'va-mobile'];
  const project  = projects.find(p => KEYWORDS.some(kw => p.title.toLowerCase().includes(kw)))
                ?? projects[0];

  log(`  → Using project: "${project.title}"`);

  const statuses = {};
  let cursor = null;

  while (true) {
    const vars = { projectId: project.id };
    if (cursor) vars.cursor = cursor;

    const result = ghGraphql(FETCH_PROJECT_ITEMS_QUERY, vars);
    if (!result.ok) { log(`  → Project items error: ${result.error}`); return {}; }

    const conn = result.data.node.items;

    for (const item of conn.nodes) {
      const content = item.content;
      if (!content?.number) continue;

      const repoName = content.repository?.nameWithOwner ?? '';
      if (repoName && repoName !== config.repo) continue;

      const statusField = item.fieldValues.nodes.find(
        fv => fv.field?.name === STATUS_FIELD && fv.name
      );
      if (statusField) statuses[content.number] = statusField.name;
    }

    if (!conn.pageInfo.hasNextPage) break;
    cursor = conn.pageInfo.endCursor;
  }

  log(`  → ${Object.keys(statuses).length} PRs with status data`);
  return statuses;
};

// ── Transform --------------------────────────────────────────────────────────
//
// All functions here are pure: same input → same output, no side effects.

/**
 * Return the ISO date string (YYYY-MM-DD) of the Monday of the week
 * containing `date`.
 *
 * @param  {Date} date
 * @returns {string}
 */
const weekKey = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  // getUTCDay() → 0=Sun 1=Mon … 6=Sat. Days to subtract to reach Monday: (day+6)%7
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
};

/**
 * Build a sorted array of ISO week strings covering `since` through `now`.
 *
 * @param  {Date} since
 * @param  {Date} now
 * @returns {string[]}
 */
const buildWeekRange = (since, now) => {
  const weeks = [];
  const d     = new Date(weekKey(since) + 'T00:00:00Z');
  const end   = new Date(weekKey(now)   + 'T00:00:00Z');
  while (d <= end) {
    weeks.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return weeks;
};

/**
 * Bucket raw PR events into ISO week counts.
 *
 * Change-request counts are deduplicated per (PR, week) pair — if three
 * reviewers all request changes on the same PR in the same week, that's
 * one CR event, not three.
 *
 * @param  {object[]}                        prs
 * @param  {ReturnType<typeof parseConfig>}  config
 * @returns {{ weeks: string[], created: object, merged: object, changes: object, qaActs: object }}
 */
const computeMetrics = (prs, config) => {
  const sinceStr = config.since.toISOString();
  const inc      = (obj, key) => { obj[key] = (obj[key] ?? 0) + 1; };

  const created  = {};
  const merged   = {};
  const changes  = {};
  const qaActs   = {};
  const qaDeterm = {}; // unique PRs where QA submitted APPROVED or CHANGES_REQUESTED

  for (const pr of prs) {
    if (pr.createdAt >= sinceStr) {
      inc(created, weekKey(new Date(pr.createdAt)));
    }

    if (pr.mergedAt && pr.mergedAt >= sinceStr) {
      inc(merged, weekKey(new Date(pr.mergedAt)));
    }

    // Each Set de-duplicates events to once per PR per week.
    // crWeeks    — weeks where any reviewer requested changes on this PR
    // qaDetWeeks — weeks where a QA member made a determination (APPROVED or CHANGES_REQUESTED)
    //              Comments are excluded: they don't represent a completed assessment.
    const crWeeks    = new Set();
    const qaDetWeeks = new Set();

    for (const review of pr.reviews?.nodes ?? []) {
      if (!review.submittedAt || review.submittedAt < sinceStr) continue;

      const wk       = weekKey(new Date(review.submittedAt));
      const reviewer = review.author?.login ?? '';

      if (review.state === 'CHANGES_REQUESTED') crWeeks.add(wk);

      if (QA_TEAM.has(reviewer)) {
        if (['APPROVED', 'CHANGES_REQUESTED'].includes(review.state)) qaDetWeeks.add(wk);
        if (['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED'].includes(review.state)) inc(qaActs, wk);
      }
    }

    for (const wk of crWeeks)    inc(changes,  wk);
    for (const wk of qaDetWeeks) inc(qaDeterm, wk);
  }

  return { weeks: buildWeekRange(config.since, config.now), created, merged, changes, qaActs, qaDeterm };
};

/**
 * Compute rolling averages over completed (non-partial) weeks.
 *
 * @param  {{ weeks: string[], created: object, merged: object, changes: object, qaActs: object }} metrics
 * @param  {Date} now
 * @returns {{ nWeeks: number, created: number, merged: number, changes: number, qaActs: number }}
 */
const computeAverages = (metrics, now) => {
  const currentWeek = weekKey(now);
  const fullWeeks   = metrics.weeks.filter(w => w < currentWeek);
  const n           = fullWeeks.length || 1;
  const sum         = (obj) => fullWeeks.reduce((acc, w) => acc + (obj[w] ?? 0), 0);

  return {
    nWeeks:   fullWeeks.length,
    created:  sum(metrics.created)  / n,
    merged:   sum(metrics.merged)   / n,
    changes:  sum(metrics.changes)  / n,
    qaActs:   sum(metrics.qaActs)   / n,
    qaDeterm: sum(metrics.qaDeterm) / n,
  };
};

/**
 * Tally how many PRs currently sit in each project status.
 *
 * @param  {Record<number, string>} projectStatuses
 * @returns {Record<string, number>}
 */
const countStatuses = (projectStatuses) =>
  Object.values(projectStatuses).reduce((acc, status) => {
    if (status) acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

/**
 * Assemble the full application model from config and raw fetched data.
 * This is the Elm "update" — takes raw IO results and derives all computed state.
 * Pure function.
 *
 * @param  {ReturnType<typeof parseConfig>} config
 * @param  {object[]}                       prs
 * @param  {Record<number, string>}         projectStatuses
 */
const buildModel = (config, prs, projectStatuses) => {
  const metrics      = computeMetrics(prs, config);
  const averages     = computeAverages(metrics, config.now);
  const statusCounts = countStatuses(projectStatuses);

  return {
    config,
    metrics,
    averages,
    statusCounts,
    hasProjectData: Object.keys(projectStatuses).length > 0,
  };
};

// ── View  --------------──────────────────────────────────────────────────────
//
// renderReport takes the model and returns a markdown string. No IO, no mutation.

/**
 * Render a proportional ASCII bar (renders correctly in markdown code-free tables).
 *
 * @param  {number} n
 * @param  {number} maxN
 * @param  {number} [width=20]
 * @returns {string}
 */
const sparkbar = (n, maxN, width = 20) => {
  if (maxN === 0) return '░'.repeat(width);
  const filled = Math.round((n / maxN) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
};

const get = (obj, key) => obj[key] ?? 0;

/**
 * Render a markdown table from an array of row arrays.
 * First row is treated as the header.
 * `aligns` is an array of 'l' | 'r' | 'c' for each column.
 *
 * @param  {string[][]} rows
 * @param  {Array<'l'|'r'|'c'>} aligns
 * @returns {string}
 */
const mdTable = (rows, aligns) => {
  const sepCell = (a) => a === 'r' ? '---:' : a === 'c' ? ':---:' : '---';
  const [header, ...body] = rows;
  const sep = aligns.map(sepCell);
  return [header, sep, ...body].map(row => `| ${row.join(' | ')} |`).join('\n');
};

/**
 * Render the complete report as a markdown string.
 * Pure — no IO.
 *
 * @param  {ReturnType<typeof buildModel>} model
 * @returns {string}
 */
const renderReport = (model) => {
  const { config, metrics, averages, statusCounts, hasProjectData } = model;
  const { since, now } = config;

  const currentWeek = weekKey(now);
  const sinceStr    = since.toISOString().slice(0, 10);
  const nowStr      = now.toISOString().slice(0, 10);

  const lines = [];
  const emit  = (...parts) => lines.push(parts.join(''));

  // ── Header ──────────────────────────────────────────────────────────────────
  emit(`# PR Velocity — ${REPO}`);
  emit();
  emit(`_${sinceStr} → ${nowStr} · ${averages.nWeeks} full weeks_`);

  // ── Rolling averages ─────────────────────────────────────────────────────────
  emit();
  emit('## Rolling Weekly Averages');
  emit();

  const avgRows = [
    ['Metric',        'Per Week'],
    ['PRs Opened',    averages.created.toFixed(1)],
    ['PRs Merged',    averages.merged.toFixed(1)],
  ];
  if (averages.created > 0) {
    avgRows.push(['Merge Rate', `${(averages.merged / averages.created * 100).toFixed(1)}%`]);
  }
  avgRows.push(['Sent Back',   averages.changes.toFixed(1)]);
  avgRows.push(['QA Reviews',  averages.qaActs.toFixed(1)]);

  emit(mdTable(avgRows, ['l', 'r']));
  emit();
  emit(`> QA team: ${[...QA_TEAM].sort().join(', ')}`);

  // ── QA capacity estimate ─────────────────────────────────────────────────────
  const sprintCapacity = Math.round(averages.qaDeterm * 2);
  const readyForQA     = statusCounts['Ready for QA'] ?? 0;
  const inQA           = statusCounts['PR in QA']     ?? 0;
  const queueDepth     = readyForQA + inQA;

  const queueNote = hasProjectData
    ? `There are currently **${readyForQA}** PRs in "Ready for QA" and **${inQA}** in "PR in QA" — ` +
      (queueDepth >= 3
        ? 'the queue appears healthy, so this figure is likely a reasonable proxy for true capacity.'
        : 'the queue is thin, which means actual capacity may be higher than this figure suggests.')
    : 'Check the "Ready for QA" queue depth to gauge whether throughput approximates true capacity.';

  emit();
  emit('## QA Capacity Estimate');
  emit();
  emit(`**~${sprintCapacity} PRs per 2-week sprint** _(${averages.qaDeterm.toFixed(1)} determinations/week × 2)_`);
  emit();
  emit('A **QA determination** is counted when a QA team member submits an **Approved** or');
  emit('**Changes Requested** review on a PR. These are the two outcomes that represent a');
  emit('completed QA assessment. Comments are excluded — they don\'t indicate a decision was reached.');
  emit('Each PR counts at most once per week, regardless of how many QA team members reviewed it,');
  emit('so a PR assessed by all three QA reviewers in the same week still counts as one determination.');
  emit();
  emit(`The sprint figure is the rolling ${config.weeks}-week weekly average scaled to a 2-week window.`);
  emit('It may marginally overcount if a single PR spans two weeks of QA attention within one sprint,');
  emit('but this averages out across the rolling window.');
  emit();
  emit(`> **Throughput vs. capacity:** This measures what QA *did*, not what they *could* do.`);
  emit(`> The two figures converge only when QA's queue is consistently not empty. ${queueNote}`);

  // ── Week-by-week breakdown ───────────────────────────────────────────────────
  emit();
  emit('## Week by Week');
  emit();

  const weekRows = [['Week of', 'Opened', 'Merged', 'Sent Back', 'QA Reviews']];
  for (const w of [...metrics.weeks].reverse().slice(0, 20)) {
    const label = w === currentWeek ? `${w} _(current)_` : w;
    weekRows.push([
      label,
      String(get(metrics.created, w)),
      String(get(metrics.merged,  w)),
      String(get(metrics.changes, w)),
      String(get(metrics.qaActs,  w)),
    ]);
  }
  emit(mdTable(weekRows, ['l', 'r', 'r', 'r', 'r']));

  // ── Project status distribution ──────────────────────────────────────────────
  emit();
  emit('## Current Project Status');
  emit();

  if (hasProjectData) {
    // "PR Merged" is a historical accumulation, not a pipeline position —
    // exclude it from the scale so active stages are readable.
    const MERGED_STATUS = 'PR Merged';
    const activePipeline = PIPELINE_STATUSES.filter(s => s !== MERGED_STATUS);
    const maxCount = Math.max(...activePipeline.map(s => statusCounts[s] ?? 0), 1);

    const statusRows = [['Status', 'PRs', 'Distribution']];

    const shown = new Set();
    for (const status of activePipeline) {
      const c = statusCounts[status] ?? 0;
      shown.add(status);
      statusRows.push([status, String(c), sparkbar(c, maxCount)]);
    }

    // Surface any statuses not in our known pipeline list (except PR Merged)
    for (const [status, c] of Object.entries(statusCounts).sort()) {
      if (!shown.has(status) && status !== MERGED_STATUS) {
        statusRows.push([status, String(c), sparkbar(c, maxCount)]);
      }
    }

    emit(mdTable(statusRows, ['l', 'r', 'l']));

    const mergedCount = statusCounts[MERGED_STATUS] ?? 0;
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    emit();
    emit(`_${mergedCount} PR Merged · ${total} total tracked in project_`);
  } else {
    emit('_Not available. To enable:_');
    emit();
    emit('```');
    emit('gh auth refresh --scopes read:project');
    emit('```');
  }

  emit();
  return lines.join('\n');
};

// ── Main  ----------------------──────────────────────────────────────────────
//
// Sequences IO effects and pure transforms. Each step's output is the next
// step's input — there's no shared mutable state.

const main = () => {
  // 1. Init — parse argv into config (pure)
  const config = parseConfig(process.argv.slice(2));

  // 2. Preflight — confirm gh is authenticated
  const auth = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
  if (auth.status !== 0) die('gh CLI is not authenticated. Run: gh auth login');

  // 3. Effects — fetch raw data from GitHub (IO)
  const prs      = fetchPRs(config);
  const statuses = config.includeProject ? fetchProjectStatuses(config) : {};

  // 4. Transform — derive all computed state from raw data (pure)
  const model = buildModel(config, prs, statuses);

  // 5. View — render model to a string (pure)
  const report = renderReport(model);

  // 6. Output (IO)
  process.stdout.write(report + '\n');
};

main();
