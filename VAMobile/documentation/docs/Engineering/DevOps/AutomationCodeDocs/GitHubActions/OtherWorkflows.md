---
sidebar_position: 5
sidebar_label: Other Workflows
---
# Other Workflows

This is a list of all the reusable workflows in GitHub Actions and what they do.

In an effort to reduce the page size, large workflow code will be linked instead of being provided here.

## Check for linked issues in PRs (`check-linked-issues`)

[View the check linked issues workflow file](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/check-linked-issues.yml)

### Description

This workflow checks most pull requests to make sure there is an issue connected. This helps us build out release reports and manage tasks as they pass through the system. [Read more about how to connect a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).

## Trigger

This workflow triggers inside a pull request, [excluding a few branch names](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/check-linked-issues.yml#L17)

## Add User to va-mobile-team repo (`add_new_user`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/add_new_user.yml)

### Description

Workflow used to add a new user to the `flagship-mobile-team` in GitHub, which grants write and read access tot he `va-mobile-app` repository and to our ZenHub instance. 

### Trigger

Creation of `Add User to VA Flagship Mobile Team` [template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new/choose) in `va-mobile-app` repository. 

```yaml
on:
  issues:
    types: [labeled]
```

### Steps/Source

 Click for full source

```javascript
...
const extractUsernameRegex = /@[a-zA-Z-_0-9]+/;
const username = getFirstMatch(extractUsernameRegex, context.payload.issue.body).substring(1);


if(username) {
  await inviteToTeam(username)
  await addComment("User added successfully")
  await addLabels("complete")
  await closeIssue()
} else {
  // error
  const errorMessage = "Invalid username. Requires manual addition to team"
  // assign for manual approval and addition, add error label
  await addAssignees(EXCEPTION_ASSIGNEES)
  await addLabels("needs-approval")
  await addComment(errorMessage)
}
...
```



* * *

## Slash Command Dispatch (`slash_commands`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/slash_commands.yml)

### Description

Workflow sets up any slash commands that have been created to run in a newly created issue. 

Uses the [Slash Command Dispatch Action](https://github.com/peter-evans/slash-command-dispatch) from GitHub Marketplace

This can be used to add any more "chat ops"-type automations in the future by adding to the `commands:` option

### Trigger

Runs on every issue created comment and fires any slash commands installed if found.

```yaml
on:
  issue_comment:
    types: [created]
```

* * *

## Start Slack Thread (`start_slack_thread`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/start_slack_thread.yml)

### Description

Reusable job that sends a message to a specified channel in DSVA slack and starts a thread to keep from cluttering the Slack feed.

### Trigger
Runs when called by another workflow

```yaml
on:
  workflow_call:
```

### Parameters

| Name         | Description                                                                           | type   | default? |
| ------------ | ------------------------------------------------------------------------------------- | ------ | -------- |
| channel_name | Name of the Slack channel where the thread should be started                          |        |          |
| message      | String value of the message that will serve as the top of the thread in Slack channel | string | none     |

### Outputs

| Name      | Description                                                                                | type | default? |
| --------- | ------------------------------------------------------------------------------------------ | ---- | -------- |
| thread_ts | Timestamp of the Slack thread that was created. Gets passed to other steps for future use. |      |          |

* * *


#### Steps/Source

[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/update_testrail_run.yml)

* * *

## Documentation Site Workflows

### Deploy Site (`documentation_deploy`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/documentation_deploy.yml)

#### Description

Workflow that runs every day to update this documentation site with any approved changes.

#### Trigger

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "0 3 * * *" # Runs at 03:00 AM (UTC) every day (Check https://crontab.guru/)
```

Runs every day at 0300 UTC

### Steps/Source

[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/documentation_deploy.yml)

* * *

### Test Build (`documentation_test_build`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/documentation_test_build.yml)

#### Description

Automated workflow that runs on every PR that touches autogenerated content for this documentation site to make sure that not of the changes breaks the automatic build and deploy of the site. 

#### Trigger

Runs on every pull request to `develop` branch that touches the following paths:

-   `VAMobile/src/components/**`
-   `VAMobile/documentation/**`
-   `VAMobile/src/utils/hooks.tsx`

```yaml
on:
  pull_request:
    branches: [develop]
    paths: 
      - VAMobile/src/components/**
      - VAMobile/documentation/**
      - VAMobile/src/utils/hooks.tsx
```

#### Steps/Source

```yaml
test-deploy:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 16.x
        cache: yarn
        cache-dependency-path: VAMobile/yarn.lock
    - name: Test build
      working-directory: VAMobile
      run: |
        yarn install --frozen-lockfile
        cd documentation
        yarn install --frozen-lockfile
        yarn build
```
