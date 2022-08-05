# API Tokens

## Authorization and token types

The mobile app currently uses two authorization services: IAM and SIS (short for Sign-In Service). IAM is a third party service and SIS is an in-house VA auth service. We expect to eventually sunset IAM in favor of SIS.

The tokens are visually distinct: IAM tokens are 20 characters long, while SIS tokens are over a thousand characters long.

The one important functional difference is that you have to include an additional header with SIS tokens:
`Authentication-Method: SIS`

## Fetching API tokens
You can obtain a token from the [token generator app](https://va-mobile-cutter.herokuapp.com) on Heroku. User credentials are in 1Password. If you do not yet have access to the shared 1Password 'VA.gov' vault ask a teammate to fetch the credentials you need.

## Working on the token app

The code for the token fetcher app can be found [here](https://github.com/adhocteam/va-mobile-sampleweb) and instructions for development can be found in the readme. To work on the app, you will need write access to the repo and admin access to the heroku instance.