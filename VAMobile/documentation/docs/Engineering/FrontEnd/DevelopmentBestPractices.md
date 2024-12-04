# Development Best Practices

Our team follows a set of best practices around tickets, branches, and PRs to ensure a smooth development process and high quality code. Here we'll describe the key points to keep in mind.

## Tickets

We use tickets to track all our engineering work. They precisely specify the work to be performed, allow stakeholders to track progress, and guide QA in assessing the resulting work.

### Creating tickets

Every ticket must contain at least the following information:

- A detailed description of the work
- Clearly specified Acceptance Criteria
- Screenshots or links to mockups where applicable
- All relevant labels ("front-end" for FE work, "Health" for Health and Benefits work, "Global" for global work, etc)
- An epic relating to the ticket's larger context

If possible, choose the relevant template for your ticket. For example, if you're creating a bug ticket, choose the Bug Report Template and include severity in the title, labels, and body.

### Scoping tickets

We recommend creating smaller tickets because they are easier to implement and test. Always be on the lookout for ways to break up large tickets into smaller, more manageable pieces. Here are some strategies you can use to divide tickets:

- Instead of biting off a whole screen containing multiple components in one ticket, create a separate small ticket for each individual component.
- When you need to refactor messy code before adding functionality, create one ticket for refactoring, and another for new functionality.
- Don't expand a ticket's scope if you encounter a bug or technical debt during your work. Instead create a separate bug or code upkeep ticket to address the issue.
- For large refactoring projects, divide the work by feature (Appointments, Claims, Messaging, etc) or by category (Health, Benefits, Global).

If there's any risk that a ticket might not be completed in a single sprint, break it into smaller tickets. An estimate of 13 or larger is a clear indication that the ticket is too large.

### Working on tickets

All engineering work requires a ticket.

Every ticket must satisfy the requirements in the "Creating tickets" section above. If information is missing, add it or contact the relevant stakeholders.

Before an engineer can begin work on a ticket, it must contain an estimate. Bugs get an initial estimate of 1 to cover a short investigation. Other tickets are left to the engineers' discretion, following our [estimation guidelines](/docs/About%20our%20team/team-charter/#estimation).

Once everything is in place, complete the following tasks:

- Assign yourself
- Assign the appropriate QA engineer if not already assigned
- Move the ticket to In Progress
- Create a branch as described below in the Branches section

Then you can begin work. Keep stakeholders up to date as you work by commenting on the ticket with any important details or questions. This will also preserve information so everyone can reference it in the future.

On completion of your work, double check the following:

- All items in Acceptance Criteria are implemented
- Confirm screen reader functionality on both iOS and Android for accessibility
- Unit tests are updated or extended to cover your changes. See our [Unit Tests documentation](/docs/Engineering/FrontEnd/Testing/UnitTesting) for best practices.
- Relevant documentation is updated to reflect the changes in your PR

Then create a Pull Request. See the Pull Requests section below for more information.

## Branches

Feature branches are temporary branches where we develop and test new features. We implement every code change in a feature branch before merging it into the default branch.

:::info
For features that must be rolled out gradually, or where precise feature activation timing is required, use a [remote config flag](https://firebase.google.com/docs/remote-config/).
:::

Our default branch is `develop`. Create your feature branch from there, named as follows:

```
type/ticketnumber-DescriptionOfWork
```

The ticket number lets us track back to the relevant ticket. The type and description show the branch's purpose at a glance. Types are `feature`, `bug`, `chore`, and `hotfix`. Description is CamelCase with optional dashes to add further details. Here are some example branch names:

- `feature/1234-DescriptionOfNewFeature-OptionalAdditionalInfo`
- `bug/1234-DescriptionOfBugfix`
- `chore/1234-DescriptionOfChore`
- `hotfix/1234-DescriptionOfCriticalFix`

After completing work in your branch, create a PR as described in "Pull Requests" below.

### Sources

- [Naming git branches](https://gist.github.com/jefffederman/1d492f98b8e3913a75ca)
- [Branch naming](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)

## Pull Requests

A Pull Request (PR) is a request to merge code. All pull requests must include certain information. Each PR must pass a series of manual and automated checks before it can be merged.

### Pull request process

Each pull request moves through a series of steps.

1. Creation: an engineer creates a PR. See "Pull request creation" below.
2. Review: a different engineer reviews the PR. See "Pull request review" below.
3. Approval: when the reviewer is satisfied, they approve the PR and change the pipeline to "With QA (pre-develop)" so QA knows to begin testing.
4. QA: a QA engineer tests the branch and updates TestRail. QA informs the PR creator of any issues they find. On approval, QA comments in the ticket and changes the pipeline to "Ready to merge to develop".
5. Merge: the PR creater merges the PR. See "Merging pull requests" below.
6. Post-merge: QA completes final testing and closes the ticket.

### Pull request creation

When creating a PR, fill out each section in the PR template, including:

- Description: provide context so a code reviewer or future developer understands why the PR exists and what it does
- Screenshots: add before/after screenshots or videos showing the changes
- Testing information: confirm testing on iOS and Android. Document any special considerations like edge cases or areas of focus for QA
- Reviewer validations: tell reviewers what to check. You can usually copy the Acceptance Criteria from the ticket
- Complete all PR checklist items

Click the "Connect issue" button and choose the associated ticket. You must be logged into ZenHub to see the "Connect issue" button.

:::important
It's critical to link the PR to the ticket with the "Connect issue" button so we can track the work performed.
:::

Hit "Create pull request" when everything is ready. If your PR is especially complex, you can annotate the PR with comments to help reviewers understand why you made particular decisions. Adding comments to large PRs can also help reviewers know where to focus their attention.

:::info
If you're still actively working on your branch, create a draft PR. Move the PR out of draft status when it's complete and ready for review.
:::

GitHub Actions automatically runs linting checks, unit tests, and E2E tests on PR creation. Fix any issues surfaced by these checks. Revert the PR to draft status if you need more time to make fixes.

When all the checks pass, your PR is ready for review.

### Pull request review

At least one review is required on every PR. Here are some guidelines for creating and reviewing PRs.

As a PR creator:

- Try to keep PRs under 400 lines. The larger the PR, the more difficult it is to review thoroughly.
- If a reviewer asks questions, add a comment under each question with your answer.
- If a reviewer requests changes, implement them or explain why you disagree.
- If no one reviews your PR within 24 hours, request a review on Slack.

As a PR reviewer:

- Be as precise and clear as possible in your comments. Explain why you're requesting each change.
- Target your feedback towards best practices. Avoid matters of opinion.
- If you're just commenting and not requesting changes, keep things moving by approving the PR or saying something like "leaving approval to (person) because I don't know enough about this code".
- If you find some code confusing or hard to understand, mention it. Other engineers will probably feel the same way.
- Provide constructive feedback in a calm, civil manner. We're all working together to make the app better.
- Spread positivity by calling out clean, maintainable code, good documentation, etc.

### Merging pull requests

You can merge your PR after QA approves it. Choose the "Squash and merge" option to squash your commits down to a single commit in the base branch.

:::info
You can choose to preserve all your commits if they contain critical information. However, squashing is usually preferred to avoid clutter.
:::

Format the commit message using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Example commit messages:

```
feat: add analytics to cerner alerts
fix: preserve whitespace in secure messages
chore: run compression over all app store images
docs: add a new, nested page under research
```

You can use `!` to denote breaking changes:

```
chore!: upgrade React Native to 0.73
```

After merging:

- Change the pipeline on your ticket to "With QA (develop)" so QA can perform final testing
- Select the current release under "Releases" so we can track which tickets went into each release
