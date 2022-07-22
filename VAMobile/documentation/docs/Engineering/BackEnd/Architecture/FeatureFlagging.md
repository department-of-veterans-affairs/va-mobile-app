# Feature Flagging

## Flipper

We use Flipper to manage feature flags. Instructions for use and best practices can be found [here](https://depo-platform-documentation.scrollhelp.site/developer-docs/Feature-toggles.1859780873.html)

## Access
### Staging

In order to turn features on and off in staging and in review instances, you will first need to create an id.me account. You can do this by going to [staging](https://staging.va.gov), clicking "sign in", choosing to sign in with id.me, then choosing to sign in using the google integration. Enter your Ad Hoc email address. It will then take you through an identity verification process. This is done on the id.me sandbox environment. DO NOT PROVIDE YOUR REAL SSN OR OTHER SENSITIVE DATA. IT WILL ACCEPT ANY PERSONAL IDENTIFYING INFORMATION.

Once this is done, you will need to add your Ad Hoc email to the flipper section in `config/settings.yml`. You will have flipper access once this file has been deployed to staging.

### Production

In order to change feature flags in production, you will need a real id.me account. Because you're only allowed to have one id.me account, it is strongly recommended that you sign up using your personal email address. You can create an account at id.me. You can then add other email addresses to your id.me profile. If you've already created a sandbox id.me account with your AdHoc email address, you may experience difficulty linking your AdHoc address to your production account.

You will then need to add your production id.me email address to `config/settings.yml`. You will have flipper access once this file has been deployed to production.

## Toggling Feature Flags

Flipper URLS (note the 'api' in the url)
* staging: https://staging-api.va.gov/flipper/features
* production: https://api.va.gov/flipper/features

From there, you can select individual features and turn them on and off for all users, individual users, or even a percentage of random users.
