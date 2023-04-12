<!-- NOTE: Please include the related issue number in the PR title, otherwise the changes won't be merged 
into the `staging` branch upon ticket completion. E.g. '[Issue type]/[Issue #]-[Your name]-[Summary of issue]',
where Issue type = bug, feature, spike, CU (code upkeep), etc. -->

## Description of Change
<!-- Please include a description of the change and context. What would a code reviewer, or a future dev, 
need to know about this PR in order to understand why this PR was created? This could include dependencies 
introduced, changes in behavior, pointers to more detailed documentation. The description should be more 
than a link to an issue.  -->

## Screenshots/Video
<!-- Add screenshots or video as needed. Before/after if changes are to be compared by reviewers.
Before/after: <img src="" width="49%" />&nbsp;&nbsp;<img src="" width="49%" />
Toggle: <details><summary></summary><img src="" width="49%" />&nbsp;&nbsp;<img src="" width="49%" /></details>
-->

## Testing
<!-- What testing was done to verify the changes (local/unit)? What testing remains? Note edge cases, or special
situations that could not be tested during development. -->

- [ ] Tested on iOS <!-- simulator is fine -->
- [ ] Tested on Android <!-- simulator is fine -->

## Reviewer Validations
<!-- What should reviewers look for? Copy/paste Acceptance Criteria from ticket -->

## PR Checklist
<!-- Engineer: make sure all these items are checked off before requesting a review -->
  **Reviewer:** Confirm the items below as you review

- [ ] PR is connected to issue(s)
- [ ] Tests are included to cover this change (when possible)
- [ ] No magic strings (All string unions follow the [Union -> Constant](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/src/constants/common.ts) type pattern)
- [ ] No secrets or API keys are checked in
- [ ] All imports are absolute (no relative imports)
- [ ] New functions and Redux work have proper TSDoc annotations
