# Medications API V2 Migration - QA Summary

## Executive Summary

**PR:** #11645 - Add Oracle health Data to Prescriptions
**Branch:** mhv/meds-api-v2
**Impact:** Backend infrastructure change with **NO user interface modifications**

## What This Change Does

This update adds support for a new version (v1) of the VA Medications API that includes Oracle Health data, while maintaining complete backward compatibility with the existing v0 API. The change is controlled by feature toggles and designed to be transparent to end users.

## Key Points for Quality Assurance

### 1. No Visual Changes Expected ✓
- The user interface is **identical** for both API versions
- All prescription screens look and function exactly the same
- No new buttons, screens, or visual elements
- Users cannot tell which API version is being used

### 2. Feature Toggle Control ✓
The new v1 API is only used when **BOTH** of these conditions are met:
- `medicationsOracleHealthEnabled` = true (from authorization services, which is controlled by the `mhv_medications_cerner_pilot` vets-api Flipper toggle)
- `WG_MedsOracleHealthApiEnabled` = true (waygate toggle)

If either toggle is false, the app uses the legacy v0 API.

### 3. Functional Equivalence ✓
Both API versions must provide identical functionality:
- View prescriptions list
- View prescription details
- Request prescription refills
- View tracking information
- Handle errors gracefully

## Testing Strategy

### Core Test Scenarios
1. **View Prescriptions** - Verify list displays correctly with accurate data
2. **Request Refills** - Submit refill requests and verify success/failure handling
3. **View Tracking** - Check tracking information displays for shipped prescriptions
4. **Error Handling** - Verify graceful error handling in all scenarios

### Test Configurations
QA should test with each feature toggle combination:

| Config | medicationsOracleHealthEnabled | WG_MedsOracleHealthApiEnabled | API Used |
|--------|-------------------------------|-------------------------------|----------|
| 1      | ❌ False                       | ❌ False                       | v0       |
| 2      | ❌ False                       | ✅ True                        | v0       |
| 3      | ✅ True                        | ❌ False                       | v0       |
| 4      | ✅ True                        | ✅ True                        | v1       |

**Expected Result:** Identical user experience across all configurations.

## What QA Should Look For

### ✅ Success Criteria
- Prescription data displays accurately
- Refill requests process correctly
- Tracking information shows properly
- No crashes or errors
- Performance is acceptable
- Works on both iOS and Android

### ❌ Red Flags
- Different behavior between v0 and v1
- Crashes or freezes
- Missing or incorrect prescription data
- Refill requests failing unexpectedly
- Tracking information not displaying

## Technical Background

### API Differences (Backend Only)

| Aspect | v0 API | v1 API |
|--------|--------|--------|
| **Endpoint** | `/v0/health/rx/prescriptions` | `/v1/health/rx/prescriptions` |
| **Tracking** | Separate API call | Included in main response |
| **Carrier Field** | `deliveryService` | `carrier` |
| **Refill Request** | `{ ids: ["123"] }` | `[{ id: "123", stationNumber: "ABC" }]` |

The app handles these differences transparently - QA does not need to verify these technical details, only that the user experience is identical.

## Documentation

**Full QA Testing Guide:** 
`VAMobile/documentation/development/QA/MedicationsAPIv2-QA-Guide.md`

The detailed guide includes:
- Complete test scenarios with step-by-step instructions
- Test data requirements
- Platform-specific testing guidance
- Bug reporting guidelines
- Acceptance criteria
- Troubleshooting tips

## Test User Accounts

Use test accounts with varied prescription data:
- Multiple prescriptions
- Refillable prescriptions
- Prescriptions with tracking information
- Mix of prescription statuses (active, expired, etc.)

See: [Medications Test Accounts](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/teams/medications/test-accounts.md)

## Release Strategy

1. **Initial State:** Both toggles OFF - all users use v0 API
2. **Testing Phase:** Enable for test users only
3. **Gradual Rollout:** Progressively enable for user segments
4. **Full Deployment:** Enable for all users
5. **Cleanup:** Eventually remove v0 support (future work)

## Success Metrics

✅ **Deployment is successful when:**
- All prescription features work correctly with v1 API
- User experience is identical to v0 API
- No increase in error rates or crashes
- Performance metrics remain acceptable
- Both iOS and Android function properly

## Questions or Issues?

- **Development Team:** GitHub PR #11645
- **QA Documentation:** `VAMobile/documentation/development/QA/MedicationsAPIv2-QA-Guide.md`
- **Product Owner:** As per team communication channels

---

**Created:** October 21, 2025
**Status:** Ready for QA Testing
**Related PR:** #11645
