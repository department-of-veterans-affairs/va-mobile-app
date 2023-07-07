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

Errors raised in processing requests made to the vets-api are handled by the `ExceptionHandling` module, which is included in every vets-api controller. This module catches any errors that arise during a request, remaps any unknown errors (i.e., instances of error classes not defined in the vets-api, such as `Faraday::TimeoutError`), then renders the error using the status code and details defined in the error class. Any un

The status code and details can vary per instance of a given error class.

For example, if an OSO raised an error class called `InvalidLighthouseResponseError`, that would stop all further processing of the request and the error would be captured by the exception handler mounted in the controller. The `InvalidLighthouseResponseError` class will be defined somewhere in the app as a subclass of `Common::Exceptions::BaseError`. These error classes define the status code and error details. Those values can be hard-coded or defined upon error initialization. Those values are then used to render a response to the client.

This tight coupling also means that it's critical to write integration tests. Errors raised in the outbound service objects will be caught in the ExceptionHandling module, which will then use portions of the outbound service object configuration to determine how to handle the error. For example, the OSOs can define how its errors should be logged and ExceptionHandling uses those logging configurations. This coupling can also make it difficult to fully test OSO code in isolation, which makes it very important to write thorough integration tests because ExceptionHandling can call methods that exist in the OSOs that might not otherwise be called. In other words, bugs can exist in OSOs that will not be revealed without integration testing with the ExceptionHandling class.

Default to 500...

## How Service Objects and the Exception Handling Module are Coupled



## Sign-In

The sign-in process is not owned by the mobile team and has its own set of potential errors. It should be considered separately.