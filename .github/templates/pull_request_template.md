## Description of change
<!-- Please include a description of the change and context. What would a code reviewer, or a future dev, 
need to know about this PR in order to understand why this PR was created? This could include dependencies 
introduced, changes in behavior, pointers to more detailed documentation. The description should be more 
than a link to an issue.  -->

## Original issue(s)
department-of-veterans-affairs/va-mobile-app#0000

## Screenshots
<!-- Please add screenshots as needed. Before/after if changes are to be compared by reviewers. -->

## Testing Considerations
<!-- Please describe testing done to verify the changes. What testing remains? Note edge cases, or special
situations that could not be tested during development. -->

### Reviewer Validations
<!-- What should reviewers look for? -->

#### *Engineer: Please ensure all these checkboxes can be checked.* 
#### *Reviewer: double check these*

- [ ] Tests added to cover this change
- [ ] All requires are absolute (no releative imports)
- [ ] No magic strings (All string unions follow the [Union->Constant](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/src/constants/common.ts) type pattern)
- [ ] All button text is title cased
- [ ] No secrets or api keys are checked in
- [ ] new functions and redux work has proper JSDoc annotations

## Reviewers
<!-- Please list ONLY specific folks who you think should be notified of this PR.
@lexicalninja (Patrick S)
@narin (Narin)
@Teesh (Teesh)
@rarroyo23 (Raf)
@kreek (Alastair - for API awareness)
@jperk51 (Jayson - for API awareness)
@jjulian (Jonathan - for high-level concerns)
@patrickvinograd (Patrick V - for more awareness on FE)
-->
