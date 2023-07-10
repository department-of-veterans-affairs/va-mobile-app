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

## Outbound Request Service Objects

The mobile controllers use a variety of service objects to communicate with upstream servers. These are typically written by other teams and are not under the control of the mobile team. The service objects provide a common interface for establishing connections using the `Faraday` library and making requests to external services. They consist of two parts:

1. the configuration. The configuration must be a subclass of `Common::Client::Configuration::Base`. The configuration is primarily responsible for setting values necessary for connecting to the upstream server–such as URLs and api keys–and for establishing that connection via the `connection` method. In addition to determining which URLs, headers, and options to use when connecting to the upstream server, the `connection` method also adds a variety of middleware plugs that determine how requests and responses are processed by Faraday. Some of these plugs are very simple built-ins, such as the json plug used to process json responses and the snakecase plug used to specify that the response keys will be in snakecase format. Other plugs are custom-written within the vets-api. These plugs are all types of Faraday middleware that have the ability to modify either the outbound request or inbound respond and can raise or modify errors. For example, if the configuration specifies a json plug but the response is not parsable json, it will raise an error.

2. the service itself. These are subclasses of `Common::Client::Base`. That class is intended to provide a common interface through which all upstream requests are made. It also includes some default error handling in the `request` method that rescue some common errors that can arise during the request and converts them into errors that are defined within the vets-api. The service object is responsible for using the connection created by the configuration to make upstream requests and for processing the responses. These services sometimes include user access checks and request data validity checks, which can raise errors. They also often process the response by modifying status codes and by adapting data to models.

## Exception Handling

All controllers in the vets-api mobile module include the `ExceptionHandling` module, which catches any errors that arise during a request, remaps any unknown errors to [known errors](#error-classes), then renders the error to the user with the status code and details defined in the error class. Any errors that are not otherwise explicitly handled will be mapped to `Common::Exceptions::InternalServerError` and will return 500 to the client.

## Error Classes

All errors in the vets-api will ultimately be subclasses of `Common::Exceptions::BaseError`, either because they were explicitly raised within the vets-api or because they were converted to known error classes within the mobile app module, the [service object](#outbound-request-service-objects), or [Exception Handling](#exception-handling). This is useful for providing a common interface for errors, which allows error classes to define their own response statuses and logging.

## Coupling between Service Objects, Exception Handling, and Error Classes

The [request lifestyle](#the-request-lifecycle) both begins and ends with the controller, which includes the [Exception Handling module](#exception-handling). This means that any errors encountered in our service objects will be rescued by ExceptionHandling and converted to known error classes with a common interface that's used in determining the response to the user. Moreover, ExceptionHandling has specific handling for errors that are specific to outbound services. For example, ExceptionHandling has code for rescuing `Common::Client::Errors::ClientError`, which is the error that `Common::Client::Base` raises when it encounters `Faraday::ClientError` or `Faraday::Error`. In other words, ExceptionHandling, vets-api error classes, and outbound service objects are coupled.

This coupling prevents us from recreating the wheel with each service object but can also make it difficult to fully test service object code in isolation, which makes it important to write thorough integration tests because ExceptionHandling can call methods on error classes that might not be called in service specs. Bugs can exist in service objects and error classes that will not be revealed without integration testing with the ExceptionHandling class.

## Where errors arise and why it's hard to know which errors are possible

Errors can arise during any portion of the [request lifestyle](#the-request-lifecycle) above. Errors that arise in the mobile module are generally predictable. For example, we know that failure to authenticate the user will result in a 401, failure to authorize the user to access the resource will result in a 403, invalid request data will typically result in a 422, and an error within the code itself will result in a 500.

Once we leave the mobile module, the possible errors becomes inherently less predictable. Code outside of the mobile module can also be changed without our knowledge, potentially removing, changing, introducing errors.

Once we make a request to an external service, the errors become even less predictable. While this is thankfully changing with the advent of lighthouse, some of the endpoints we consume are not well documented. As a result, it'ssometimes impossible to know what responses to expect from these servers. We are usually able to find out the key data by talking to the product owners of these APIs, but we don't always receive an exhaustive list and often aren't told what all of the errors mean. Also, these services can also change without our knowledge.

As a result of all this, errors may at times be possible that aren't listed in our api documentation. We could partially address this by writing our docs more defensively and adding error types are possible but we have no reason to believe would occur. But our api docuementation is also not intended for public use. It's only for use by the mobile client. Much as the vets-api has an `ExceptionHandler` to ensure that all errors encountered in the vets-api will be processed correctly, the mobile app has some built-in error handling for common cases like 403 and 422. The more critical thing is that our documents should list out all cases that convey information about what went wrong and how the app should handle it. For example, if we know any endpoint can return 207 if only some records are received, that should be clearly conveyed to others and included in the api documentation so we can design the mobile UX to inform the user that some records are mising.
