# PR Report Tools

Scripts that query the GitHub GraphQL API for `department-of-veterans-affairs/va-mobile-app` and output markdown reports to stdout. All useful for various QA rituals and tasks.

## Requirements

- Node.js
- `gh` CLI, authenticated (`gh auth login`)
- Optional: `read:project` scope for project board data (`gh auth refresh --scopes read:project`)

## Architecture

Both scripts follow the same Elm-inspired layered architecture:

1. **Config** — parse CLI flags into a plain config object
2. **IO** — all `gh` CLI / GraphQL calls, returning raw data
3. **Transform** — pure functions that derive computed state from raw data
4. **View** — pure function that renders the model to a markdown string

`main()` sequences these layers. No shared mutable state between them.

---

## pr_velocity.js

Rolling PR velocity metrics, QA capacity estimate, and project status distribution.

```
node pr_velocity.js [--weeks N] [--no-project] > report.md
```

| Flag            | Default | Effect                        |
| --------------- | ------- | ----------------------------- |
| `-w, --weeks N` | `12`    | Rolling window length         |
| `--no-project`  | off     | Skip project board query      |

### How the math works

**Week bucketing.** Events are grouped by ISO week starting Monday. `weekKey()` computes the Monday of any date via `(getUTCDay() + 6) % 7`.

**Partial week exclusion.** The current (incomplete) week is excluded from all averages. Only fully elapsed weeks contribute. Division uses `n || 1` to avoid divide-by-zero when `--weeks 0` somehow slips through.

**45-day fetch buffer.** PR data is fetched starting 45 days before the rolling window's start date. Without this, PRs opened before the window but merged inside it would be missed, understating the merged count.

**Sent-back dedup.** Deduplicated per (PR, week). If 3 reviewers all request changes on PR #123 in the same week, that counts as 1 send-back for that week. This measures "how many PRs had friction" rather than "how many friction events occurred."

**QA determinations dedup.** Same per-(PR, week) dedup as sent-backs. A determination is an `APPROVED` or `CHANGES_REQUESTED` review from a QA team member. `COMMENTED` reviews are excluded — they don't represent a completed assessment.

**QA reviews NOT deduped.** Unlike determinations, the QA Reviews column counts every individual review event (including comments). This is intentional — it measures total QA activity/effort, not unique PR decisions.

**Sprint capacity estimate.** `weekly determination avg x 2`. Known limitations:
- **Overcounts** if a single PR receives QA attention in both weeks of a sprint (reviewed week 1, approved week 2 = counted as 2 determinations across the window).
- **Undercounts** if QA's queue runs dry during the window. This figure measures throughput (what QA did), not capacity (what they could do). The two converge only when the queue is never empty.

**Project status bar chart.** `PR Merged` is excluded from the bar chart normalization because it accumulates all historical merges and would flatten the scale for active pipeline stages. Its count appears in the footnote. If no project keyword matches ("mobile", "sprint", "va-mobile"), falls back to `projects[0]`.

---

## qa_bug_scrub.js

Weekly QA bug scrub meeting prep.

```
node qa_bug_scrub.js [--days N] [--no-project] > scrub.md
```

| Flag           | Default | Effect                         |
| -------------- | ------- | ------------------------------ |
| `-d, --days N` | `7`     | Lookback window in days        |
| `--no-project` | off     | Skip project board queries     |

### Sections

- **PRs Approved** — PRs with an `APPROVED` QA review in the window
- **PRs Sent Back** — PRs with a `CHANGES_REQUESTED` QA review in the window
- **PRs On Deck** — open PRs in "Ready for QA" or "PR in QA" on the **Mobile PRs** board
- **PR Forecast** — open issues tagged `front-end`/`back-end` in the current sprint on **VA Mobile App Team**, grouped by status:
  - *In Progress*: In Progress, PR & QA
  - *Sprint Backlog*: Todo, Ready to Work, Blocked, etc.
- **QA Capacity Health Check** — approval/send-back counts, queue depth, and a throughput health indicator

### How the math works

**Approved and Sent Back are not mutually exclusive.** A PR can appear in both lists if a QA member first requested changes, then later approved within the same window. This is intentional — it shows the full QA interaction for the period.

**QA counts are NOT deduped.** Unlike `pr_velocity.js`, the bug scrub script counts every individual review event. If 2 QA members both approve the same PR, that's 2 approvals. This reflects total QA effort for the window rather than unique PR decisions.

**Forecast inclusion logic.** An issue appears in the forecast if:
1. It's in the current sprint AND its status is not in {Done, Released, Closed, On Hold}, OR
2. Its status is In Progress or PR & QA, even if its sprint field is stale or unset.

Rule 2 is a safety net — it catches actively-worked items where the sprint field wasn't updated. The tradeoff is that long-stale "In Progress" issues from past sprints will keep appearing until their status is updated.

**Sprint boundary.** Uses `start ≤ now ≤ start + duration` (inclusive on both ends). On sprint transition days, issues from the ending sprint and the starting sprint can both appear.

**Label filtering is client-side.** The GitHub GraphQL API doesn't support OR-filtering across labels, so all open issues are fetched and filtered locally for `front-end` or `back-end` labels. This means the full open-issue set is paginated through on each run.

**Health check threshold.** The warning "queue is growing faster than QA throughput" fires when `onDeck > qaDeterminations x 2`. The `2x` multiplier is a heuristic, not derived from historical data. It's a rough "queue is at least 2 weeks deep" signal.

**Issue mutation.** `filterForecastIssues` attaches `_projectStatus`, `_sprint`, and `_inProgress` directly onto issue objects. This is a pragmatic shortcut — not strictly pure, but confined to the transform layer and consumed only by the view.

### Data sources

| Data              | Board                    |
| ----------------- | ------------------------ |
| PRs, reviews      | — (repo API)             |
| PR pipeline status| Mobile PRs               |
| Issues + sprint   | VA Mobile App Team       |
