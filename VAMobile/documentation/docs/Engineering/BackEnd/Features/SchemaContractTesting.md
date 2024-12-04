---
title: Schema Contract Testing
---

## Background

We developed a schema contract testing libary that alerts us to schema changes in responses from services upstream of the vets-api.

## What is a contract?

Within the context of this library, a contract is a means of ensuring that interactions between the vets-api and external services that it consumes remain unchanged over time. They're defined in json files within the vets-api that define the shape of the data that is expected to be received from the external service. The contract specifies which data fields are expected and the data types of the values.

Contracts will typically exist per endpoint or resource that is being consumed. For example, the appointments index and immunizations index will require different contracts because the underlying resources are different. Whereas the appointments index and appointment show endpoints return the same resource but will require different contracts because the index will expect an array of appointments while the show will expect a single appointment. However, it is possible for contracts to be applied to multiple endpoints if their format is expected to be identical.

## How does contract testing work?

When the vets-api receives information from upstream, we can pass the unaltered response to the testing library. If the response was successful, the library checks the database to see if a contract test record for that contract has been created yet for the current day. If no record exists, it creates one with the response body and initiates a background job for validating the response against the schema. When the background job is executed, it looks up the newly created record and compares the saved response against the contract. If any errors are found, they are raised with a detailed error message to alert developers to investigate. The database record is then updated to include the error details and status of the comparison (i.e., success or schema errors found) to provide a persistent papertrail for debugging.

The contract testing library is designed to only run once per day per contract in order to limit the impact on servers.

## Feature flagging

Schema contract testing is feature flagged per contract. This feature is only expected to ever be turned on in staging but could be turned on in production if we ever have reason to think production responses differ from staging.

## How to add a new contract

1. add a contract json file. It will require a unique contract name. For example, the appointments index method has a contract called `appointments_index.json`. This name is used to bind the contract and feature flag together. The file can be placed anywhere in the vets-api but best practice is to put it in the module that uses it.
2. add a new entry to the `schema_contract` section of `config/settings.yml` that speficies the location of the contract json file.
3. add a new feature flag. The feature flag name must be in the format of `schema_contract_#{unique_contract_name}`.
4. in the vets-api, pass the unaltered response from upstream to the validation initator: `SchemaContract::ValidationInitiator.call(user:, response:, contract_name: 'unique_contract_name')`

## Limitations

The tests are only as good as the schema provided. It's critical to specify which properties are required or nullable and to use `additionalProperties: false` within each object within the schema in order to know when properties are added or removed or have suddenly started returning null values.
