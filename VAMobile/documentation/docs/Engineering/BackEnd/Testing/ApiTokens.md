---
title: API Tokens
---

## Authorization and token types

The mobile app currently SIS tokens (short for Sign-In Service). SIS is an in-house VA auth service.

SIS tokens are over a thousand characters long.

You have to include an additional header when using SIS tokens: `Authentication-Method: SIS`

## Fetching API tokens

We host a web app on heroku for fetching api tokens. You can fetch tokens in two ways:

1. Manual: Go to the [token generator web app](https://va-mobile-cutter.herokuapp.com) and log in with a test user. User credentials are in 1Password.

2. Automated: These requests use basic auth (ask teammates for username and password) and will only work if the test user has previously been logged in via the manual approach and the user's refresh token is still valid. The route for fetching SIS tokens is:

```bash
GET https://va-mobile-cutter.herokuapp.com/auth/sis/token/judy.morrison@id.me
```

## Working on the token app

[View code for the token fetcher app](https://github.com/adhocteam/va-mobile-sampleweb) and instructions for development can be found in the README. To work on the app, you will need write access to the repo and admin access to the heroku instance.
