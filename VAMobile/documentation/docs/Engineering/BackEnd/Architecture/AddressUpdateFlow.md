---
title: Address Update Flow
---

Updating an address is a two step process with different option for what to send in the request body.Below are three scenarios for updating when the user has entered a valid address with a single match.A valid address with multiple suggested address matches. And when a user has entered what the validation service considers and invalid addres but the user would like to override that and use it anyway.

## Single match valid address

```rst
POST /v0/user/addresses/validate
```

### Validate Address Request

```json
{
  "addressLine1": "51 W Weber Rd",
  "addressType": "DOMESTIC",
  "city": "Columbus",
  "countryName": "United States",
  "countryCodeIso3": "USA",
  "stateCode": "OH",
  "zipCode": "43202",
  "type": "DOMESTIC",
  "addressPou": "CORRESPONDENCE"
}
```

### Validate Address Response

The address has a 100% confidence score. The address that's returned can be sent in a new/update request. In this case the address object in the meta data should be passed along in that request.

```json
{
  "data": [
    {
      "id": "a3add173-380c-4387-9d72-276b755aa980",
      "type": "suggested_address",
      "attributes": {
        "addressLine1": "51 W Weber Rd",
        "addressLine2": null,
        "addressLine3": null,
        "addressPou": "CORRESPONDENCE",
        "addressType": "DOMESTIC",
        "city": "Columbus",
        "countryCodeIso3": "USA",
        "internationalPostalCode": null,
        "province": null,
        "stateCode": "OH",
        "zipCode": "43202",
        "zipCodeSuffix": "1922"
      },
      "meta": {
        "address": {
          "confidenceScore": 100.0,
          "addressType": "Domestic",
          "deliveryPointValidation": "CONFIRMED",
          "residentialDeliveryIndicator": "RESIDENTIAL"
        },
        "validationKey": -1398777841
      }
    }
  ]
}
```

```rst
PUT /v0/user/addresses
```

### User Address Request

```json
{
  "addressMetaData": {
    "confidenceScore": 100.0,
    "addressType": "Domestic",
    "deliveryPointValidation": "CONFIRMED",
    "residentialDeliveryIndicator": "RESIDENTIAL"
  },
  "addressLine1": "51 W Weber Rd",
  "addressType": "DOMESTIC",
  "city": "Columbus",
  "countryName": "United States",
  "countryCodeIso3": "USA",
  "stateCode": "OH",
  "zipCode": "43202",
  "addressPou": "CORRESPONDENCE",
  "id": 181513
}
```

#### Addresses Response

```json
{
  "data": {
    "id": "b2e51260-00c9-4db6-80f6-b6c7541a9e54",
    "type": "async_transaction_vet360_address_transactions",
    "attributes": {
      "transactionId": "b2e51260-00c9-4db6-80f6-b6c7541a9e54",
      "transactionStatus": "COMPLETED_SUCCESS",
      "type": "AsyncTransaction::Vet360::AddressTransaction",
      "metadata": []
    }
  }
}
```

## Multiple match addresses

```rst
POST /v0/user/addresses/validate
```

### Multiple Addresses Request

```json
{
  "addressLine1": "37 1st st",
  "addressType": "DOMESTIC",
  "city": "Brooklyn",
  "countryName": "United States",
  "countryCodeIso3": "USA",
  "stateCode": "NY",
  "zipCode": "11249",
  "type": "DOMESTIC",
  "addressPou": "CORRESPONDENCE",
}
```

### Multiple Addresses Response

In this case two address matches are returned and should be displayed to the user so they can pick which they'd like to use. As above the `meta.address` object is passed along in the new/update request.

