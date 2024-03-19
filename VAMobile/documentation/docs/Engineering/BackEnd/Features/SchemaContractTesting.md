# Schema Contract Testing

## Background

We developed a schema contract testing libary that alerts us to schema changes in responses from services upstream of the vets-api.


- A contract exists between the vets-api and external services that provide data to the vets-api.
- Contracts will typically exist per endpoint or resource that is being consumed. For example, the appointments index contract will be different than the appointments show contract because the format of the data received will differ between them. However, it is possible for contracts to be applied to multiple endpoints if their format is expected to be identical.
- Contracts are defined in json files within the vets-api.
- It is feature flagged per contract. Flags are only expected to ever be turned on in staging. It could be used in production if we ever have reason to think production responses differ from staging.
- It only tests successful responses.
- It only runs one time per contract per day
- It runs in a background worker to avoid adding time to requests
- It saves the response body and any schema errors found to the database
- The tests are only as good as the schema provided. It's critical to specify which properties are required or nullable and to use `additionalProperties: false` within each object within the schema in order to know when properties are added or removed or have suddenly started returning null values.
- when the vets-api receives information from upstream, we can pass the unaltered response to the testing library. receives the unaltered response from the upstream request. If the response was successful, it checks the database to see if a contract test record for the current endpoint has been created yet for the current day. If no record exists, it creates one including the response body and initiates a background job for validating the response against the schema. If any errors are found, they are raised with a detailed error message to alert developers to investigate. The database record is updated to include the error details and status (i.e., success or errors found) to provide a persistent papertrail for debugging.

To add a new contract...
