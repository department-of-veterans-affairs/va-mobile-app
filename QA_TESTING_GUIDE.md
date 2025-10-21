# QA Testing Guide: Medications API V2 Migration

## Overview

This document provides quality assurance testing guidance for the Medications API V2 migration (PR #11645). This is a **backend-only change** with **no user interface modifications**. The purpose of this change is to add support for a new version of the medications API (v1) that includes Oracle Health data, while maintaining backward compatibility with the existing v0 API.

## Important Note for QA Testers

**There are NO visible user interface changes in this update.** The user experience should be identical regardless of which API version is being used. This is by design - the changes are purely backend infrastructure to support future enhancements.

## What Changed (Technical Summary)

### Backend Changes
- **New API Version Support**: Added ability to call `/v1/health/rx/prescriptions` instead of `/v0/health/rx/prescriptions`
- **Feature Toggle Control**: The new API is controlled by two feature flags that must both be enabled:
  1. `medicationsOracleHealthEnabled` (from authorization services)
  2. `WG_MedsOracleHealthApiEnabled` (waygate toggle)
- **Enhanced Data Types**: Updated TypeScript types to support both v0 and v1 API response formats
- **Tracking Data Enhancement**: V1 API includes tracking data directly in prescription response (v0 requires separate API call)

### What Did NOT Change
- ❌ No changes to prescription list screens
- ❌ No changes to prescription detail screens  
- ❌ No changes to refill request screens
- ❌ No changes to tracking information screens
- ❌ No changes to how users interact with medications
- ❌ No new buttons, links, or UI elements
- ❌ No layout or styling changes

## Feature Toggle States

The behavior differs based on feature toggle configuration:

| medicationsOracleHealthEnabled | WG_MedsOracleHealthApiEnabled | API Used | Expected Behavior |
|-------------------------------|-------------------------------|----------|-------------------|
| ❌ False                       | ❌ False                       | v0       | Default - uses legacy API |
| ❌ False                       | ✅ True                        | v0       | Uses legacy API (both must be true) |
| ✅ True                        | ❌ False                       | v0       | Uses legacy API (both must be true) |
| ✅ True                        | ✅ True                        | v1       | Uses new Oracle Health API |

## Testing Approach

Since there are no UI changes, testing should focus on **functional equivalence** - ensuring the app works exactly the same regardless of which API version is active.

### Test Scenarios

#### Scenario 1: View Prescriptions List
**Steps:**
1. Navigate to Health > Pharmacy > Prescriptions
2. View the list of prescriptions

**Expected Results (Both v0 and v1):**
- Prescription list displays correctly
- All prescription names are visible
- Refill status indicators are accurate
- Prescription counts match expected values
- No errors or crashes occur

**Variations:**
- Test with different users who have varying numbers of prescriptions
- Test with users who have no prescriptions
- Test pagination if applicable

---

#### Scenario 2: Request a Prescription Refill
**Steps:**
1. Navigate to Health > Pharmacy > Prescriptions
2. Select a prescription that is eligible for refill
3. Tap "Request refill" or equivalent action
4. Confirm the refill request

**Expected Results (Both v0 and v1):**
- Refill request is submitted successfully
- Success/confirmation message displays
- Prescription status updates appropriately
- If refill fails, appropriate error message shows

**Variations:**
- Test successful refill (all prescriptions processed)
- Test partial failure (some prescriptions fail)
- Test complete failure (all prescriptions fail)
- Test with multiple prescriptions selected

**Technical Note:**
- v0 API sends: `{ ids: ["123", "456"] }`
- v1 API sends: `[{ id: "123", stationNumber: "ABC" }, { id: "456", stationNumber: "DEF" }]`
- Both should produce identical user experience

---

#### Scenario 3: View Prescription Tracking Information
**Steps:**
1. Navigate to Health > Pharmacy > Prescriptions
2. Select a prescription that has tracking information
3. View the tracking details

**Expected Results (Both v0 and v1):**
- Tracking number displays correctly
- Delivery service/carrier name shows (USPS, UPS, FedEx, DHL)
- Shipped date is accurate
- Other prescriptions in shipment are listed
- Tracking link (if applicable) works correctly

**Variations:**
- Test prescription with tracking information
- Test prescription without tracking information  
- Test with different delivery carriers

**Technical Note:**
- v0 API: Uses `deliveryService` field, requires separate API call for tracking
- v1 API: Uses `carrier` field, includes tracking data in main prescription response
- UI handles both formats transparently using: `const carrierName = deliveryService || carrier || ''`

---

#### Scenario 4: View Prescription Details
**Steps:**
1. Navigate to Health > Pharmacy > Prescriptions
2. Tap on any prescription to view details
3. Review all prescription information

**Expected Results (Both v0 and v1):**
- Prescription name displays correctly
- Prescription number is accurate
- Refill status is correct
- Facility information shows
- Quantity and dosage information is accurate
- Expiration date displays
- Refill count is correct
- Instructions are readable

---

#### Scenario 5: Error Handling
**Steps:**
1. Test prescription features in various error conditions:
   - No network connection
   - Server error (500)
   - Timeout
   - Invalid data

**Expected Results (Both v0 and v1):**
- Appropriate error messages display
- App does not crash
- User can retry or navigate away
- Error state is recoverable

---

## Test Matrix for Feature Toggle Combinations

QA should test at least one complete flow through the medications section for each feature toggle combination:

### Configuration 1: Default (Both flags OFF)
- ✅ medicationsOracleHealthEnabled: false
- ✅ WG_MedsOracleHealthApiEnabled: false
- **API Used**: v0
- **Test**: Complete prescription flow (view, refill, track)

### Configuration 2: Only Authorization Enabled
- ✅ medicationsOracleHealthEnabled: true
- ✅ WG_MedsOracleHealthApiEnabled: false
- **API Used**: v0
- **Test**: Complete prescription flow (view, refill, track)

### Configuration 3: Only Waygate Enabled
- ✅ medicationsOracleHealthEnabled: false
- ✅ WG_MedsOracleHealthApiEnabled: true
- **API Used**: v0
- **Test**: Complete prescription flow (view, refill, track)

### Configuration 4: Both Flags Enabled (New API)
- ✅ medicationsOracleHealthEnabled: true
- ✅ WG_MedsOracleHealthApiEnabled: true
- **API Used**: v1
- **Test**: Complete prescription flow (view, refill, track)

---

## Demo Mode Testing

The app supports demo mode for testing without real user data. Test in demo mode to verify:

1. Demo data displays correctly for both v0 and v1 endpoints
2. Prescription list shows sample medications
3. Refill requests work in demo mode
4. Tracking information displays in demo mode
5. No crashes or errors in demo mode

**Demo Mode Endpoints:**
- v0: `/v0/health/rx/prescriptions`
- v1: `/v1/health/rx/prescriptions`

Both endpoints should return appropriate mock data.

---

## Platform-Specific Testing

### iOS Testing
- ✅ Test on iOS 15+
- ✅ Verify all prescription screens load correctly
- ✅ Test prescription refill flow
- ✅ Verify tracking information displays
- ✅ Check accessibility features (VoiceOver)

### Android Testing  
- ✅ Test on Android 10+
- ✅ Verify all prescription screens load correctly
- ✅ Test prescription refill flow
- ✅ Verify tracking information displays
- ✅ Check accessibility features (TalkBack)

---

## Data Validation Points

Even though the UI doesn't change, verify data accuracy:

### Prescription List Data
- Prescription names match expected values
- Refill counts are accurate
- Status indicators are correct
- Dates are properly formatted

### Refill Response Data
- Successful refills are marked correctly
- Failed refills show appropriate messages
- Partial failures are handled correctly

### Tracking Data
- Tracking numbers are valid
- Carrier names are recognized (USPS, UPS, FedEx, DHL)
- Shipped dates are accurate
- Related prescriptions are listed

---

## Expected Differences Between v0 and v1 (Backend Only)

These differences exist in the API responses but should NOT be visible to users:

| Aspect | v0 API | v1 API |
|--------|--------|--------|
| **Endpoint** | `/v0/health/rx/prescriptions` | `/v1/health/rx/prescriptions` |
| **Tracking Data** | Separate API call required | Included in main response |
| **Carrier Field** | `deliveryService` | `carrier` |
| **Refill Request** | `{ ids: ["123"] }` | `[{ id: "123", stationNumber: "ABC" }]` |
| **Failed IDs** | Array of strings | Array of objects |
| **Additional Fields** | Base fields only | Includes Oracle Health fields |

---

## Regression Testing Checklist

Ensure these existing features still work correctly:

- [ ] Prescription list loads and displays
- [ ] Prescription search/filter (if applicable)
- [ ] Prescription sorting
- [ ] Prescription detail view
- [ ] Refill request submission
- [ ] Refill request success handling
- [ ] Refill request failure handling
- [ ] Tracking information display
- [ ] Tracking link functionality
- [ ] Prescription renewal reminders (if applicable)
- [ ] Prescription download/sharing (if applicable)
- [ ] Navigation between prescription screens
- [ ] Back button functionality
- [ ] Deep linking to prescriptions (if applicable)

---

## Performance Testing

While functionality should be identical, consider performance:

### v0 API (Current)
- Requires 2 API calls for prescription with tracking:
  1. GET `/v0/health/rx/prescriptions`
  2. GET `/v0/health/rx/prescriptions/{id}/tracking`

### v1 API (New)
- Requires 1 API call for prescription with tracking:
  1. GET `/v1/health/rx/prescriptions` (includes tracking data)

**Expected Result**: v1 may load tracking information slightly faster, but this should not be a noticeable UX difference.

---

## Known Limitations

1. **No Visual Changes**: QA cannot visually verify which API is being used
2. **Network Inspection Required**: To confirm v1 API usage, need to inspect network traffic
3. **Feature Toggle Dependencies**: Both flags must be enabled to use v1 API
4. **Gradual Rollout**: Not all users will see v1 API immediately

---

## Testing Tools

### Network Traffic Inspection
To verify which API version is being called:

**iOS:**
- Use Charles Proxy or similar tool
- Monitor requests to `/v0/health/rx/prescriptions` vs `/v1/health/rx/prescriptions`

**Android:**
- Use Charles Proxy or Android Studio Network Profiler
- Monitor requests to `/v0/health/rx/prescriptions` vs `/v1/health/rx/prescriptions`

### Feature Toggle Verification
- Check with development team for current toggle state
- Confirm test environment has appropriate toggles enabled/disabled

---

## Test User Accounts

Use test accounts that have:
1. **Multiple prescriptions** - to test list and pagination
2. **Refillable prescriptions** - to test refill flow
3. **Prescriptions with tracking** - to test tracking display
4. **Prescriptions without tracking** - to test null states
5. **Mix of statuses** - active, expired, discontinued, etc.

Reference test accounts documentation:
https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/teams/medications/test-accounts.md

---

## Bug Reporting

If issues are found, please report:

### Required Information
- **Platform**: iOS or Android (with version)
- **Feature Toggle State**: Which flags were enabled
- **Test User**: Account used for testing
- **Steps to Reproduce**: Exact steps taken
- **Expected Behavior**: What should have happened
- **Actual Behavior**: What actually happened
- **API Version**: v0 or v1 (if known from network inspection)
- **Screenshots/Videos**: Visual evidence of issue
- **Console Logs**: Any error messages

### Bug Severity Levels
- **Critical**: App crash, data loss, inability to use prescriptions
- **High**: Incorrect data display, refill failure when should succeed
- **Medium**: UI inconsistency, poor error messaging
- **Low**: Minor visual glitches, unclear text

---

## Acceptance Criteria

The following must be true for both v0 and v1 API configurations:

✅ **Functional Requirements**
- [ ] Users can view their prescription list
- [ ] Users can view prescription details
- [ ] Users can request prescription refills
- [ ] Users can view prescription tracking information
- [ ] Refill success/failure is handled correctly
- [ ] Error states are handled gracefully

✅ **Non-Functional Requirements**
- [ ] No crashes or app freezes
- [ ] No data corruption
- [ ] Performance is acceptable (<3s for list load)
- [ ] Accessibility features work correctly
- [ ] Works on supported iOS and Android versions

✅ **Data Integrity**
- [ ] Prescription data is accurate
- [ ] Refill counts are correct
- [ ] Tracking information is accurate
- [ ] No duplicate prescriptions shown

---

## Summary

This migration is a **transparent backend change** designed to support future enhancements to the medications feature. Quality assurance should focus on **functional equivalence** - ensuring the app works exactly the same way regardless of which API version is being used.

### Key Testing Principles

1. **No UI Differences Expected**: The user interface should be identical for v0 and v1
2. **Feature Toggle Control**: Test all combinations of feature flags
3. **Data Accuracy**: Verify prescription data is correct in all scenarios
4. **Error Handling**: Ensure errors are handled gracefully
5. **Platform Coverage**: Test on both iOS and Android
6. **Regression Prevention**: Verify existing features still work

### Success Metrics

✅ All prescription features work correctly with v0 API (baseline)
✅ All prescription features work correctly with v1 API (new)
✅ No crashes or errors in either configuration
✅ Data accuracy maintained in both configurations
✅ Performance is acceptable in both configurations

---

## Questions or Issues

If you have questions about this testing guide or encounter issues during testing, please contact:

- **Development Team**: Via GitHub issue or PR #11645
- **QA Lead**: As per team communication channels
- **Product Owner**: For clarification on expected behavior

---

**Document Version**: 1.0
**Last Updated**: October 21, 2025
**Related PR**: #11645 - Add Oracle health Data to Prescriptions
**Related Branch**: mhv/meds-api-v2
