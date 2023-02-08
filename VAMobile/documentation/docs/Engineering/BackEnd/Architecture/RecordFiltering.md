# Record Filtering

## Overview

The vets-api has a mechanism built into the `Common::Collection` class that's intended to be used to filter lists of records. However, there are a number of problems with this, including the fact that many of the services we use to fetch indexes do not return data in collections and instead just use arrays. Additionally, the filtering mechanism requires changes to the filtered model to enable filtering and to define the type of filtering allowed. There are also some limits to the collection's filtering logic that have prevented this library from meeting our requirements. And since both `Common::Collection` and many of the models we use exist outside of the mobile module, they're not easy for us to change.

To address these limitations, we've created our own filtering library that borrows the same param syntax from `Common::Collection` but removes the requirement to make changes to the model. This will allow us to easily apply filters to all of our indexes and make changes to the filtering logic as needed without the risk of impacting other teams.

## Usage

### Backend

Adding filtering is a per-endpoint action. After fetching the records, call:
`records, errors = ListFilter.matches(records, params[:filter])`

The `records` object passed to `ListFilter` must be an array of either `Common::Resource` or `Common::Base` objects. The filter argument must be a controller `params` object. `ListFilter` will always return two objects: the matching records and any errors encountered. See [error handling](#error-handling) for details.

Any caching should be done on the unfiltered records, not on the results of the filtering. Any pagination should be done on the results of the filtering.

### Frontend

The front end must provide filters as query params in the format `filter[model_attribute][operation]=value`. For example, if your model implements an attribute called "status" and you want to receive only records where the status equals "complete", you would add the param `filter[status][eq]=complete`.

At this time, our filtering system only supports two operations: `eq` and `not_eq`. Attribute/operation pairs can only be used once. In other words, you can't request `filter[status][eq]=complete` and `filter[status][eq]=pending`. This is a limitation in how params are processed by the rails app. We intend to add "one of these values" functionality as well as other operations later.

Filters are additive. In other words, if the request contains `filter[status][eq]=complete` and `filter[telehealth][not_eq]=true`, you will receive only records where the status is complete and telehealth is not true.

As discussed [below](#error-handling), error behavior can be defined on a per-endpoint or even per-error-case basis.

## Error Handling

Any errors encountered during the filter process, either due to invalid filters or other causes, will cancel the filtering process. The filter library will return all records as well as the error encountered. What we do with that information can be determined on a per-endpoint basis. It is up to the controller to determine whether to re-raise the error or pass it back to the client in the metadata.

This approach was chosen in order to keep our endpoints as stable as possible until we determine that filtering is reliable and error-free. As we develop greater confidence in the filtering and our requirements become clearer, we may later decide to always allow the error to be raised.

