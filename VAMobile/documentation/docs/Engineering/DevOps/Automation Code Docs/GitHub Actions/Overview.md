---
sidebar_position: 1
sidebar_label: Overview
---
# GitHub Actions

## Overview
[GitHub Actions](https://github.com/features/actions) is used to the majority of our automation. We previously had our build automations in CircleCI but due to [a security incident](https://circleci.com/blog/jan-4-2023-incident-report/), the VA asked that all automations be moved off of Circle CI by March 23rd, 2023. Our workflows can be found on the va-mobile-app repo's [Actions tab](https://github.com/department-of-veterans-affairs/va-mobile-app/actions).

## Automation Robot
We use our GitHub automation robot account to do any work in Actions. `va-mobile-automation-robot` account credentials are located in the VA Mobile vault in 1Password.

I would recommend that you use this account in a separate browser from your every-day browser. It's easier to have the two accounts at hand if one is running in Chrome and the other is only used in say Safari. 

Access in Actions is granted with [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). 

## Workflows
This is the current list of things automated by GitHub Workflows

### Code Quality
- Code checks: linting and automated test runners
- Vulnerability checking with [CodeQL](https://codeql.github.com/)
### Build Workflows
- Daily QA builds
- Release Candidate (RC) builds
- On Demand builds
- Release builds
- Submission to App/Play Stores for approval
- Scheduled "Go Live" every other Tuesday
#### Build Automation Capabilities
The build system currently allows us to build in multiple ways and for multiple configurations.
- Staging API or Production API
- Special Release Candidate configuration
- Options to upload to a specific lane or Test Flight group
- Configurations to create one-off builds for feature branch testing prior to merging
- Queueing capabilities to avoid build collisions on build numbers
- Dependency installation and caching to speed up delivery
- Slack integration to send useful messages to our DSVA Slack channels to raise errors and to indicate success
### Non-build Workflows

- Adding a new user to the `va-mobile-team` in GitHub to grant write access in the repository and ZenHub.
- Automated updates for bundler and Fastlane plugins to keep the build system up to date. 
- Code QL scanning of commits.
- Test building of documentation site changes.
- Automated build and deploy of the documentation site.
- Ability to create `/` (slash) commands that will run from any GitHub issue.
- Automated creation of release tickets when a new release branch is created. Uses the `release_ticket.md` [template](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/ISSUE_TEMPLATE/release_ticket.md).  
- Automated creation of a TestRail run when a release ticket is created for QA regression testing.
- Automated creation of TestRail Milestone to track testing completion
- Automated updating of the QA run mermaid chart in release tickets when a TestRail run updates (There are limitations to this due to TestRail events API)
- Approve slash command that merges release branch to `main` and creates a PR from the release branch to merge any changes back to `develop`, then comments on the issue and closed it.
- Workflow that checks merges to main for a message that matches the version format from the slash merge and then tags the commit with that version number, kicking off the [GitHub Action workflow](../GitHub%20Actions/BuildWorkflows#release-build-release_buildd)

## Local Testing

You can test GitHub Actions on your local machine using [act CLI tool](https://github.com/nektos/act)

You can find saved test data used in my local testing [here](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/.github/test-data)
