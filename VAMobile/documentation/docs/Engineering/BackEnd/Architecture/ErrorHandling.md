# Error Handling

## The request lifecycle

The vets-api mobile endpoints generally follow the pattern that can be roughly broken up into the following sections.

## Mobile controller before upstream request

When mobile requests are received by the vets-api, they're routed to controllers in the mobile module, which can include data access checks and request validations that can return errors. The mobile code then utilizes outbound service objects to communicate with upstream services. These service objects can also impose their own validity and access checks. In general, those will match ours because ours are generally written to match theirs, but it's also possible for those validations to drift due to code changes in the outbound services objects and due to mobile-specific business requirements that may cause us to add different validations. This is an area where the vets-api's lack of centralization prevents a more robust solution that prevents this drift through shared validations.


## Outbound Service Objects and Upstream Servers

The mobile controllers use a variety of service objects to communicate with upstream servers. Those service objects consist of two parts:

1. the configuration. Each of those service objects must also define a configuration, which must be a subclass of `Common::Client::Configuration`. The configuration is primarily responsible for setting values necessary for connecting to the upstream–such as URLs and api keys–and for establishing that connection. It also adds a variety of plugs that requests and responses are processed. Some of these plugs are very simple built-ins, such as the json plug used to process the response as json and the snakecase plug used to specify that the response keys will be in snakecase format. Other plugs are custom-written within the vets-api and can raise or modify errors.

2. the service itself. These are subclasses of `Common::Client::Base`. That class is intended to provide a common interface through which all upstream requests are made. This makes it relatively easy to add new service objects that will behave predictably and handle common errors. The service object is responsible for using the connection created by the configuration to make upstream requests and for processing the response. These often process the response by modifying status codes and by adapting data to models.


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

Errors raised in processing requests made to the vets-api are handled by the `ExceptionHandling` module, which is included in every vets-api controller. This module catches any errors that arise during a request, remaps any unknown errors (i.e., instances of error classes not defined in the vets-api), then renders the error using the status code and details defined in the error class. The status code and details can vary per instance of a given error class.

For example, if an OSO raised an error class called `InvalidLighthouseResponseError`, that would stop all further processing of the request and the error would be captured by the exception handler mounted in the controller. The `InvalidLighthouseResponseError` class will be defined somewhere in the app as a subclass of `Common::Exceptions::BaseError`. These error classes define the status code and error details. Those values can be hard-coded or defined upon error initialization. Those values are then used to render a response to the client.

This tight coupling also means that it's critical to write integration tests. Errors raised in the outbound service objects will be caught in the ExceptionHandling module, which will then use portions of the outbound service object configuration to determine how to handle the error. For example, the OSOs can define how its errors should be logged and ExceptionHandling uses those logging configurations. This coupling can also make it difficult to fully test OSO code in isolation, which makes it very important to write thorough integration tests because ExceptionHandling can call methods that exist in the OSOs that might not otherwise be called. In other words, bugs can exist in OSOs that will not be revealed without integration testing with the ExceptionHandling class.

## Sign-In

The sign-in process is not owned by the mobile team and has its own set of potential errors. It should be considered separately.