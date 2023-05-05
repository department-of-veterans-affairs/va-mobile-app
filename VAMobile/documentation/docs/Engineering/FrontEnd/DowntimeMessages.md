---
title: Downtime Messages
sidebar_position: 6
---

# Downtime Messages

## Overview

**Downtime Messages** are error pages that shown to users when a known `maintenance window` is actively occuring for a specific feature in the app. Downtime windows are determined by upstream service providers and compiled into a single list by the back-end. The front-end checks for active downtime windows once per session during the sync stage after login and caches the data for the remainder of the session.

Downtime messages use the same display pattern as errors in code, with additional checks in the `useError` utility to check if a downtime error exists for a specific `screen ID`. Multiple features can trigger a downtime message on a single screen, e.g. claims and appeals are two separate features but display on the same page. Whether a downtime message is displayed if a subset of features on the screen are down is a business decision that varies based on feature.

## Maintenance Window Technical Description

The data returned from the back-end for a `maintenance window` includes a `service name`, and start time, and an end time. The service name is determined by the back-end and is not directly equivalent to `feature names` used in the front-end, so a mapping from `service name` to `feature name` as well as `service name` to the affected `screen ID` is provided in the `store/api/types/Errors.ts` file. Anytime a new feature with downtime is added, this mapping needs to be updated and the rest of the logic will automatically piggyback off of error logic and the checks in `store/slices/errorSlice.ts:checkForDowntimeErrors()`.

Maintenance windows, as derived from `DowntimeFeatureTypeConstants`, are also used in some cases within view components to disable data fetches from the backend to avoid fetching data that we know will be unavailable or unreliable during maintenance windows.

Example return data from `/v0/maintenance_windows` endpoint:
```
data: [
  {
    attributes: {
      service: 'direct_deposit_benefits',
      startTime: '2021-06-01T12:00:00.000Z',
      endTime: '2021-06-01T18:00:00.000Z',
    },
    id: '1',
    type: 'maintenance_window',
  },
  {
    attributes: {
      service: 'military_service_history',
      startTime: '2021-06-01T12:00:00.000Z',
      endTime: '2021-06-01T18:00:00.000Z',
    },
    id: '2',
    type: 'maintenance_window',
  },
]
```

## Downtime Messages Display

The downtime message displays as a full page error with a warning border. The template and an example are show below

![Downtime Messages Template](/img/downtimeMessagesImages/downtime-messages-template.png)

![Downtime Messages Example](/img/downtimeMessagesImages/downtime-messages-example.png)

## Back-end

See back-end documentation [here](../BackEnd/Features/MaintenanceWindows.md)