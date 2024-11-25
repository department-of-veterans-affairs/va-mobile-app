# Release Tickets Issues

## Documentation: Handling Failure in Release Ticket and Slack Thread Automation

This document outlines the steps to follow when the automation to create a release ticket and Slack coordination thread fails due to issues like incorrect GitHub username assignment.

## Past Issue Description

The job to create the release branch or issue failed due to an incorrect GitHub username in the [release_ticket](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/ISSUE_TEMPLATE/release_ticket.md) template. Although the release itself was successful, the workflow to generate the associated  release ticket and  sclack coordination thread did not complete as expected.

## Steps to Resolve the Issue

1. Update the [release_ticket](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/ISSUE_TEMPLATE/release_ticket.md) template with the correct GitHub username and push to Github
2. Determine the version number of the build (vX.X.X) and RC tag RC-vX.XX.0-XXXXXX-XXXX you want to delete
3. Delete the local release candidate tag: `git tag --delete RC-vX.XX.0-XXXXXX-XXXX`
4. Delete the remote tag: `git push --delete origin <RC-vX.XX.0-XXXXXX-XXXX>`
5. Delete the local release branch : `git branch -d <release/vX.X.X>`
6. Delete the remote release branch: `git push origin --delete <release/vX.X.X>`

## Trigger the Workflow Manually
1. Manually ran the [new_release_branch](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/workflows/new_release_branch.yml) workflow using workflow_dispatch. 
2. Confirm that:
     1. New RC tag.
     2. New release branch.
     3. release ticket has been created.
     4. Slack thread coordination has been triggered on va-mobile-app channel.