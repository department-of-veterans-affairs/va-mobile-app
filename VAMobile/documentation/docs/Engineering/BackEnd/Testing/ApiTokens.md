# API Tokens

## Authorization and token types

The mobile app currently uses two authorization services: IAM and SIS (short for Sign-In Service). IAM is a third party service and SIS is an in-house VA auth service. We expect to eventually sunset IAM in favor of SIS.

The tokens are visually distinct: IAM tokens are 20 characters long, while SIS tokens are over a thousand characters long.

The one important functional difference is that you have to include an additional header when using SIS tokens: `Authentication-Method: SIS`

## Fetching API tokens

We host a web app on heroku for fetching api tokens. You can fetch tokens in two ways:

1. Manual: Go to the [token generator web app](https://va-mobile-cutter.herokuapp.com) and log in with a test user. User credentials are in 1Password.

2. Automated: These requests use basic auth (ask teammates for username and password) and will only work if the test user has previously been logged in via the manual approach and the user's refresh token is still valid. There are routes for fetching IAM tokens:

`GET https://va-mobile-cutter.herokuapp.com/auth/iam/token/judy.morrison@id.me`

And SIS tokens:

`GET https://va-mobile-cutter.herokuapp.com/auth/sis/token/judy.morrison@id.me`

## Working on the token app

The code for the token fetcher app can be found [here](https://github.com/adhocteam/va-mobile-sampleweb) and instructions for development can be found in the README. To work on the app, you will need write access to the repo and admin access to the heroku instance.