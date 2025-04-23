## Description of Change
<!-- Please include a description of the change and context. What would a code reviewer, or a future dev, 
need to know about this PR in order to understand why this PR was created? This could include dependencies 
introduced, changes in behavior, pointers to more detailed documentation. The description should be more 
than a link to an issue. -->

## Link to Issue
<!--Link to an issue by posting the issue link here. Your pull request is required to be linked to an issue in order for the pull request to Activate.-->

## Screenshots/Video
<!-- Add screenshots or video as needed. Before/after if changes are to be compared by reviewers.
Before/after: <img src="" width="49%" />&nbsp;&nbsp;<img src="" width="49%" />
Toggle: <details><summary></summary><img src="" width="49%" />&nbsp;&nbsp;<img src="" width="49%" /></details> -->

## Testing Requirements
<!-- What testing was done to verify the changes (local/unit)? What testing remains? Note edge cases, or special
situations that could not be tested during development. -->

Acceptance Criteria
<!-- AC should be written as should be a pass/fail statements and should include steps to carry out task if needed. -->

- [ ] AC 1
- [ ] AC 2

Test Users
<!-- What test users should be used to test test this feature? Please specify what each test user should test. -->

- [ ] Test User 1
- [ ] Test User 2

## Checklist for PR Submitter
<!-- PR Submitter should make sure all of these items are checked off before requesting a review -->
  **PR Reviewer:** Confirm the items below as you review

- [ ] PR is connected to issue(s)
- [ ] Code is attached to a feature flag, or reason is given for no feature flag
- [ ] AC and Tests are included to cover this change (when possible)
- [ ] No magic strings (All string unions follow the [Union -> Constant](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/src/constants/common.ts) type pattern)
- [ ] No secrets or API keys are checked in
- [ ] All imports are absolute (no relative imports)
- [ ] New functions and Redux work have proper TSDoc annotations

## Checklist for QA
<!-- This checklist is for the QA to complete. -->
  **QA Engineer:** Check off the items below as you test

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] [Run a build for this branch](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml)
