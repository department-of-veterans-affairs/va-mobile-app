# API update plan

## Requirements

- be able to turn the use of a new API endpoint per person + per app version
- F&F will be unknown size, but must be the same folks who can va.gov

## Approach

- new waygate toggle `WG_UsePerscriptionsV1` toggle
- Update the `getPresecriptions` hook to take a boolean `useV1`
  - in the 5 places were we call that hook, we pass in the `WG_UsePerscriptionsToggle`

## Challenge

## option 1

- F&F use test flight; depending on how big the F&F size is

## Option 2

- create a flipper feature toggle on the vets-api (for user)
- new waygate toggle `WG_UsePerscriptionsV1` toggle
- Call flipper feature toggle on app load and use that to judge

## On API

- We nee to create a prescriptionStatusCount object

```json
"prescriptionStatusCount": {
    "active": 24,
    "isRefillable": 44,
    "discontinued": 1,
    "expired": 4,
    "historical": 3,
    "pending": 8,
    "transferred": 1,
    "submitted": 0,
    "hold": 1,
    "unknown": 1,
    "total": 31
  },
```
