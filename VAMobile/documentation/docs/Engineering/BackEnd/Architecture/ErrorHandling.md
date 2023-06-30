# Error Handling

Error handling in the vets-api mobile module falls broadly into a few categories. Requests received by the backend use code written by other teams (called outbound service objects) for communication with other servers. The responses from those upstream servers are then processed by those same service objects and then by the mobile team's backend code, which then responds to the mobile client. There are four places errors can occur or be modified:
- in the backend code before the outbound service object is called. This includes mobile code but can also be other code in the vets-api.
- in the upstream service
- in the outbound service object's handling of the upstream service's response
- in the mobile team's vets-api code

Any errors during that process then go through the mobile app's exception handling code before it's returned to the client.

In addition, errors can arise from the authorization process.

## Vets-Api Pre-request Processing

When mobile request are received by the vets-api, they're routed to controllers in the mobile module, which can include data access checks and request validations that can return errors. The mobile code then utilizes outbound service objects to communicate with upstream services. These service objects can also impose their own validity and access checks. In general, those will match ours because ours are generally written to match theirs, but it's also possible for those validations to drift due to code changes in the outbound services objects and due to mobile-specific business requirements that may cause us to add different validations. This is an area where the vets-api's lack of centralization prevents a more robust solution that prevents this drift through shared validations.

## Upstream Services and Outbound Service Objects

The back 

## Mobile Module Errors

## Exception Handling

## Authorization
