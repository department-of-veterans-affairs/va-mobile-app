---
sidebar_position: 2
sidebar_label: Workflows
---

This is a list of all the reusable workflows in GitHub Actions and what they do.

In an effort to reduce the page size, large workflow code will be linked instead of being provided here.

## `add-new-user`
### Description
Workflow used to add a new user to the `flagship-mobile-team` in GitHub, which grants write and read access tot he `va-mobile-app` repository and to our ZenHub instance. 

### Trigger
Creation of `Add User to VA Flagship Mobile Team` [template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new/choose) in `va-mobile-app` repository. 
### Steps/Source
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


## `approve_command`
### Description
Workflow for the `/approve` command in GitHub Issues. Workflow is made available in Issues by the `slash_commands` workflow.

The current version of the workflow looks for a comment in issues that starts with `/approve`. The command should be immediately followed by a version string that matches the version regex `/^vd+.d+.d+$/` 

The current logic on this trigger is pretty brittle and if the admin doesn't do it correctly it can have some incorrect effects that need to get fixed with a new comment that is formatted correctly. There is likely some work to make this better, but there is some time needed to sort out the logic and have the command send the correct message back to the issue and to tag whoever initiated the command.

This command calls the `release_pull_request` workflow during execution.
### Trigger
Workflow is triggered when a user types `/approve` into a GitHub Issue and clicks the comment button. 
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/approve_command.yml)

---

## `bundler_update`
### Description
Automated workflow that runs every Wednesday to update all the installed bundler libraries and any installed Fastlane plugins for both the iOS and Android Fastfiles
### Trigger
Runs every Wednesday at 0700 UTC on only the `develop` branch.
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/bundler_updates.yml)

---

## `codeql`
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

---

## `create_test_rail_milestone`
### Description
Creates a new Sprint Milestone in TestRail that can be added to a test run and used for tracking in TestRail.
### Trigger
Runs when called by another workflow
### Paramters
#### Secrets
| Name           | Description                                                                                                                          | type   | required? |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|--------|-----------|
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |

### Outputs
| Name        | Description                                   | type   |
|-------------|-----------------------------------------------|--------|
| milestoneId | TestRail ID for the Milestone that is created | string |
### Steps/Source
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

## `documentation_deploy`
### Description
Workflow that runs every day to update this documentation site with any approved changes.
### Trigger
```yaml
- cron: "0 3 * * *"
```
Runs every day at 0300 UTC
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/documentation_deploy.yml)

---

## `documentation_test_build`
### Description
Automated workflow that runs on every PR that touches autogenerated content for this documentation site to make sure that not of the changes breaks the automatic build and deploy of the site. 
### Trigger
Runs on every pull request to `develop` branch that touches the following paths:
- `VAMobile/src/components/**`
- `VAMobile/documentation/**`
- `VAMobile/src/utils/hooks.tsx`
### Steps/Source
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

---

## `production_builds`
### Description
Automated workflow that runs on merges to main. If the merge title matches our version scheme, this workflow will then tag that commit with the version string, kicking off the [production build flows on CircleCI](../CircleCI/Workflows.md/#release_build)
### Trigger
Pull Request merged to `main` where the PR title matches `^v[0-9]+\.[0-9]+\.[0-9]+$` 
### Steps/Source
```yaml
tag_for_release:
  if: github.event.pull_request.merged == true
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
      - name: Tag for release
        run: |
          if [[ ${{github.event.pull_request.title}} =~ (^v[0-9]+\.[0-9]+\.[0-9]+$) ]];
          then
            git config --global user.name 'VA Automation Bot'
            git config --global user.email 'va-mobileapp@adhocteam.us'
            git tag -a ${{github.event.pull_request.title}} -m ${{github.event.pull_request.title}}
            git push origin ${{github.event.pull_request.title}}
          else
            echo 'Non-release PR, exiting'
            exit 0
          fi
        shell: bash
```

---

## `release_branch_issue`
### Description
This automated workflow creates the release ticket for every release. 

This ticket runs any time a release branch is created that matches our strategy of `release/^v[0-9]+\.[0-9]+\.[0-9]+$` and does the following:

- scrapes the version from the GitHub reference
- Calculates teh QA, Product, and VA Due Dates for the ticket
- Calculates the Release Date for the specified version
- Creates a table of all the Sev-1 and Sev-2 bugs that are open in the repository
- Creates an issue from the `release_ticket` GitHub Issue Template
- Creates a TestRail Run and Milestone for QA regression testing and tracking
- Adds the TestRail run graph to the ticket after the run has been created

### Trigger
Runs on every branch create and creates a new ticket only if the branch name matches `release/^v[0-9]+\.[0-9]+\.[0-9]+$`
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_branch_issue.yml)

