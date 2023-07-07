# Error Handling

## The request lifecycle

The vets-api mobile endpoints generally follow the following pattern:
- request is received and routed to the controller
- the controller verifies the validity of the user's bearer token
- the controller runs any other necessary validations, such as confirming the user has access to the content and that parameters make sense.
- the controller then uses service objects to communicate with other servers in the vets-api ecosystem
- those service objects may perform their own validations. These will generally be the same as the ones performed in the controller but may occasionally be different.
- the service object makes the upstream request
- the upstream server processes that request and either responds or times out
- the the service object processes the response.
- when the request fails (status is >= 400), the service objects will raise corresponding errors. These errors are handled by the controller's `ExceptionHandling` module (link to below).
- when the request is successful (status is < 400), this usually involves mapping the response data to a vets-api model but may at times involve more complex processing.
- the data is then returned to the controller.
- the controller then performs any additional modifications that are necessary, serializes the data, and returns it to the client with an appropriate status code.

## Outbound Request Service Objects and Upstream Servers

The mobile controllers use a variety of service objects to communicate with upstream servers. Those service objects consist of two parts:

1. the configuration. The configuration must be a subclass of `Common::Client::Configuration::REST` or `Common::Client::Configuration::SOAP`, depending on which protocol the upstream server uses. The configuration is primarily responsible for setting values necessary for connecting to the upstream server–such as URLs and api keys–and for establishing that connection. All configuration objects implement a `connection` method that defines how to connect to the upstream server and also adds a variety of plugs that determine how requests and responses are processed. Some of these plugs are very simple built-ins, such as the json plug used to process json responses and the snakecase plug used to specify that the response keys will be in snakecase format. Other plugs are custom-written within the vets-api. These plugs can raise or modify errors. For example, if the configuration specifies a json plug but the response is not parsable json, it will raise an error.

2. the service itself. These are subclasses of `Common::Client::Base`. That class is intended to provide a common interface through which all upstream requests are made. This makes it easy to add new service objects that will handle common errors (such as timeouts and client errors) predictably. The service object is responsible for using the connection created by the configuration to make upstream requests and for processing the responses. These often process the response by modifying status codes and by adapting data to models.

## Exception Handling

All controllers in the vets-api include the `ExceptionHandling` module, which catches any errors that arise during a request, remaps any unknown errors (i.e., instances of error classes not defined in the vets-api, such as `Faraday::TimeoutError`), then renders the error using the status code and details defined in the error class.

The status code and details can vary per instance of a given error class.

For example, if an OSO raised an error class called `InvalidLighthouseResponseError`, that would stop all further processing of the request and the error would be captured by the exception handler mounted in the controller. The `InvalidLighthouseResponseError` class will be defined somewhere in the app as a subclass of `Common::Exceptions::BaseError`. These error classes define the status code and error details. Those values can be hard-coded or defined upon error initialization. Those values are then used to render a response to the client.

Any unexpected errors will be mapped to `BackendServiceException` and will return 500.

## Coupling between Service Objects and Exception Handling

This tight coupling also means that it's critical to write integration tests. Errors raised in the outbound service objects will be caught in the ExceptionHandling module, which will then use portions of the outbound service object configuration to determine how to handle the error. For example, the OSOs can define how its errors should be logged and ExceptionHandling uses those logging configurations. This coupling can also make it difficult to fully test OSO code in isolation, which makes it very important to write thorough integration tests because ExceptionHandling can call methods that exist in the OSOs that might not otherwise be called. In other words, bugs can exist in OSOs that will not be revealed without integration testing with the ExceptionHandling class.

## Where errors arise and why it's hard to know which errors are possible

Errors can arise during any portion of the [request lifestyle](#the-request-lifecycle) above. Errors that arise in the mobile module are generally predictable. For example, we know that failure to authenticate the user will result in a 401, failure to authorize the user to access the resource will result in a 403, invalid request data will typically result in a 422, and an error within the code itself will result in a 500.

Once we leave the mobile module, the possible errors becomes inherently less predictable. Code outside of the mobile module can also be changed without our knowledge, potentially removing, changing, introducing errors.

While this is thankfully changing with the advent of lighthouse, some of the endpoints we consume are not well documented. As a result, it's impossible to know what responses to expect from these servers. We are usually able to find out the key data by talking to the product owners of these APIs, but we don't always receive an exhaustive list and often aren't told what all of the errors mean. Also, these services can also change without our knowledge.

As a result of all this, errors may at times be possible that aren't listed in our api documentation. We could partially address this by writing our docs more defensively and adding error types are possible but we have no reason to believe would occur. But our api docuementation is also not intended for public use. It's only for use by the mobile client. Much as the vets-api has an `ExceptionHandler` to ensure that all errors encountered in the vets-api will be processed correctly, the mobile app has some built-in error handling for common cases like 403 and 422. The more critical thing is that our documents should list out all cases that convey information about what went wrong and how the app should handle it. For example, if we know any endpoint can return 207 if only some records are received, that should be clearly conveyed to others and included in the api documentation so we can design the mobile UX to inform the user that some records are mising.

## Sign-In

The sign-in process is not owned by the mobile team and has its own set of potential errors. It should be considered separately.