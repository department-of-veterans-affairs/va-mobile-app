# Testing

## Test user accounts
The app should connect to the VA "staging" environment. Lists of test user accounts can be found [here](https://github.com/department-of-veterans-affairs/vets-api-clients/blob/master/test_accounts.md) and [here](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Administrative/vagov-users/staging-test-accounts-vaos.md)

## Testing standards
* use unit tests to increase confidence in small(er) sections of code
* use automation tests to exercise the flow of specific use cases
* plan for tests to be run during CI/CD - keep them quick

## Accessibility standards
* every screen must meet accessibility standards. plan to test these aspects:
  * dynamic text sizing
  * inversion of colors
  * sensical experience wile using VoiceOver / TalkBack
  * dark mode, if available on the device
  * detailed accessibility specifications TBD

## Security standards
* cautiously store data on-device
* be aware of what data is being sent off-device
* more standards TBD
