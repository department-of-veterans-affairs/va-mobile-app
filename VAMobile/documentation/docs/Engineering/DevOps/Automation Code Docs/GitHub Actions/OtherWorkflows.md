---
sidebar_position: 3
sidebar_label: Other Workflows
---
# Other Workflows
This is a list of all the reusable workflows in GitHub Actions and what they do.

In an effort to reduce the page size, large workflow code will be linked instead of being provided here.

- [Code Quality Workflows](#code-quality-workflows)
  - [Code Checks](#lint--test-code_checks)
  - [CodeQl](#codeql-codeql)
  - [Update Bundler](#update-bundler-bundler_updates)
- [Utility Workflows](#utility-workflows)
  - [Add User to va-mobile-team repo](#add-user-to-va-mobile-team-repo-add_new_user)
  - [Slash Command Dispatch](#slash-command-dispatch-slash_commands)
  - [Start Slack Thread](#start-slack-thread-start_slack_thread)
- [TestRail Workflows](#test-rail-workflows)
  - [Create TestRail Milestone](#create-testrail-milestone-create_test_rail_milestone)
  - [Start RC Run](#start-rc-run-start_test_rail_run)
  - [Update Run](#update-run-update_testrail_run)
- [Documentation Site Workflows](#documentation-site-workflows)
  - [Deploy Site](#deploy-site-documentation_deploy)
  - [Test Build](#test-build-documentation_test_build)
  

## Code Quality Workflows

### Code Checks (`code_checks`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/code_checks.yml)

#### Description
Runs our code linter, [eslint](https://eslint.org/) and our test runner, [jest](https://jestjs.io/) to run our tests.  Our PR's have these two jobs set as status checks.  They both must run successfuly before a PR can be merged.

Lint job uses the `yarn lint:ci` command.

In order to speed up test running, we use GitHub Action's [matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) feature to run test jobs in parallel.  We have a script called `setupTestMatrix` that gets a list of all of our unit tests, splits them into 5 groups, and run `yarn test` on each group.

#### Trigger
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

### CodeQL (`codeql`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/codeql.yml)

#### Description
Runs mandatory Code QL scanning on the repository. This workflow was created and is maintained by the VA's GitHub group and should not be updated or removed without consent from that team in order to stay in compliance with VA security policy.

If you need to update the script, please read the comments in the workflow to see what can be added to scanning by the mobile team. 
#### Trigger
```yaml
- cron: '27 2 * * 1'
```
Runs every Monday at 0227 UTC

Also runs on every push or pull request to `devlop` branch.

#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/codeql.yml)

---

### Update Bundler (`bundler_updates`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/bundler_updates.yml)

#### Description
Automated workflow that runs every Wednesday to update all the installed bundler libraries and any installed Fastlane plugins for both the iOS and Android Fastfiles
#### Trigger
Runs every Wednesday at 0700 UTC on only the `develop` branch.
#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/bundler_updates.yml)

---

## Utility Workflows


### Add User to va-mobile-team repo (`add_new_user`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/add_new_user.yml)

#### Description
Workflow used to add a new user to the `flagship-mobile-team` in GitHub, which grants write and read access tot he `va-mobile-app` repository and to our ZenHub instance. 

#### Trigger
Creation of `Add User to VA Flagship Mobile Team` [template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new/choose) in `va-mobile-app` repository. 
#### Steps/Source
<details>


```javascript
- uses: actions/github-script@v6
    with:
      github-token: ${{ secrets.GH_ACTIONS_PAT }}
    script: |
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    // const DEBUG = core.isDebug();
    // function debug(msg) {
    //   if (DEBUG) {
    //     core.debug(msg);
    //   }
    // }
    // GH team to add user to
    const TEAM_SLUG = "flagship-mobile-team";
    // role to give user in team
    const DEFAULT_ROLE = "member"
    // assignees for any errors
    const EXCEPTION_ASSIGNEES = ['lexicalninja', 'narin']

    function getFirstMatch(regex, str) {
    const match = regex.exec(str);
      if (match) {
        return match[match.length > 1 ? 1 : 0];
      }
        return null;
    }

    function addComment(body) {
      return github.rest.issues.createComment({
        owner,
        repo,
        issue_number: context.payload.issue.number,
        body,
      });
    }

    function addLabels(labels) {
      let normalizedLabels = labels;
      if (!Array.isArray(labels)) {
        normalizedLabels = [labels];
      }
      return github.rest.issues.addLabels({
        owner,
        repo,
        issue_number: context.payload.issue.number,
        labels: normalizedLabels,
      });
    }

    function closeIssue() {
      return github.rest.issues.update({
        owner,
        repo,
        issue_number: context.payload.issue.number,
        state: "closed",
      });
    }

    function addAssignees(assignees) {
      return github.rest.issues.update({
          owner,
          repo,
          issue_number: context.payload.issue.number,
          assignees,
        });
      }

    async function inviteToTeam(username) {
      return github.rest.teams.addOrUpdateMembershipForUserInOrg({
        org: owner,
        team_slug: TEAM_SLUG,
        username: username,
        role: DEFAULT_ROLE
      })
    }
```
<summary> Click for full source

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
</summary>

```javascript
- if: ${{ failure() }}
  uses: actions/github-script@v6
  with:
  github-token: ${{ secrets.GH_ACTIONS_PAT }}
  script: |
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  function addComment(body) {
  return github.rest.issues.createComment({
  owner,
  repo,
  issue_number: context.payload.issue.number,
  body,
  });
  }

  await addComment('Failed to send invitation. See Actions logs for details.)
```
</details>

---

### Slash Command Dispatch (`slash_commands`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/slash_commands.yml)

#### Description
Workflow sets up any slash commands that have been created to run in a newly created issue. 

Uses the [Slash Command Dispatch Action](https://github.com/peter-evans/slash-command-dispatch) from GitHub Marketplace

This can be used to add any more "chat ops"-type automations in the future by adding to the `commands:` option
#### Trigger
Runs on every issue created comment and fires any slash commands installed if found.

---

### Start Slack Thread (`start_slack_thread`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/start_slack_thread.yml)

#### Description
Reusable job that sends a message to a specified channel in DSVA slack and starts a thread to keep from cluttering the Slack feed.

#### Parameters
| Name    | Description                                                                           | type   | default? |
|---------|---------------------------------------------------------------------------------------|--------|----------|
| channel_name | Name of the Slack channel where the thread should be started |
| message | String value of the message that will serve as the top of the thread in Slack channel | string | none     |

#### Outputs
| Name    | Description                                                                           | type   | default? |
|---------|---------------------------------------------------------------------------------------|--------|----------|
| thread_ts | Timestamp of the Slack thread that was created. Gets passed to other steps for future use. |


---
## Test Rail Workflows
### Create TestRail Milestone (`create_testrail_milestone`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/create_testrail_milestone.yml)


#### Description
Creates a new Sprint Milestone in TestRail that can be added to a test run and used for tracking in TestRail.
##### Trigger
Runs when called by another workflow
##### Parameters
###### Secrets
| Name           | Description                                                                                                                          | type   | required? |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|--------|-----------|
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |

#### Outputs
| Name        | Description                                   | type   |
|-------------|-----------------------------------------------|--------|
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
---

### Start RC Run (`start_test_rail_run`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/start_test_rail_run.yml)

#### Description
This workflow creates a new TestRail Test Run for QA when called from another Workflow.
#### Trigger
Runs when called by another Workflow
#### Parameters
##### Inputs
Name    | Description                 | type   | required? |
|---------|-----------------------------|--------|-----------|
| version | Version Number (eg. v1.1.0) | string | yes       |
| releaseDate  | Go-live date for release (eg. 06/21/2022)               | string | yes       |
| ticketNumber | Issue number for release ticket (eg. 3333)              | string | yes       |
| milestoneId  | TestRail Milestone ID for the run to be associated with | string | yes       |

##### Secrets
| Name           | Description                                                                                                                          | type   | required? |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|--------|-----------|
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |
##### Outputs
| Name        | Description                                   | type   |
|-------------|-----------------------------------------------|--------|
| testrailUrl | URL String for the newly created TestRail run | string |

### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/start_test_rail_run.yml)

---

### Update Run (`update_testrail_run`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/update_testrail_run.yml)

#### Description
This Workflow runs on a repository dispatch is received from automated TestRail webhooks. 

When the TestRail run is updated, it sends a webhook to the repository. This workflow is fired and then updated the mermaid diagram in the Release Ticket issue with the testing results so far in the run

NOTE: Currently, TestRail does not fire a webhook when a test is completed in the run, only when top-level meta-data has been updated in the Run. We have requested an enhancement to TestRail to change this, but there is no documented tracking available for enhancement requests from the TestRail team. This will typically only fire and update once the QA team marks the Run as complete.
#### Trigger
Runs when a webhook from TestRail is sent
#### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/update_testrail_run.yml)

---

## Documentation Site Workflows
### Deploy Site (`documentation_deploy`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/documentation_deploy.yml)

#### Description
Workflow that runs every day to update this documentation site with any approved changes.
#### Trigger
```yaml
- cron: "0 3 * * *"
```
Runs every day at 0300 UTC
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/documentation_deploy.yml)

---

### Test Build (`documentation_test_build`)
[View on GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/documentation_test_build.yml)

#### Description
Automated workflow that runs on every PR that touches autogenerated content for this documentation site to make sure that not of the changes breaks the automatic build and deploy of the site. 
#### Trigger
Runs on every pull request to `develop` branch that touches the following paths:
- `VAMobile/src/components/**`
- `VAMobile/documentation/**`
- `VAMobile/src/utils/hooks.tsx`
#### Steps/Source
```yaml
test-deploy:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: 14.x
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



