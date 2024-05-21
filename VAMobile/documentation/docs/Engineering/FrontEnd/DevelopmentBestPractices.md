# Development Best Practices

## Tickets

### Creating tickets

Every ticket must contain at least the following information:

- A description of the work
- Clearly specified Acceptance Criteria
- Screenshots or links to mockups (for design-related tickets)
- All relevant labels ("front-end" for FE work, "Health" for Health and Benefits work, "Global" for global work, etc)
- An epic relating to the ticket's larger context

If possible, choose the relevant template for your ticket. For example, the Bug Report Template will help you quickly create a bug report with all the required details. Make sure to include severity in the bug ticket title, labels, and body.

Before an engineer can begin work, the ticket must contain an estimate. Bugs get an estimate of 1 to start. Other tickets are left to the engineers' discretion.

### Working on tickets

All engineering work requires a ticket. The ticket must satisfy the requirements in the "Creating tickets" section above. If anything is missing, add it or contact the relevant stakeholders. Once everything is in place, complete the following tasks:

- Assign yourself
- Assign the appropriate QA engineer
- Move the ticket to In Progress

Then you can begin work. Keep stakeholders up to date as you work by commenting on the ticket with any important details or questions. This will also preserve information so everyone can reference it in the future.

When you've finished all the work specified in the Acceptance Criteria on a ticket, as well as updated unit and E2E tests, create a Pull Request (PR) from your branch. See the Pull Requests section below for more information.

## Branches

### Feature branches

Our default branch is `develop`. Create your feature branch from there, named as follows:

```
type/ticketnumber-yourname-description-of-work
```

For example:

```
feature/1234-anna-add-contact-information-analytics
```

When your PR passes code review and QA, you'll merge your feature branch back into the develop branch.

### Feature-xl branches

If you are working on a large feature that will require multiple sprints and tickets to complete, create a feature-xl branch like:

```
feature-xl/my-big-new-feature
```

Then create a smaller branch off the feature-xl branch for each ticket. When all the work is complete and the smaller branches are merged back into the feature-xl branch, QA will perform a final check on the feature-xl branch. Then you can merge the feature-xl branch back into the develop branch.

## Pull Requests

### Pull request process

Pull requests move through a series of steps.

1. Creation: you create a PR. See "Pull request creation" below.
2. Review: another engineer reviews the PR. See "Pull request review" below.
3. Approval: when the reviewer is satisfied, they'll approve your PR and change the pipeline to "With QA (pre-develop)" so QA knows to begin testing.
4. QA: a QA engineer tests your branch and updates TestRail. You'll need to fix any issues they find. On approval, they'll comment in the ticket and change the pipeline to "Ready to merge to develop".
5. Merge: hit the "Merge pull request" button to merge your PR into the develop branch. On the ticket, change the pipeline to "With QA (develop)" and select the current release under "Releases".
6. Post-merge: QA will complete final testing and close the ticket.

### Pull request creation

Fill out each section in the PR template, including:
- Description: provide context so a code reviewer or future developer understands why the PR exists and what it does
- Screenshots: add before/after screenshots or videos showing the changes
- Testing information: confirm testing on iOS and Android. Document any special considerations like edge cases or areas of focus for QA
- Reviewer validations: tell reviewers what to check. You can usually copy the Acceptance Criteria from the ticket
- Complete all PR checklist items

Immediately after creating the PR, click the "Connect issue" button and choose the associated ticket. **This is critical to allow everyone to track the work performed.** You must be logged into ZenHub to see the "Connect issue" button.

Add the "FE-Needs Review" label. This indicates to other engineers that your PR is ready for review. If your PR is especially complex, you can annotate the PR with comments to help reviewers understand why you made particular decisions.

GitHub Actions automatically runs linting checks, unit tests, and E2E tests on your branch. Fix any failures, and make sure unit and E2E tests are modified or extended to cover your changes. See our Unit Tests documentation for best practices.

If you have code that's not complete but you want others to take a look, consider creating a draft PR. You can move the PR out of draft status when it's done.

### Pull request review

At least one review is required on every PR.

As a PR creator:
- Try to keep PRs under 400 lines. The larger a PR, the more difficult it is to review thoroughly.
- If a reviewer asks questions, add a comment under each with your answer. If they request changes, implement them or add a comment explaining why you disagree.
- If you've created a PR and no one's reviewed it for 24 hours, request a review on Slack.

As a PR reviewer:
- Provide constructive feedback in a calm, civil manner. We're all working together to make the app better.
- Be as precise and clear as possible in your comments. Explain why you're requesting each change.
- If you find some code confusing or hard to understand, mention it. Other engineers will probably feel the same way.
- Spread positivity by calling out clean, maintainable code, good documentation, etc.

