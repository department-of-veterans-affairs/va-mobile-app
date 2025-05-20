// scripts/fetchGitHubData.js

const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')
require('dotenv').config()

const GITHUB_TOKEN = process.env.DOCS_RELEASE_REPORT_PAT
const OWNER = 'department-of-veterans-affairs' // Customize this
const REPO = 'va-mobile-app' // Customize this

const OUTPUT_PATH = path.resolve('static', 'data', 'github-milestones.json')

async function fetchMilestonesAndIssues() {
  try {
    const headers = {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    }

    const milestonesRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/milestones?state=closed&per_page=100`,
      { headers },
    )

    const milestones = await milestonesRes.json()

    const filteredMilestones = milestones
      .filter((m) => m.title.toLowerCase().startsWith('v') && m.due_on)
      .sort((a, b) => new Date(b.due_on) - new Date(a.due_on)) // Descending

    const data = []

    for (const milestone of filteredMilestones) {
      const issuesRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=closed&milestone=${milestone.number}&per_page=100`,
        { headers },
      )

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

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2))
    console.log(`✅ GitHub milestone data written to ${OUTPUT_PATH}`)
  } catch (err) {
    console.error('❌ Failed to fetch GitHub data:', err)
  }
}

fetchMilestonesAndIssues()
