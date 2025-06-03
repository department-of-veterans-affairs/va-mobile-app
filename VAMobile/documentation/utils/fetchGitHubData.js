const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
require('dotenv').config()

// GitHub credentials and repo info from environment/config
const GITHUB_TOKEN = process.env.DOCS_RELEASE_REPORT_PAT
const OWNER = 'department-of-veterans-affairs'
const REPO = 'va-mobile-app'
const OUTPUT_PATH = path.resolve('static', 'data', 'github-milestones.json')

// Utility: Write an empty JSON array to the output file
function writeEmptyFile() {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, '[]')
}

// Utility: Check GitHub rate limit from headers
function checkRateLimit(res) {
  const remaining = parseInt(res.headers.get('x-ratelimit-remaining'), 10)
  const reset = parseInt(res.headers.get('x-ratelimit-reset'), 10)
  if (remaining === 0) {
    const resetDate = new Date(reset * 1000)
    throw new Error(`⚠️ GitHub rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}`)
  }
}

async function fetchMilestonesAndIssues() {
  // Gracefully handle missing token
  if (!GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN not defined. Writing empty data file.')
    writeEmptyFile()
    return
  }

  try {
    const headers = {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    }

    // --- Fetch closed milestones ---
    const milestonesRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/milestones?state=closed&per_page=100`,
      { headers },
    )

    checkRateLimit(milestonesRes) // Check for rate limiting

    if (!milestonesRes.ok) {
      const errorText = await milestonesRes.text()
      throw new Error(`GitHub API error: ${milestonesRes.status} ${milestonesRes.statusText}\n${errorText}`)
    }

    const milestones = await milestonesRes.json()

    const filteredMilestones = milestones
      .filter((m) => m.title.toLowerCase().startsWith('v') && m.due_on)
      .sort((a, b) => new Date(b.due_on) - new Date(a.due_on))

    const data = []

    // --- Fetch closed issues for each milestone ---
    for (const milestone of filteredMilestones) {
      const issuesRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=closed&milestone=${milestone.number}&per_page=100`,
        { headers },
      )

      checkRateLimit(issuesRes) // Check again on issues fetch

      if (!issuesRes.ok) {
        const errorText = await issuesRes.text()
        throw new Error(
          `GitHub Issues API error for milestone ${milestone.number}: ${issuesRes.status} ${issuesRes.statusText}\n${errorText}`,
        )
      }

      const issues = await issuesRes.json()

      data.push({
        title: milestone.title,
        due_on: milestone.due_on,
        issues: issues.map((issue) => ({
          title: issue.title,
          number: issue.number,
          url: issue.html_url,
          isPR: !!issue.pull_request,
        })),
      })
    }

    // --- Write JSON to file ---
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log(`✅ GitHub milestone data written to ${OUTPUT_PATH}`)
  } catch (err) {
    // If something fails, log it and write an empty file so Docusaurus can still build
    console.error('❌ Failed to fetch GitHub data:', err.message)
    writeEmptyFile()
    process.exit(0) // Exit cleanly for build tools
  }
}

fetchMilestonesAndIssues()
