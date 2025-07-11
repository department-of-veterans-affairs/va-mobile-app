---
title: Maintenance Windows
---

## Overview

Maintenance windows are periods of time during which specific vets-api functionality are expected to be down for maintenance. The mobile app requests this information at the beginning of new sessions and stores the data locally. If the user navigates to a page that relies on the service during the window, they will be shown a banner informing them that the data is temporarily unavailable and the app will not attempt to fetch the data.

## Back-end

Unlike most of the data used in the vets-api engine, `MaintenanceWindows` come from the vets-api database and not from upstream servers. They contain the external service name, start time, and end time. Maintenance windows are added to PagerDuty by other teams, and a vets-api sidekiq job polls PagerDuty and populates MaintenanceWindow database records with the response. There is an [allow list of maintenance windows](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/blob/9864e007626ceb2cd5c92b8c8838af1dbb3b4b7d/apps/vets-api/prod/values.yaml#L2169) on GitHub that the sidekiq job uses to connect to PagerDuty and populate the maintenance windows. The mobile app requests maintenance windows via the maintenance windows controller, which searches the database for `MaintenanceWindow` records that end in the future and creates a `ServiceGraph` object to process those windows into a format that is more easily used by the front-end.

The `ServiceGraph` is an abstraction that accepts a list of arguments that define a hierarchy that matches upstream services to downstream features and returns a list of upcoming `Mobile::MaintenanceWindow` records that have upcoming outages. Note that `Mobile::MaintenanceWindows` are different than `MaintenanceWindows` but contain the same basic data with service names that are specific to mobile app features. This allows the mobile team to define its own mapping of services to features. Each argument is an array of two symbols in which the first element is an upstream service or intermediate service and the second key is either an intermediate service or the feature name that would be received by the mobile app. Intermediate services are not included in the results, only terminal nodes (i.e., second items in the array that do not match the first items of any subsequent arrays).

An example `ServiceGraph` instance could be something like:

```ruby
Mobile::V0::ServiceGraph.new(
  %i[bep evss],
  %i[vet360 military_service_history],
  %i[evss claims],
  %i[evss direct_deposit_benefits]
)
```

This gets processed into a hierarchy like:

```js
{
  bep: [claims, direct_deposit_benefits],
  evss: [claims, direct_deposit_benefits],
  vet360: [military_service_history]
}
```

So if there's an upcoming maintenance window for either `bep` or `evss`, the `ServiceGraph` would return an array of `Mobile::MaintenanceWindow` objects including start and end times for `claims` and `direct_deposit_benefits`. If there's an upcoming maintenance window for `vet360`, it would return mobile maintenance window data for `military_service_history`. And if all three services had upcoming maintenance windows, it would return data for `claims`, `direct_deposit_benefits`, and `military_service_history`.

## Front-end

See [front-end documentation](../../FrontEnd/DowntimeMessages.md). It is important to note that coordination with front-end will be required for any changes to the `ServiceGraph` hierarchy in the maintenance windows controller because effort is required on the front-end to add handling for new maintenance windows within the mobile app.
