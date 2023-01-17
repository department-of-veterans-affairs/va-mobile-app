---
sidebar_position: 1
sidebar_label: Overview
---
# GitHub Actions

## Overview
GitHub Actions is used to do most of our non-build operations and automation. It can be much easier to tune the triggers and has most of the tools we need pre-installed to do the work within GitHub and doesn't require a complicated connection from CircleCI to authorize. 

## Automation Robot
We use our GitHub automation robot account to do any work in Actions. `va-mobile-automation-robot` account credentials are located in the VA Mobile vault in 1Password.

I would recommend that you use this account in a separate browser from your every-day browser. It's easier to have the two accounts at hand if one is running in Chrome and the other is only used in say Safari. 

Access in Actions is granted with [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). 

## Workflows
This is the current list of things automated by GitHub Workflows

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
- Workflow that checks merges to main for a message that matches the version format from the slash merge and then tags the commit with that version number, kicking off the [CircleCI workflow](../CircleCI/Workflows.md/#release_build)

## Local Testing

You can test GitHub Actions on your local machine using [act CLI tool](https://github.com/nektos/act)

You can find saved test data used in my local testing [here](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/.github/test-data)
