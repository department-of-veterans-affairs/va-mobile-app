---
sidebar_position: 4
label: Code Quality Workflows
---
# Code Quality Workflows
These workflows perform quality checks on our code to help prevent bugs or scan our code to keep them up to date or prevent vulnerabilities.

## Code Checks (`code_checks`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/code_checks.yml)

### Description

Runs our code linter, [eslint](https://eslint.org/) and our test runner, [jest](https://jestjs.io/) to run our tests.  Our PR's have these two jobs set as status checks.  They both must run successfuly before a PR can be merged.

Lint job uses the `yarn lint:ci` command.

In order to speed up test running, we use GitHub Action's [matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) feature to run test jobs in parallel.  We have a script called `setupTestMatrix` that gets a list of all of our unit tests, splits them into 5 groups, and run `yarn test` on each group.

### Trigger

```yaml
on:
  pull_request:
  push:
    branches:
      - main
      - develop
      - 'release/v**'
```

Runs on every pull request and any pushes to the branches listed above.

## CodeQL (`codeql`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/codeql.yml)

### Description

Runs mandatory Code QL scanning on the repository. This workflow was created and is maintained by the VA's GitHub group and should not be updated or removed without consent from that team in order to stay in compliance with VA security policy.

If you need to update the script, please read the comments in the workflow to see what can be added to scanning by the mobile team. 

### Trigger

```yaml
- cron: '27 2 * * 1'
```

Runs every Monday at 0227 UTC

Also runs on every push or pull request to `devlop` branch.

### Steps/Source

[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/codeql.yml)

* * *

## Update Bundler (`bundler_updates`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/bundler_updates.yml)

### Description

Automated workflow that runs every Wednesday to update all the installed bundler libraries and any installed Fastlane plugins for both the iOS and Android Fastfiles

### Trigger

Runs every Wednesday at 0700 UTC on only the `develop` branch or can be triggered manually.

```yaml
on:
  schedule:
    - cron: "0 7 * * 3"
  workflow_dispatch:
```

### Steps/Source

[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/bundler_updates.yml)

* * *


## Test Rail Workflows

### Create TestRail Milestone (`create_testrail_milestone`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/create_testrail_milestone.yml)

#### Description

Creates a new Sprint Milestone in TestRail that can be added to a test run and used for tracking in TestRail.

##### Trigger

Runs when called by another workflow

```yaml
on:
  workflow_call:
```

##### Parameters

###### Secrets

| Name           | Description                                                                                                                          | type   | required? |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------- |
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |

#### Outputs

| Name        | Description                                   | type   |
| ----------- | --------------------------------------------- | ------ |
| milestoneId | TestRail ID for the Milestone that is created | string |

#### Steps/Source

```yaml
create_milestone:
  outputs:
    milestoneId: ${{ steps.add_milestone.outputs.milestone }}
  runs-on: ubuntu-latest
  steps:
    - name: 'Add new sprint milestone in Testrail'
      id: add_milestone
      run: |
        dateRange="$(date '+%B %-d') - $(date -d '+13 days' '+%B %-d')"
        id=$(curl -X POST -H 'Content-Type: application/json' \
          -u "${{secrets.TEST_RAIL_USER}}:${{secrets.TEST_RAIL_KEY}}" \
          "https://dsvavsp.testrail.io//index.php?/api/v2/add_milestone/29" \
          -d '{"name": "Sprint: '"${dateRange}"'", "description": "Milestone for all testing performed during Sprint: '"${dateRange}"'", "start_on": '$(date +%s)', "due_on": '$(date -d '+13 days' '+%s')' }' |
          jq '.id')
        echo "id is $id"
        curl -X POST -H 'Content-Type: application/json' \
          -u "${{secrets.TEST_RAIL_USER}}:${{secrets.TEST_RAIL_KEY}}" \
          "https://dsvavsp.testrail.io//index.php?/api/v2/update_milestone/${id}" \
          -d '{"is_started":1}'
        echo ""
        echo "::set-output name=milestone::${id}"
```

* * *

### Start RC Run (`start_test_rail_run`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/start_test_rail_run.yml)

#### Description

This workflow creates a new TestRail Test Run for QA when called from another Workflow.

#### Trigger

Runs when called by another Workflow

```yaml
on:
  workflow_call:
```
#### Parameters

##### Inputs

| Name         | Description                                             | type   | required? |
| ------------ | ------------------------------------------------------- | ------ | --------- |
| version      | Version Number (eg. v1.1.0)                             | string | yes       |
| releaseDate  | Go-live date for release (eg. 06/21/2022)               | string | yes       |
| ticketNumber | Issue number for release ticket (eg. 3333)              | string | yes       |
| milestoneId  | TestRail Milestone ID for the run to be associated with | string | yes       |

##### Secrets

| Name           | Description                                                                                                                          | type   | required? |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------- |
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |

##### Outputs

| Name        | Description                                   | type   |
| ----------- | --------------------------------------------- | ------ |
| testrailUrl | URL String for the newly created TestRail run | string |

### Steps/Source

[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/start_test_rail_run.yml)

* * *

### Update Run (`update_testrail_run`)

[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/update_testrail_run.yml)

#### Description

This Workflow runs on a repository dispatch is received from automated TestRail webhooks. 

When the TestRail run is updated, it sends a webhook to the repository. This workflow is fired and then updated the mermaid diagram in the Release Ticket issue with the testing results so far in the run

NOTE: Currently, TestRail does not fire a webhook when a test is completed in the run, only when top-level meta-data has been updated in the Run. We have requested an enhancement to TestRail to change this, but there is no documented tracking available for enhancement requests from the TestRail team. This will typically only fire and update once the QA team marks the Run as complete.

#### Trigger

Runs when a webhook from TestRail is sent

```yaml
on:
  repository_dispatch:
    types:
      - update_testrail_run
```
