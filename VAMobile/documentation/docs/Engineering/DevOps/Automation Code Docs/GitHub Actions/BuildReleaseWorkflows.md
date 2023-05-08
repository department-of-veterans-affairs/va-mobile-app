---
sidebar_position: 2
sidebar_label: Build and Release Workflows
---

# Build and Release Workflows
This section contains all of the workflows that are related to our packaging our apps and automating our [Release Process](/docs/Operations/Releases/release-process). Use the sidebar to the right to jump directly to workflows.  

Each workflows has descriptions, triggers, and input/output parameters if applicable. See the [GitHub Actions Documentation](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) for more details about [triggers](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow) and [input/output parameters](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#defining-inputs-outputs-and-secrets-for-reusable-workflows).

## Build Automation Capabilities
The build system currently allows us to build in multiple ways and for multiple configurations.
- Staging API or Production API
- Special Release Candidate configuration
- Options to upload to a specific lane or Test Flight group
- Configurations to create one-off builds for feature branch testing prior to merging
- Queueing capabilities to avoid build collisions on build numbers
- Dependency installation and caching to speed up delivery
- Slack integration to send useful messages to our DSVA Slack channels to raise errors and to indicate success

## Build Workflows
- [Daily QA builds](#daily-qa-build-qa_build)
- [Release Candidate (RC) builds](#release-candidate-build-release_candidate_build)
- [On Demand builds](#on-demand-build-on_demand_build)
- [Release builds and submission to App/Play Stores for approval](#release-build-release_build)
- [Scheduled "Go Live" every other Tuesday](#go-live-go_live)

## Reusable Build Workflows
All of our build related workflows use one of following two workflows with different parameters passed in, making them the two most important workflows of our build automation.

### Reusable iOS Workflow (`build_ios`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/build_ios.yml)

#### Description
Creates an iOS build using the passed parameters and distributes to TestFlight / App Connect. Starts a Slack thread in the channel and updates the thread with the results of each build job.

#### Trigger
Can only be triggered by other workflows.

```yaml
on:
  workflow_call:
```

#### Parameters

##### Inputs
| Parameter       | Description                                                                                                                                              | Type   | Options                            | Default |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------- | ------- |
| environment     | Used to determine the environment variables to build the app with                                                                                        | string | test, staging, production          | staging |
| lane            | Specifies which fastlane lane to run                                                                                                                     | string | qa, rc, review, release, on_demand | qa      |
| notes           | Release notes that will show next to the version in TestFlight. Fastlane will default to "New QA version for {{DATE_TIME}}" if nothing is passed         | string |                                    |         |
| ref             | Branch or tag that we want to build from.  Defaults to the branch/tag that triggered                                                                     | string |                                    |         |
| slack_thread_ts | Timestamp of the Slack thread where build related messages should be sent. Gets assigned to the SLACK_THREAD_TS environment variable that Fastlane uses. | string |                                    |         |
| tf_group        | TestFlight group to distribute to. Fastlane defaults to "Development Team" if nothing is passed                                                          | string |                                    |         |
| version         | Version number to use for production release. Passing "qa" here will auto increment upon the latest version in the app stores                            | string |                                    | qa      |

---

### Reusable Android Workflow (`build_android`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/build_android.yml)

#### Description
Creates an iOS build using the passed parameters and distributes to TestFlight / App Connect. Starts a Slack thread in the channel and updates the thread with the results of each build job.

#### Trigger
Can only be triggered by other workflows.

```yaml
on:
  workflow_call:
```

#### Parameters

##### Inputs

| Parameter       | Description                                                                                                                                              | Type   | Options                            | Default |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------- | ------- |
| environment     | Used to determine the environment variables to build the app with                                                                                        | string | test, staging, production          | staging |
| lane            | Specifies which fastlane lane to run                                                                                                                     | string | qa, rc, review, release, on_demand | qa      |
| notes           | Release notes that will show next to the version in TestFlight. Fastlane will default to "New QA version for {{DATE_TIME}}" if nothing is passed         | string |                                    |         |
| ref             | Branch or tag that we want to build from.  Defaults to the branch/tag that triggered                                                                     | string |                                    |         |
| slack_thread_ts | Timestamp of the Slack thread where build related messages should be sent. Gets assigned to the SLACK_THREAD_TS environment variable that Fastlane uses. | string |                                    |         |
| ps_track        | Google Play Console track to distribute to. Fastlane defaults to "Development Team" if nothing is passed                                                          | string |                                    |         |
| version         | Version number to use for production release. Passing "qa" here will auto increment upon the latest version in the app stores                            | string |                                    | qa      |

---

## Build Workflows
These workflows utilize the reusable workflows above with specified parameters.  Some are triggered by a tag or on a schedule.

### Daily QA Build (`qa_build`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/qa_build.yml)

#### Description
This workflow runs every night to create and upload the QA version of the app configured for the staging environment for both Android and iOS.  It uses the [`build_ios`](#build_ios) and [`build_android`](#build_android) workflows with their default parameters.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

#### Triggers
Runs every Weekday at 0400 UTC from the develop branch

```yaml
on:
  schedule:
    - cron: '0 4 * * 1,2,3,4,5'
```


---

### On Demand Build (`on_demand_build`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml)


#### Description
Builds versions for both Android and iOS using the specified environment and branch and iOS and makes them available via TestFlight and Firebase App Distribution.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

#### Triggers
Manually via the [GitHub Actions UI](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml)

```yaml
on:
  workflow_dispatch:
```

#### Parameters

##### Inputs


| Parameter   | Description                                                                       | Type   | Options                   | Default | Required |
| ----------- | --------------------------------------------------------------------------------- | ------ | ------------------------- | ------- | -------- |
| environment | Used to determine the environment variables to build the app with                 | string | test, staging, production | staging | Yes      |
| notes       | The text you want to appear in the TestFlight and Firebase App Tester description | string |                           |         | Yes      |
---
### Release Candidate Build (`release_candidate_build`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_candidate_build.yml)

#### Description
This workflow runs every time a tag with RC-v`int.int.int` pattern is pushed to the origin. It builds release candidates pointed at staging for our QA team to test using the [`build_ios`](#build_ios) and [`build_android`](#build_android) workflows. Those jobs use the branch/tag that triggered the workflow, in this case RC-v`int.int.int`. 

Creates a Slack thread in the channel and updates the thread with the results of each build job.

#### Triggers
Tags matching the regular expression `/^RC-v.d+.d+.d+$/`. Our [`release_branch.sh`](/docs/Engineering/DevOps/Automation%20Code%20Docs/Scripts#release_branchsh) script creates this tag at the end of every sprint.

```yaml
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'
```

---

### Release Build (`release_build`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_build.yml)


#### Description
This workflow runs every time a tag with v`int.int.int` pattern is pushed to the origin. It builds production versions for both Android and iOS and submits them to the app stores for review.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

#### Triggers
Tags matching the regular expression `/^vd+.d+.d+/`. Our [`release_branch.sh`](/docs/Engineering/DevOps/Automation%20Code%20Docs/Scripts#release_branchsh) script creates this tag at the end of every sprint.

```yaml
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'
```
---

### Go Live (`go_live`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/go_live.yml)


#### Description
Job runs on release day to send approved versions to the stores
#### Triggers
```yaml
cron: '0 14 * * 2'
```
Runs every Tuesday at 1400 UTC on only the main branch

## Release Workflows
These workflows are related to are release process which occurs every 2 weeks.  Check the [Release Process](/docs/Operations/Releases/release-process) for a high-level overview.

### New Release Branch (`new_release_branch`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/new_release_branch.yml)

#### Description
Runs our [`release_branch.sh`](/docs/Engineering/DevOps/Automation%20Code%20Docs/Scripts#release_branchsh) script, which checks to see if we are at the beginning of a new sprint, and if so, cuts a new release/v`int.int.int` branch from the `develop` branch and tags it with RC-v`int.int.int`. The command in the script also ends up triggering the [`release_branch_issue`](#release_branch_issue) and [`release_candidate_build`](#release_candidate_build) workflows by tagging the branch with RC-v`int.int.int` and c.

#### Trigger
Every Wednesday at 06:00 UTC, 2:00AM ET, 11:00PM (Tues) PT or manually via GitHub Actions UI.
```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: '00 6 * * 3'
```

---

### New Release Issue (`release_branch_issue`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/new_release_branch.yml)

#### Description
This automated workflow creates the release ticket for every release. 

This ticket runs any time a release branch is created that matches our strategy of `release/^v[0-9]+\.[0-9]+\.[0-9]+$` and does the following:

- Scrapes the version from the GitHub reference
- Calculates the QA, Product, and VA Due Dates for the ticket
- Calculates the Release Date for the specified version
- Creates a table of all the Sev-1 and Sev-2 bugs that are open in the repository
- Creates an issue from the `release_ticket` GitHub Issue Template
- Creates a TestRail Run and Milestone for QA regression testing and tracking
- Adds the TestRail run graph to the ticket after the run has been created

#### Trigger
Runs on every branch create and creates a new ticket only if the branch name matches `release/^v[0-9]+\.[0-9]+\.[0-9]+$`

```yaml
on:
  create:
```

#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_branch_issue.yml)

---

### Approve Slash Command (`approve_command`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/approve_command.yml)

#### Description
Workflow for the `/approve` command in GitHub Issues. Workflow is made available in Issues by the [`slash_commands`](#slash_commands) workflow.

The current version of the workflow looks for a comment in issues that starts with `/approve`. The command should be immediately followed by a version string that matches the version regex `/^vd+.d+.d+$/` 

The current logic on this trigger is pretty brittle and if the admin doesn't do it correctly it can have some incorrect effects that need to get fixed with a new comment that is formatted correctly. There is likely some work to make this better, but there is some time needed to sort out the logic and have the command send the correct message back to the issue and to tag whoever initiated the command.

This command calls the `release_pull_request` workflow during execution.

#### Trigger
Workflow is triggered when a user types `/approve` into a GitHub Issue and clicks the comment button. See [`slash_commands`](#slash_commands) for more info.

```yaml
on:
  repository_dispatch:
    types: [ approve-command ]
```

#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/approve_command.yml)


---

### Merge to main and Create PR to develop (`release_pull_request`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/release_pull_request.yml)

#### Description
This Workflow runs when called by another workflow and merges the release branch changes to `main` and then creates a PR for any branch updates to be pulled back into `develop`

#### Trigger
Runs when called by another Workflow

```yaml
on:
  workflow_call:
```

#### Parameters

##### Inputs
| Name    | Description                 | type   | required? |
|---------|-----------------------------|--------|-----------|
| version | Version Number (eg. v1.1.0) | string | yes       |

##### Secrets
| Name           | Description                                                                       | type   | required? |
|----------------|-----------------------------------------------------------------------------------|--------|-----------|
| GH_ACTIONS_PAT | PAT token from composite parent workflow. Should be PAT from our automation robot | string | yes       |

##### Outputs
| Name        | Description                                                                                                  | type   | 
|-------------|--------------------------------------------------------------------------------------------------------------|--------|
| devPrUrl    | URL string that points to the new PR to `develop` for any release branch specific changes                    | string | 
| releaseHash | String value of the commit hash on `main` that can point to the release changes as a single commit in GitHub | string |

#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_pull_request.yml)

---
