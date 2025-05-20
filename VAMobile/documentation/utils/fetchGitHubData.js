// Required built-in and third-party modules
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
require('dotenv').config()

// GitHub credentials and repo info from environment/config
const GITHUB_TOKEN = process.env.DOCS_RELEASE_REPORT_PAT
const OWNER = 'department-of-veterans-affairs'
const REPO = 'va-mobile-app'

// Output path for the JSON data file (Docusaurus will read this)
const OUTPUT_PATH = path.resolve('static', 'data', 'github-milestones.json')

// Main async function to fetch GitHub milestones and their closed issues/PRs
async function fetchMilestonesAndIssues() {
  // Handle missing token gracefully by writing empty array
  if (!GITHUB_TOKEN) {
    console.warn('⚠️  GITHUB_TOKEN not defined. Writing empty data file.')
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, '[]')
    return
  }

  try {
    // GitHub API request headers
    const headers = {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    }

    // Fetch all closed milestones from the GitHub repository
    const milestonesRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/milestones?state=closed&per_page=100`,
      { headers },
    )

    // Handle any API errors from GitHub
    if (!milestonesRes.ok) {
      const errorText = await milestonesRes.text()
      throw new Error(`GitHub API error: ${milestonesRes.status} ${milestonesRes.statusText}\n${errorText}`)
    }

    const milestones = await milestonesRes.json()

    // Filter milestones that:
    // - Start with "v" (e.g. "v1.0.0")
    // - Have a due date
    // Then sort them by due date (most recent first)
    const filteredMilestones = milestones
      .filter((m) => m.title.toLowerCase().startsWith('v') && m.due_on)
      .sort((a, b) => new Date(b.due_on) - new Date(a.due_on))

    const data = []

    // For each matching milestone, fetch all closed issues assigned to it
    for (const milestone of filteredMilestones) {
      const issuesRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=closed&milestone=${milestone.number}&per_page=100`,
        { headers },
      )

      const issues = await issuesRes.json()

      // Store the milestone info and its associated issues
      data.push({
        title: milestone.title,
        due_on: milestone.due_on,
        issues: issues.map((issue) => ({
          title: issue.title,
          number: issue.number,
          url: issue.html_url,
          isPR: !!issue.pull_request, // Flag PRs separately
        })),
      })
    }

    // Ensure the output directory exists and write the JSON file
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log(`✅ GitHub milestone data written to ${OUTPUT_PATH}`)
  } catch (err) {
    // Log any unexpected error and exit with failure code
    console.error('❌ Failed to fetch GitHub data:', err)
    process.exit(1)
  }
}

// Start the script
fetchMilestonesAndIssues()
