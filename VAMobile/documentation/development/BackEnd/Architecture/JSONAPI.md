---
title: JSON API
---

## Overview

With a few exceptions, all Mobile API endpoints adhere to the JSON API specification which can be found at [https://jsonapi.org/](https://jsonapi.org/).

## Exceptions

There are two types of exceptions for endpoints that deviate from the JSON API spec:

1. Some older endpoints unintentionally deviates from the JSON API spec and cannot be fixed without versioning the endpoint.
2. All endpoints that return a file are intentionally not following the JSON API spec as there are a number of disadvantages to nesting a file in a JSON object.  

These exceptions can be found by going through the request specs that have the option `skip_json_api_validation: true`.
