# Error Handling

## The request lifecycle

The vets-api mobile endpoints generally follow the following pattern:
- request is received and routed to the controller
- the controller verifies the validity of the user's bearer token
- the controller runs any other necessary validations, such as confirming the user has access to the content and that any provided parameters are valid
- the controller then uses [service objects](#outbound-request-service-objects) to communicate with other servers in the vets-api ecosystem. those service objects may perform their own validations. These will generally be the same as the ones performed in the controller but may occasionally differ.
- the external service processes that request and responds or times out
- the service object processes the response.
- when the request fails (status is >= 400), the service objects will raise corresponding errors. These errors are rescued by [ExceptionHandling](#exception-handling) and responds with error details to the client.
- when the request is successful (status is < 400), any additional business logic will be applied by the service object. This often includes parsing and converting the data to models.
- the data is then returned to the controller.
- the controller then performs any additional modifications that are necessary, serializes the data, and returns it to the client with an appropriate status code.

## Outbound Request Service Objects

The mobile controllers use a variety of service objects to communicate with upstream servers. These are typically written by other teams and are not under the control of the mobile team. The service objects provide a common interface for establishing connections using Faraday (a ruby library for making network requests) and making requests to external services. They consist of two parts:

1. the configuration. The configuration must be a subclass of `Common::Client::Configuration::Base`. The configuration is primarily responsible for setting values necessary for connecting to the upstream server–such as base URLs and api keys–and for establishing that connection via the `connection` method. In addition to determining which URLs, headers, and options to use when connecting to the upstream server, the `connection` method also adds a variety of middleware plugs that determine how requests and responses are processed by Faraday. Some of these plugs are very simple built-ins, such as the json plug used to process json responses and the snakecase plug used to specify that the response keys will be in snakecase format. Other plugs are custom-written within the vets-api. These plugs are all types of Faraday middleware that have the ability to modify the outbound request or process the inbound response. These plugs can raise errors. For example, if the configuration specifies a json plug but the response is not parsable json, it will raise an error.

2. the service itself. These are subclasses of `Common::Client::Base`. The service object is responsible for using the connection created by the configuration to make upstream requests and for processing the responses. These service objects sometimes include user access checks and request data validity checks, which can raise errors. They often process the response by modifying status codes and by adapting data to models. They also provide some default error handling in the `request` method that rescues some common errors that can arise during the request and converts them into [errors that are defined within the vets-api](#error-classes).

## Upstream Servers

Nearly all data returned from the vets-api comes from external servers within the VA digital ecosystem. Some of the endpoints we consume are not well documented. As a result, it's sometimes impossible to fully know what response statuses and bodies to expect from these servers. We are usually able to find out most of this information by talking to the product owners of these APIs or by testing the API ourselves, but we don't always receive an exhaustive list and often aren't told what all of the errors mean. These services can also change without our knowledge because they are still under active development. As a result, these external services can be a bit of a black box. Thankfully, this is improving with newer APIs, such as those provided by lighthouse, which are now being documented as part of the development process.

## Error Classes

All errors in the vets-api will ultimately be subclasses of `Common::Exceptions::BaseError`, either because they were explicitly raised within the vets-api or because they were converted to known error classes within the mobile app module, the [service object](#outbound-request-service-objects), or [Exception Handling](#exception-handling). This is useful for providing a common interface for errors, which allows error classes to define their own response statuses, messages, and logging behavior.

The error classes work in coordination with values set in config/locales/exceptions.en.yml. The error classes implement an `i18n_key` method that matches an entry in that yaml file that can include additional error details, such as messages and statuses, that can be used by ExceptionHandling.

## Exception Handling

All controllers in the vets-api mobile backend include the `ExceptionHandling` module, which catches any errors that arise during a request, remaps any unknown errors to [known errors](#error-classes), then renders the error to the user with the status code and details defined in the error class. Any errors that are not otherwise explicitly handled will be mapped to `Common::Exceptions::InternalServerError` and will return 500 to the client.

## Coupling between Service Objects, Exception Handling, and Error Classes

The service objects need ExceptionHandling to handle its errors. ExceptionHandling needs errors to be subclasses of `BaseError` because it relies on methods in `BaseError` to respond to the client with the appropriate information. These three components are coupled.

This coupling provides a great deal of value. It prevents us from recreating the error handling wheel with every new endpoint. Without it, each controller would have to have explicit handling for each potential error case. But it also comes at a cost. That cost is that it's difficult to know exactly which errors the controller can return because to know that you have to know which errors the upstream can return, which errors the service object can produce, and how those errors can be modified by the service object, error class, and ExceptionHandling.

It also makes it difficult to fully test service object code in isolation, which makes it important to write thorough integration tests because ExceptionHandling can call methods on error classes that might not be called in service object unit tests. Bugs can exist in service objects and even within error classes that will not be revealed without integration testing with the ExceptionHandling class.

## Wrapup

Errors can arise during any portion of the [request lifestyle](#the-request-lifecycle). Errors that arise in the mobile portion of the vets-api are generally predictable. For example, we know that failure to authenticate the user will result in a 401, failure to authorize the user to access the resource will result in a 403, and a syntax error within the code itself will result in a 500.

Once we leave the mobile backend, the possible errors become more difficult fully know due code complexity and coupling between our service objects, errors, and ExceptionHandling. Code outside of the mobile backend can also be changed without our knowledge, potentially removing, changing, or introducing errors.

Once we make a request to an external service, the errors become even less predictable, due to a combination of poor documentation, poor interteam communication, and ongoing changes being made to the upstream code.

As a result, errors may at times be possible that aren't listed in our api documentation. But much as the vets-api has ExceptionHandling to ensure that all errors encountered in the vets-api will be handled gracefully even if we don't know anything about that error, the mobile app has built-in error handling for common cases like 401 and 403 but also handles any unknown 400+ status codes so there should be no inherent problem with an occasional unexpected error.

While it may not be possible to know every possible error that can occur, what is more important is that we document any errors that change behavior in the mobile app so the mobile app can be coded to handle those cases appropriately. For example, a few endpoints can return 207 with detailed messages when only partial data was received. This must be communicated to the user, so coordination is needed between frontend, backend, and product to ensure a smooth user experience. Given the inherent unknowns of the VA digital services ecosystem, fault tolerance is a critical feature of the VA mobile app.
