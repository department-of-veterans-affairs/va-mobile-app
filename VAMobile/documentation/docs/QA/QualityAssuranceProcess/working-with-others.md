---
title: Working with others
---
# Working with others

While QA does a lot of our work towards the end of a ticket's lifecycle (testing!), we're involved early and often to help point out problems *before* they're designed or coded problematically, saving cycles and getting us closer to a shippable product as early as possible. Here's where we fit in and what you can expect from us.

## Planning and Design (PM, UX, Content)

| **Involvement** | **How to pull us in** | **Artifacts QA delivers** |
| --- | --- | --- |
| High-level design review or feature planning | Included on meeting requests, tagged in Slack/invited to relevant channels | n/a |

## Implementation & PR review (Eng)

| **Involvement** | **How to pull us in** | **Artifacts QA delivers** |
| --- | --- | --- |
| High-level review or feature planning | Included on meeting requests, tagged in Slack/invited to relevant channels | n/a |
| Creation of test plan (features only**) | Ticket created (using [this template](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/.github/ISSUE_TEMPLATE/QA_Test_Plan.md)) and assigned to appropriate QA Engineer | Completed ticket will include: link to TestRail for peer-reviewed test plan and information about any further testing data prep needed from feature team |

**For new feature implementation or other large changes, parallelizing test planning with engineering implementation is the most efficient way to work, to give advance notice if the planned test data is not sufficient for QA needs, and to make sure that QA is ready to jump into testing as soon as Engineering finishes PR review. For bug fixes or other small changes, QA typically will wait until PR review is complete to create a test plan. If unsure if a test plan creation ticket should be created for a particular need, please ask your assigned QA Engineer.

## Testing (QA)

| **Involvement** | **How to pull us in** | **Artifacts QA delivers** |
| --- | --- | --- |
| High-level review or feature planning | Included on meeting requests, tagged in Slack/invited to relevant channels | n/a |
| Manual testing | Engineering implentation tickets assigned to appropriate QA Engineer, after passing PR review | Per-ticket: Completed ticket will include planned & completed testing (comment, or TestRail link, as appropriate). Per-feature: [Testing Summary](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Testing%20Summary). |
| Automated testing | Engineering detox script addition/updates assigned to appropriate QA Engineer, after passing PR review | PRs or tickets will include QA review |

NB: During testing, towards the end of QA review, the UX team does UX review (visual, interaction, and content review). For details, reference [the UX team documentation on the UX QA process](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/designing-ui#qa).
