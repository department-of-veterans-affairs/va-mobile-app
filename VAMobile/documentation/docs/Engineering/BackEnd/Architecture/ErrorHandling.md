# Error Handling

## The request lifecycle

The vets-api mobile endpoints generally follow the pattern that can be roughly broken up into the following sections.

## Mobile controller before upstream request

When mobile requests are received by the vets-api, they're routed to controllers in the mobile module, which can include data access checks and request validations that can return errors. The mobile code then utilizes outbound service objects to communicate with upstream services. These service objects can also impose their own validity and access checks. In general, those will match ours because ours are generally written to match theirs, but it's also possible for those validations to drift due to code changes in the outbound services objects and due to mobile-specific business requirements that may cause us to add different validations. This is an area where the vets-api's lack of centralization prevents a more robust solution that prevents this drift through shared validations.


## Outbound Service Objects and Upstream Servers

The mobile controllers use a variety of service objects to communicate with upstream servers. Those service objects consist of two parts:

1. the service itself. These are subclasses of `Common::Client::Base`. That class is intended to provide a common interface through which all upstream requests are made. This makes it relatively easy to add new service objects that will behave predictably and handle common errors.

2. the configuration. Each of those service objects must also define a configuration, which must be a subclass of `Common::Client::Configuration`.

The configuration is primarily responsible for making a connection to the upstream service using values, such as URLs and api keys, defined within the configuration file. The service object is responsible for using that connection to make upstream requests and for processing the response. Both can have a role in error handling.

## Outbound Requests, Integrated Error Handling, and Deep Coupling

Error handling in the vets-api mobile module falls broadly into a few categories. Requests received by the backend use code written by other teams (called outbound service objects) for communication with other servers. The responses from those upstream servers are then processed by those same service objects and then by the mobile team's backend code, which then responds to the mobile client. There are four places errors can occur or be modified:
- in the backend code before the outbound service object is called. This includes mobile code but can also be other code in the vets-api.
- in the upstream service
- in the outbound service object's handling of the upstream service's response
- in the mobile team's vets-api code

Any errors during that process then go through the mobile app's exception handling code before it's returned to the client.

In addition, errors can arise from the sign-in process.


## Mobile Module Errors

## Exception Handling

Errors raised in outbound service objects and in the mobile module ruby code are handled by the ExceptionHandling module, which is included in every vets-api controller.

This tight coupling also means that it's critical to write integration tests. Errors raised in the outbound service objects will be caught in the ExceptionHandling module, which will then use portions of the outbound service object configuration to determine how to handle the error. For example, the OSOs can define how its errors should be logged and ExceptionHandling uses those logging configurations. This coupling can also make it difficult to fully test OSO code in isolation, which makes it very important to write thorough integration tests because ExceptionHandling can call methods that exist in the OSOs that might not otherwise be called. In other words, bugs can exist in OSOs that will not be revealed without integration testing with the ExceptionHandling class.

## Sign-In

The sign-in process is not owned by the mobile team and has its own set of potential errors. It should be considered separately.