---

## `release_pull_request`
### Description
This Workflow runs when called by another workflow and merges the release branch changes to `main` and then creates a PR for any branch updates to be pulled back into `develop`
### Trigger
Runs when called by another Workflow
### Parameters
#### Inputs
| Name    | Description                 | type   | required? |
|---------|-----------------------------|--------|-----------|
| version | Version Number (eg. v1.1.0) | string | yes       |
#### Secrets
| Name           | Description                                                                       | type   | required? |
|----------------|-----------------------------------------------------------------------------------|--------|-----------|
| GH_ACTIONS_PAT | PAT token from composite parent workflow. Should be PAT from our automation robot | string | yes       |
#### Outputs
| Name        | Description                                                                                                  | type   | 
|-------------|--------------------------------------------------------------------------------------------------------------|--------|
| devPrUrl    | URL string that points to the new PR to `develop` for any release branch specific changes                    | string | 
| releaseHash | String value of the commit hash on `main` that can point to the release changes as a single commit in GitHub | string |

### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/release_pull_request.yml)

---

## `slash_commands`
### Description
Workflow sets up any slash commands that have been created to run in a newly created issue. 

Uses the [Slash Command Dispatch Action](https://github.com/peter-evans/slash-command-dispatch) from GitHub Marketplace

This can be used to add any more "chat ops"-type automations in the future by adding to the `commands:` option
### Trigger
Runs on every issue created comment and fires any slash commands installed if found.
### Steps/Source
```yaml
slashCommandDispatch:
  runs-on: ubuntu-latest
  steps:
    - name: Slash Command Dispatch
      uses: peter-evans/slash-command-dispatch@v2
      with:
        token: ${{ secrets.GH_ACTIONS_PAT }}
        reaction-token: ${{ secrets.GH_ACTIONS_PAT }}
        permission: admin
        commands: |
          approve
```

---

## `start_test_rail_run`
### Description
This workflow creates a new TestRail Test Run for QA when called from another Workflow.
### Trigger
Runs when called by another Workflow
### Parameters
#### Inputs
Name    | Description                 | type   | required? |
|---------|-----------------------------|--------|-----------|
| version | Version Number (eg. v1.1.0) | string | yes       |
| releaseDate  | Go-live date for release (eg. 06/21/2022)               | string | yes       |
| ticketNumber | Issue number for release ticket (eg. 3333)              | string | yes       |
| milestoneId  | TestRail Milestone ID for the run to be associated with | string | yes       |

#### Secrets
| Name           | Description                                                                                                                          | type   | required? |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------|--------|-----------|
| TEST_RAIL_USER | Testrail robot userid. User and id received from the VA testing tools team. See Github Robot PAT for Testrail in VA Mobile 1Password | string | yes       |
| TEST_RAIL_KEY  | TestRail API key. See Github Robot PAT for Testrail in VA Mobile 1Password                                                           | string | yes       |
#### Outputs
| Name        | Description                                   | type   |
|-------------|-----------------------------------------------|--------|
| testrailUrl | URL String for the newly created TestRail run | string |

### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/start_test_rail_run.yml)

---

## `update_testrail_run`
### Description
This Workflow runs on a repository dispatch is received from automated TestRail webhooks. 

When the TestRail run is updated, it sends a webhook to the repository. This workflow is fired and then updated the mermaid diagram in the Release Ticket issue with the testing results so far in the run

NOTE: Currently, TestRail does not fire a webhook when a test is completed in the run, only when top-level meta-data has been updated in the Run. We have requested an enhancement to TestRail to change this, but there is no documented tracking available for enhancement requests from the TestRail team. This will typically only fire and update once the QA team marks the Run as complete.
### Trigger
Runs when a webhook from TestRail is sent
### Steps/Source
[See in repository](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/update_testrail_run.yml)

---

