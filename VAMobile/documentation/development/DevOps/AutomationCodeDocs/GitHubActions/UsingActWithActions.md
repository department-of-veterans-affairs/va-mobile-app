---
sidebar_position: 7
sidebar_label: Using act with actions
---

# Using Act with Github actions

When using GitHub Actions, you may need to work against a PR to test your logic. This can be problematic and time consuming as a PR will need to be created or updated every time.

You can use `act` locally to work against a PR.

Run this command on macos to install:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

You can use this basic template to create a pull_request to be able to test PR actions.
Add this file to the root of your repo and call it `pull_request`.

```json
{
  "action": "opened",
  "pull_request": {
    "head": {
      "ref": "chore-branch-here",
      "sha": "abcdef1234567890abcdef1234567890",
      "repo": {
        "full_name": "department-of-veterans-affairs/va-mobile-app"
      }
    },
    "base": {
      "ref": "main",
      "sha": "fedcba9876543210fedcba9876543210",
      "repo": {
        "full_name": "department-of-veterans-affairs/va-mobile-app"
      }
    },
    "number": 999,
    "merged": false,
    "state": "open",
    "title": "Test PR for Workflow",
    "body": "This is a test pull request for local testing.",
    "user": {
      "login": "test-user"
    }
  },
  "repository": {
    "full_name": "department-of-veterans-affairs/va-mobile-app"
  }
}
```

From here you can modify the data that is being sent to satisfy your requirements. The most important pieces that can be updated:

`"action": "opened",`

This is used for the pull request action

`"number": 999,`

This is the PR number

`"merged": false,`

This tells if the PR is set to merged or not.

`"state": "open",`

This sets the state of the PR. open or closed

You can update these fields in your pr payload to trigger your GH action.

`act .git/workflows/<workflow> -e pull_request`

If you are not seeing the correct data from the log, you can add a -v to the end to see verbose logging

`act .git/workflows/<workflow> -e pull_request -v`

You can also add linked issues if thats a requirement

```json
...
{
"issue":,
  "number": 1234,
}
```

You can also use a github token and send it as a secret if you need to call other github actions.

```bash
export GH_TOKEN=438r9y432893w6bf432098
act .git/workflows/<workflow> -e pull_request -s GH_TOKEN
```
