# Feature Flagging

## Flipper

We use Flipper to manage feature flags. Instructions for use and best practices can be found here: https://depo-platform-documentation.scrollhelp.site/developer-docs/Feature-toggles.1859780873.html

## Access
In order to turn features on and off in staging and in review instances, you will first need to create an id.me account. You can do this by going to https://staging.va.gov, clicking “sign in”, choosing to sign in with id.me, then choosing to sign in using the google integration. Enter your Ad Hoc email address. It will then take you through an identity verification process. This is done on the id.me sandbox environment. DO NOT PROVIDE YOUR REAL SSN OR OTHER SENSITIVE DATA. IT WILL ACCEPT ANY PERSONAL IDENTIFYING INFORMATION.

Once this is done, you will need to add your Ad Hoc email to the flipper section in config/settings.yml.

## Toggling Feature Flags

Using staging as an example, navigate to your environment (note the ‘-api’ in the url): https://staging-api.va.gov/flipper/features.

From there, you can select individual features and turn them on and off for all users, individual users, or even a percentage of random users.