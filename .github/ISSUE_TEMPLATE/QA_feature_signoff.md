---
name: QA Feature Signoff
about: Template for creating a ticket to document QA feature signoff for each epic (beyond individual tickets)
title: QA Feature Signoff
labels: qa, QA and Release
assignees: 
---

## Pre-develop merge testing
Before the [name of feature] feature merges to develop, QA needs to complete these tasks:

- [ ] All implementation tickets tested
- [ ] All bugs found during testing have been prioritized
- [ ] MVP-necessary bug fixes tested
- [ ] Finished "just before merge to develop" testing - including feature happy path and merge conflict resolution spot-testing 


## Post-develop merge testing
After the [name of feature] feature merges to develop, QA needs to complete these tasks:

- [ ] Happy path testing for key feature functionality
- [ ] Unhappy path testing for key feature functionality
- [ ] General app regression testing
- [ ] Feature-specific regression testing
- [ ] Cases written & organized correctly in TestRail for future manual testing
- [ ] Detox automation cases completed


### Bugs during implementation
_Add bug descriptions or links to bug tickets, as you find them during testing, to serve as a starting point for feature-specific regression test plan. Specific test plan & testing on that plan should be documented elsewhere in this ticket_
