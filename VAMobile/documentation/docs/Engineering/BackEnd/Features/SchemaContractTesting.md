# Schema Contract Testing

## Background

We developed a schema contract testing libary that alerts us to schema changes in responses from services upstream of the vets-api.

## What is a contract?

For the purposes of this document, a contract exists between the vets-api and external services that it contacts for data. Contracts are defined in json files within the vets-api. Those files define the [json schema](https://json-schema.org/specification) that is expected to be received from the external service. They define the shape of the data that is expected as well as the data types of the values received.

Contracts will typically exist per endpoint or resource that is being consumed. For example, the appointments index and immunizations index will require different contracts because the underlying resources are different. Whereas the appointments index and appointment show endpoints return the same resource but will require different contracts because the index will expect an array of appointments while the  show will expect a single appointment. However, it is possible for contracts to be applied to multiple endpoints if their format is expected to be identical.

## How does contract testing work?

- It is feature flagged per contract. Flags are only expected to ever be turned on in staging. It could be used in production if we ever have reason to think production responses differ from staging.
- It only tests successful responses.
- It only runs one time per contract per day
- It runs in a background worker to avoid adding time to requests
- It saves the response body and any schema errors found to the database

- when the vets-api receives information from upstream, we can pass the unaltered response to the testing library. receives the unaltered response from the upstream request. If the response was successful, it checks the database to see if a contract test record for the current endpoint has been created yet for the current day. If no record exists, it creates one including the response body and initiates a background job for validating the response against the schema. If any errors are found, they are raised with a detailed error message to alert developers to investigate. The database record is updated to include the error details and status (i.e., success or errors found) to provide a persistent papertrail for debugging.

## How to add a new contract

## Limitations

The tests are only as good as the schema provided. It's critical to specify which properties are required or nullable and to use `additionalProperties: false` within each object within the schema in order to know when properties are added or removed or have suddenly started returning null values.