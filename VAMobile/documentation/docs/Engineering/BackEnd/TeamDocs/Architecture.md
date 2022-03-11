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
