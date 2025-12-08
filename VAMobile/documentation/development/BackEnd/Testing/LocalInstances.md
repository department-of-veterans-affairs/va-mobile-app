---
title: Local Instances (with upstream staging data)
---

While it is possible to test local changes in vets-api against [mock data](https://github.com/department-of-veterans-affairs/vets-api-mockdata) or VCR Cassettes, sometimes it may be beneficial or even necessary to test those changes using data for one our many [staging users](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Administrative/vagov-users/mvi-staging-users.csv). To do this, a few things need to happen:

* The Mobile App (or Postman) must be authenticated for the Test User for whom you wish to access their data
* Your local vets-api instance must be configured properly
  * You must have the proper Staging settings pulled into your local settings
  * Temporary configurations, such as disabling SSL, must be put in place
* Your local vets-api instance must be able to connect to upstream staging services, which exist within the VA network, and are not immediately accessible otherwise without the proper tooling.

Two such tools are available for you that simplify these processes: [Mobile DevTools: Mobile Authentication](https://va-mobile-dev-tools-0cb741eb06ae.herokuapp.com/mobile-authentication) for the authentication piece, and Upstream-Connect, a CLI tool in vets-api that automates configuring your local instance and connecting to upstream environments. 

Once both pieces are working properly, a user should be able to successfully make requests from Postman or a local build of the Mobile app to a local instance of vets-api and finally to the various upstream services using a staging user of their choice.

## Mobile DevTools / Mobile Authentication

Mobile DevTools is a standalone application deployed [here](https://va-mobile-dev-tools-0cb741eb06ae.herokuapp.com/). One of the tools available is "Mobile Authentication", which allows users to retrieve access tokens for either the Staging environment or locally running instances of Vets API. Both options utilize the Staging deployment of ID.me, allowing users access to [Test User](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Administrative/vagov-users/mvi-staging-users.csv) data. 

### Authenticating with Postman to Test Local changes

When running vets-api locally, you cannot hit a mobile endpoint out of the box. You must have an access token imbedded with the identity of the intended Test User. Retrieving a token has become a simple process using our Mobile DevTools, once you have completed the pre-reqs (one time only):

* [vets-api](https://github.com/department-of-veterans-affairs/vets-api) is cloned, set up and working properly. This includes having bundled and all migrations run. See the vets-api README for help with this.
* [vets-api-mockdata](https://github.com/department-of-veterans-affairs/vets-api-mockdata) cloned in sibling directorty (nothing to setup)
* ngrok account created, installed, and configured. See [DevTools README](https://github.com/department-of-veterans-affairs/va-mobile-dev-tools/blob/main/README.md#ngrok-setup)

Once the pre-reqs are set up, follow these steps:

1. Start vets-api (`bundle exec rails server`)
2. Start ngrok (`ngrok http 3000`)
3. Visit [ Mobile DevTools/Mobile Authentication](https://va-mobile-dev-tools-0cb741eb06ae.herokuapp.com/mobile-authentication)
  - You may need to log in to github if it's your first time or have been logged out
4. For `Authentication Environment`, select `Local Token`
5. Enter your ngrok URL
  - Can be found next to `Forwarding` in your ngrok session. Something like `https://some-random-words.ngrok-free.dev`
6. Proceed to ID.me to enter Test User credentials for your User

**NOTE** If you run into some sort of warning, you can safely select `Visit Site`. We trust ourselves.
**NOTE** If you get an error about a client ID, you are missing some local seed data. If you don't care about the state of your current test DB, just run `bin/rails db:reset db:migrate` and that should give you the config objects you need.

7. This should complete and provide you with an access token (refreshable via UI). This token can be set as your `Bearer Token` in Postman for Mobile Requests
8. You should now be able to make changes to vets-api and see them reflected against the mock-data repo. To test against upstream data, see Upstream-Connect below.

#### Postman Collection

We have a git-tracked [Postman collection](https://github.com/department-of-veterans-affairs/vets-api/tree/master/modules/mobile/docs/postman) containing both vets-api endpoints and an endpoint to our DevTools app that allows users to easily refresh your token. In Postman's "Local View", you can sync it to the vets-api folder `modules/mobile/docs/postman` and will reflect the state of the branch. Here you can make changes and even push changes if needed. Note that my experience has shown it to be a bit janky, so consider just importing the collections/environments or `push to cloud` (which pushes what's on master/your branch to Postman)

#### Automated Token Refresh with Postman

If you have authenticated a Test User within 30 days on your local vets-api instance, you can use the `Auth/Set Bearer Token` request/script in Postman to automatically refresh the `BEARER_TOKEN` Global variable, which is used in all requests as the Authorization/Bearer Token variable. If a refresh token expires, you will get a message suggesting `Manual login is required` and need to use DevTools to enter credentials before it can be auto-refreshed again.

### Authenticating with Emulator and local vets-api changes

TODO

## Upstream-Connect

The `upstream-connect` CLI tool/"wizard" is essentially a script in the vets-api repo that automates the steps for connecting a local vets-api isntance to the various upstream services' Staging environments. It does the following:

* Authenticates user with AWS CLI, to be used in the following steps
* Accesses AWS parameter store to retrieve relevant staging secrets and adds them to your local settings
* Provides information on any other manual steps required for the respective service you're attempting to reach
* Creates a "tunnel" that port-forwards from your localhost to the relevant upstream service via the staging fwd proxy
* Allows for simple cleanup once you have completed your task

### Required Manual Configuration

Add the following snippet to `/config/initializers/faraday_middleware.rb`

```ruby
Faraday.default_connection_options = { ssl: { verify: false } }
```

On several endpoints you may run into certificate verification errors, and this allows our app to "trust" Postman (**Remember to never commit this change!!!**).

If you fail to do so, you will see something like the following in your response:
```json
{
  "title": "Internal server error",
  "code": "500",
  "meta": {
      "exception": "SSL_connect returned=1 errno=0 peeraddr=127.0.0.1:4492 state=error: certificate verify failed (self-signed certificate)",
  ...
  }}
```

### Using the Script

From the root of the vets-api repo, run: 

```bash
$ script/upstream-connect/upstream-connect.sh <args>
```

Information on requirements, usage, and troubleshooting can be found in the [README](https://github.com/department-of-veterans-affairs/vets-api/blob/main/script/upstream-connect/README-upstream-connect.md)

## Feature Requests and Contributing

If any upstream services have been ommitted, or if new integrations are added in the future, please help us by bringing them to our attention and providing any information you have that may help us.

### Open an issue

If you don't know where to start or are unsure you have everything you need, please open an issue in the [va-mobile-app repo](https://github.com/department-of-veterans-affairs/va-mobile-app). Please include as much of the following as you can:

* Name of the upstream service and/or what the collection of endpoints may be referred to in discussion (e.g. We sometimes refer to the Caseflow API as "Appeals", as that is where we go for Appeals data)
* Relevant Mobile endpoints/controllers
* Relevant vets-api services or anything else in the vets-api repo related to the integration
* If the request is for an in-progress integration, link to any PRs where we might find information about the integration
* Known test users with useful/relevant data. 
* Links to web pages that would contain va.gov's version of the content being added (to compare test user data across modalities).

### Contribute to Upstream-Connect

If you feel confident about all of the moving pieces of the integration, please open a [vets-api](https://github.com/department-of-veterans-affairs/vets-api) PR with your additions to the [upstream_service_config.rb](https://github.com/department-of-veterans-affairs/vets-api/blob/master/script/upstream-connect/upstream_service_config.rb).

## Questions and Troubleshooting

If you have questions about anything above, please reach out to the #va-mobile-app-engineering in Slack