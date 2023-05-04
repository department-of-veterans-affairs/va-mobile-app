# Maintenance Windows

## Overview

Maintenance windows are periods of time during which specific vets-api functionality are expected to be down for maintenance. The mobile app requests this information after login and stores the data locally. If the user navigates to a page that relies on the service during the window, they will be shown a banner informing them that the data is temporarily unavailable and the app will not attempt to fetch the data.

## Backend

Unlike most of the data used in the vets-api engine, MaintenanceWindows come from the database and not from upstream servers. (How do they get there?) They contain the external service name, start time, and end time. The mobile app requests maintenance windows via the maintenance windows controller, which creates a ServiceGraph object that searches the database for MaintenanceWindow records that end in the future.

The ServiceGraph is an abstraction that accepts a flexible number of arguments with each argument being an array consisting of two symbols and returns a list of features that have upcoming outages due to maintenance windows. The service graph forms a hierarchy in which the first element is the top-most service and the second key is either an intermediate service or the feature name that would be received by the mobile app. Intermediate services are not included in the results, only terminal nodes (i.e., second items in the array that do not match the first items of any subsequent arrays).

An example ServiceGraph instance could be something like:
```
Mobile::V0::ServiceGraph.new(
  %i[bgs evss],
  %i[vet360 military_service_history],
  %i[evss claims],
  %i[evss direct_deposit_benefits]
)
```

Using the above example, if there is an upcoming maintenance window for `bgs`, it would return `[claims, direct_deposit_benefits]`. It would not include `evss` because that is an intermediate service and not a terminal node. If there is an upcoming a maintenance window for `evss`, it would also return `[claims, direct_deposit_benefits]`.

## Frontend

After a user starts a new session, the mobile app pings the backend for the maintenance window list and stores it locally. The items returned are intended to map to features within the mobile app. So, continuing with the example from above, military_service_history, claims, and military_service_history should be features within the mobile app, while bgs, evss, and vet360 should not be. 