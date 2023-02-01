# Record Filtering

## Overview

The vets-api has a built-in filtering mechanism within the `Common::Collection` class that's intended to be used to organize lists of records. However, there are a number of problems with this, including the fact that many of the index services we use do not return data in collections and instead just use arrays. Additionally, the filtering mechanism requires changes to the filtered model to enable filtering and to define the type of filtering allowed. There are also some limits to the collection's filtering logic that have not met our requirements. And since both the `Common::Collection` and many of the models we use exist outside of the mobile module, they're not easy for us to change.

To address these limitations, we've created our own filtering library that borrows the same basic param syntax from `Common::Collection` but removes the requirement to define the filtering on the model. This will allow us to easily apply filters to all of our indexes and make changes to the filtering logic as needed without the risk of impacting other teams.

## Usage

### Backend changes

Adding filtering is a per-endpoint action. After fetching the records, call:
`records, errors = ListFilter.matches(records, params[:filter])`

The `records` object passed to `ListFilter` can be either an array or a `Common::Collection`. The filter argument must be a controller `params` object. If any errors are encountered by the `ListFilter`, it will return whatever `records` object was passed to it as well as the error that was encountered. See [error handling](#error-handling).

Any caching should be done on the unfiltered records, not on the results of the filtering. Any pagination should be done on the results of the filtering.

### Frontend changes

The front end must provide filters as query params in the format `filter[model_attribute][operation]=value`. For example, if your model implements an attribute called "status" and you want to receive only records where the status equals "complete", you would add the param `filter[status][eq]=complete`.

Filters are additive. In other words, if the request contains `filter[status][eq]=complete` and `filter[telehealth][not_eq]=true`, you will only receive records where the status is complete and telehealth is not true.

Attribute/operation pairs can only be used once. In other words, you can't request `filter[status][eq]=complete` and `filter[status][eq]=pending`. This is a limitation in how params are processed by the rails app. We intend to add another mechanism for "one of" functionality later.

## Error Handling

The ListFilter library returns two objects: the 
- error handling is not fully defined

## Limitations

This is a work in progress. Error handling is currently done on a case-by-case basis, but we may want to move toward a more consistent approach as our requirements become better defined.

At this time, only the eq and not_eq operations are supported but other operations are planned.