```json
{
  "data": [
    {
      "id": "56c30b81-9162-4f64-86ce-e7eaa3ae0327",
      "type": "suggested_address",
      "attributes": {
        "addressLine1": "37 N 1st St",
        "addressLine2": null,
        "addressLine3": null,
        "addressPou": "CORRESPONDENCE",
        "addressType": "DOMESTIC",
        "city": "Brooklyn",
        "countryCodeIso3": "USA",
        "internationalPostalCode": null,
        "province": null,
        "stateCode": "NY",
        "zipCode": "11249",
        "zipCodeSuffix": "3939"
      },
      "meta": {
        "address": {
          "confidenceScore": 100.0,
          "addressType": "Domestic",
          "deliveryPointValidation": "UNDELIVERABLE"
        },
        "validationKey": -73046298
      }
    },
    {
      "id": "671e752c-3292-4a2b-8747-d42b2bd56055",
      "type": "suggested_address",
      "attributes": {
        "addressLine1": "37 S 1st St",
        "addressLine2": null,
        "addressLine3": null,
        "addressPou": "CORRESPONDENCE",
        "addressType": "DOMESTIC",
        "city": "Brooklyn",
        "countryCodeIso3": "USA",
        "internationalPostalCode": null,
        "province": null,
        "stateCode": "NY",
        "zipCode": "11249",
        "zipCodeSuffix": "4101"
      },
      "meta": {
        "address": {
          "confidenceScore": 100.0,
          "addressType": "Domestic",
          "deliveryPointValidation": "CONFIRMED",
          "residentialDeliveryIndicator": "MIXED"
        },
        "validationKey": -73046298
      }
    }
  ]
}
```

```rst
PUT /v0/user/addresses
```

### Multiple Addresses Request 2

```json
{
  "addressMetaData": {
    "confidenceScore": 100.0,
    "addressType": "Domestic",
    "deliveryPointValidation": "CONFIRMED",
    "residentialDeliveryIndicator": "MIXED"
  },
  "addressLine1": "37 S 1st St",
  "addressPou": "CORRESPONDENCE",
  "addressType": "DOMESTIC",
  "city": "Brooklyn",
  "countryCodeIso3": "USA",
  "stateCode": "NY",
  "zipCode": "11249",
  "zipCodeSuffix": "4101",
  "id": 181513
}
```

### Multiple Addresses Response 2

```json
{
  "data": {
    "id": "b2e51260-00c9-4db6-80f6-b6c7541a9e54b2e51260-00c9-4db6-80f6-b6c7541a9e54",
    "type": "async_transaction_vet360_address_transactions",
    "attributes": {
      "transactionId": "b2e51260-00c9-4db6-80f6-b6c7541a9e54",
      "transactionStatus": "COMPLETED_SUCCESS",
      "type": "AsyncTransaction::Vet360::AddressTransaction",
      "metadata": []
    }
  }
}
```

## Overridding and 'invalid' address

```rst
POST /v0/user/addresses/validate
```

### Invalid Address Request

```json
{
  "addressLine1": "4200 Weasel Rd",
  "addressType": "DOMESTIC",
  "city": "Columbus",
  "countryName": "United States",
  "countryCodeIso3": "USA",
  "stateCode": "OH",
  "zipCode": "43202",
  "type": "DOMESTIC",
  "addressPou": "CORRESPONDENCE"
}
```

### Invalid Address Response

This response comes back with a 0% confidence score. We can let the user override the validation by passing back the `meta.validationKey` in the new/update request.

```json
{
  "data": [
    {
      "id": "6ba2f94b-c143-40da-8c5d-a76a637945b5",
      "type": "suggested_address",
      "attributes": {
        "addressLine1": "4200 Weasel Rd",
        "addressLine2": null,
        "addressLine3": null,
        "addressPou": "CORRESPONDENCE",
        "addressType": "DOMESTIC",
        "city": "Columbus",
        "countryCodeIso3": "USA",
        "internationalPostalCode": null,
        "province": null,
        "stateCode": "OH",
        "zipCode": "43202",
        "zipCodeSuffix": null
      },
      "meta": {
        "address": {
          "confidenceScore": 0.0,
          "addressType": "Domestic",
          "deliveryPointValidation": "MISSING_ZIP"
        },
        "validationKey": 377261722
      }
    }
  ]
}
```

```rst
PUT /v0/user/addresses
```

### User Addresses Request

```json
{
  "validationKey": 377261722,
  "addressLine1": "4200 Weasel Rd",
  "addressType": "DOMESTIC",
  "city": "Columbus",
  "countryName": "United States",
  "countryCodeIso3": "USA",
  "stateCode": "OH",
  "zipCode": "43202",
  "type": "DOMESTIC",
  "addressPou": "CORRESPONDENCE",
  "id": 181513
}
```

### User Addresses Response

```json
{
  "data": {
    "id": "b2e51260-00c9-4db6-80f6-b6c7541a9e54",
    "type": "async_transaction_vet360_address_transactions",
    "attributes": {
      "transactionId": "b2e51260-00c9-4db6-80f6-b6c7541a9e54",
      "transactionStatus": "COMPLETED_SUCCESS",
      "type": "AsyncTransaction::Vet360::AddressTransaction",
      "metadata": []
    }
  }
}
```
