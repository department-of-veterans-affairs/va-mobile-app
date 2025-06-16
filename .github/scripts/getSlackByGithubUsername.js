const fs = require('fs');

const githubUsername = process.env.GITHUB_USERNAME;

if (!githubUsername) {
  console.error('Missing GITHUB_USERNAME env variable.');
  process.exit(1);
}

const users = JSON.parse(fs.readFileSync('.github/scripts/github-users.json', 'utf8'));
const user = users[githubUsername];

if (!user) {
  console.error(`No Slack user found for GitHub username: ${githubUsername}`);
  process.exit(1);
}

console.log(`::set-output name=slack_username::${user.slack}`);
