# Architecture

## Directory Layout
TODO vets-api app vs lib vs mobile module...

## JSON-API
TODO link to docs, Fastserializers...

## Data Flow
TODO Endpoint data flow: controller (request) -> param contract -> proxy/service -> middleware -> adapter -> model -> serializer -> controller (response)...

## Background Workers
TODO Sidekiq jobs, pre-caching...

## Parallel Calls
The mobile API often needs to make requests to external services to fetch data to return to the client. In some cases, a single request from the client can require data from multiple external services. This can cause those requests to be slow and creates a bad user experience.

To mitigate the issue, we use the [Parallel Gem](https://github.com/grosser/parallel), which provides a simple interface for executing functions in parallel using threads. A simple use pattern is:

* Find the common location where code branches off into the multiple network calls.
* Wrap the methods that initiate those branches in lambdas.
* Pass an array of those lambdas to the gem, telling it how many threads to use and specifying that it should execute the `call` method on each lambda to execute it.
* Capture return values if needed.
* It is possible to rescue errors either within lambdas or around the entire parallelization code block. This allows us the ability to capture errors and either log them or provide helpful information back to the client. If we do not rescue, errors will stop execution and be handled as they normally would.

## Feature Flagging

### Flipper

We use Flipper to manage feature flags. Instructions for use and best practices can be found [here](https://depo-platform-documentation.scrollhelp.site/developer-docs/Feature-toggles.1859780873.html)

### Access
In order to turn features on and off in staging and in review instances, you will first need to create an id.me account. You can do this by going to [staging](https://staging.va.gov), clicking "sign in", choosing to sign in with id.me, then choosing to sign in using the google integration. Enter your Ad Hoc email address. It will then take you through an identity verification process. This is done on the id.me sandbox environment. DO NOT PROVIDE YOUR REAL SSN OR OTHER SENSITIVE DATA. IT WILL ACCEPT ANY PERSONAL IDENTIFYING INFORMATION.

Once this is done, you will need to add your Ad Hoc email to the flipper section in `config/settings.yml`.

### Toggling Feature Flags

Using staging as an example, navigate to your environment (note the '-api' in the url): https://staging-api.va.gov/flipper/features.

From there, you can select individual features and turn them on and off for all users, individual users, or even a percentage of random users.

## Upstream Service Map

![](../../../../static/img/backend/upstream-service-map.png)

## Service Contacts
| Service | Slack Channel | Contacts |
| ----------- | ----------- | ----------- |
| Caseflow | #caseflow-support-team | |
| CDC | N/A | iisinfo@cdc.gov |
| DSLogon | #vsa-authd-exp | |
| EMIS | #vsa-authd-exp | |
| EVSS | #evss-prod | |
| ID.ME | #idme-va-gov | |
| Lighthouse | #lighthouse-infrastructure | |
| MHV | #mhv-vetsgov, #vsa-authd-exp | |
| VAOS | #vaos-team | |
| VEText | #va-mobile-app-push-notifications | |
| Vet360 | #vsa-authd-exp | |
