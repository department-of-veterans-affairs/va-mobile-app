---
sidebar_position: 1
sidebar_label: Overview
---

# GitHub Actions

## Overview

[GitHub Actions](https://github.com/features/actions) is used to automate several processes for our project, including build automation, releases, ensuring code quality, and other workflows related to project management. Our workflows can be found on the va-mobile-app repo's [Actions tab](https://github.com/department-of-veterans-affairs/va-mobile-app/actions).

## Workflows

Our workflows can curently be categorized into three types: Release and Build workflows, Code Quality workflows, and Other workflows.

## Build and Release Workflows

We [release](/docs/Operations/Releases/release-process) a new version of the app to app stores every 2 weeks. The process of building, packaging, uploading the app, updating screenshots and release notes manually can be very time consuming.  We use a combination of [GitHub Actions](https://docs.github.com/en/actions) and [fastlane](https://fastlane.tools/) to automate these processes with a combination of git branching strategy, scheduled jobs, and scripting. 

[View Build and Release Workflows](/docs/Engineering/DevOps/Automation%20Code%20Docs/GitHub%20Actions/BuildReleaseWorkflows)

## Code Quality Workflows

Our automations also help us prevent bad code from shipping out by performing linting and running unit tests before PRs are allowed to pass, keeping our dependencies up todate, scanning for vulnerability, and automating [TestRail](https://www.testrail.com/) runs. 

[View Code Quality Workflows](/docs/Engineering/DevOps/Automation%20Code%20Docs/GitHub%20Actions/CodeQualityWorkflows)

## Other Workflows

We also have other workflows to help us with more general tasks, such as getting a use added to our GitHub repo, sending Slack messages, enabling slash commands on our GitHub issues, and deploying our this documentation site. 

[View Other Workflows](/docs/Engineering/DevOps/Automation%20Code%20Docs/GitHub%20Actions/OtherWorkflows) 

### Code Quality

-   Code checks: linting and automated test runners
-   Vulnerability checking with [CodeQL](https://codeql.github.com/)

## Automation Robot

We use our GitHub automation robot account to do any work in Actions. `va-mobile-automation-robot` account credentials are located in the VA Mobile vault in 1Password.

I would recommend that you use this account in a separate browser from your every-day browser. It's easier to have the two accounts at hand if one is running in Chrome and the other is only used in say Safari. 

Access in Actions is granted with [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## Local Testing

You can test GitHub Actions on your local machine using [act CLI tool](https://github.com/nektos/act)

You can find saved test data used in my local testing [here](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/.github/test-data)
