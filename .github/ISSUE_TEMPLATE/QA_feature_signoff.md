---
name: QA Feature Signoff
about: Template for creating a ticket to document QA feature signoff for each epic (beyond individual tickets)
title: QA Feature Signoff
labels: qa, QA and Release
assignees: 
---
_'QA signoff' column to include initials & date (intentionally *not* using the checkbox list because that's easier to inadvertently check/uncheck)_
_'Relevant for this epic?' column to include Y or N, and explanation if a N_

## Before merging to develop

### Always required
| Category | Task (plus links) | QA signoff |
| -- | -- | -- |
| Standards | Test plan was peer reviewed |  |
| Standards | All tickets found during testing have been prioritized | |
| Standards | Feature testing summary written and reviewed with feature team | |  
| Testing | ACs met on all implementation tickets | |
| Testing | Accessibility testing per a11y design annotations | |
| Testing | [API errors](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8943) handled well | |
| Testing | New screens respect availability framework | |
| Testing | Screens & API calls follow [maintenance windows](https://dsvavsp.testrail.io/index.php?/cases/view/33977&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8943) during downtime | |
| Testing | Existing detox cases all still pass | |
| Testing | New detox cases are comprehensive and all pass | |
| Testing | ACs met on all MVP-necessary bug fixes | |

 ### Always considered (may or may not be included)     
| Category | Task (plus links) | Relevant for this epic? | QA signoff |
| -- | -- | -- | -- |
| Standards | UX notified (in all three categories - UX/interaction, content, and accessibility) when UXQA could be done | | |
| Standards | Analytics (new or updates) also ready to merge to develop | | |
| Standards | [Website comparison](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_id=8945&group_order=asc&display_deleted_cases=0) completed | | |
| Testing | [Feature flags](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8942) (for slow rollout or offswitch) tested | | |
| Testing | Updates to in-app review code to include this feature tested | | |
| Testing | Compatibility testing (old client & new APIs; new client & old APIs) completed | | |
| Testing | Finished "just before merge to develop" testing - including feature happy path and merge conflict resolution spot-testing | |

## After merging to develop

### Always required
| Category | Task (plus links) | QA signoff |
| -- | -- | -- |
| Standards | TestRail: cases from 'Upcoming Feature Cases' folder moved into appropriate location in 'Active/Organized' folder |  |
| Standards | TestRail: now-obsolete cases in 'Active/Organized' folder moved into 'Archive' folder |  |
| Testing | Happy path testing for key feature functionality |  |
| Testing | Unhappy path testing for key feature functionality |  |

 ### Always considered (may or may not be included)     
| Category | Task (plus links) | Relevant for this epic? | QA signoff |
| -- | -- | -- | -- |
| Standards | TestRail: this feature added to RC script | | |
| Testing | General app regression testing | | |
| Testing | Feature-specific regression testing | | |

#### Bugs during implementation
_If desired, add bug descriptions or links to bug tickets, as you find them during testing, to serve as a starting point for feature-specific regression test plan._
