---
sidebar_position: 2
sidebar_label: Overview
---

# GitHub Actions

## Overview

[GitHub Actions](https://github.com/features/actions) is used to automate several processes for our project, including build automation, releases, ensuring code quality, and other workflows related to project management. Our workflows can be found on the va-mobile-app repo's [Actions tab](https://github.com/department-of-veterans-affairs/va-mobile-app/actions).

- [View documentation of all GitHub Actions workflows](./Workflows.mdx)

### Code Quality

- Code checks: linting and automated test runners
- Vulnerability checking with [CodeQL](https://codeql.github.com/)

## Automation Robot

We use our GitHub automation robot account to do any work in Actions. `va-mobile-automation-robot` account credentials are located in the VA Mobile vault in 1Password.

I would recommend that you use this account in a separate browser from your every-day browser. It's easier to have the two accounts at hand if one is running in Chrome and the other is only used in say Safari.

Access in Actions is granted with [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

## Local Testing

You can test GitHub Actions on your local machine using [act CLI tool](https://github.com/nektos/act)

[View saved test data used in local testing](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/.github/test-data)
