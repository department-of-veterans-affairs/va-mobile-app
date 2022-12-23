---
sidebar_position: 2
sidebar_label: Workflows
---

This is a list of all the reusable workflows in GitHub Actions and what they do.

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

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

## `Name`
### Description
### Trigger
### Steps/Source

---

