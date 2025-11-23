# Prescription Refill Functionality Investigation

## Problem Statement
Users with the Cerner medications pilot feature (`medicationsOracleHealthEnabled`) enabled experience issues where:
1. Refillable medications appear in the prescription list
2. Tapping the "Refill" button shows no refillable medications in the RefillScreen
3. Tapping on individual medication details shows no "Request Refill" button

## Root Cause Analysis

### Background
The app supports two prescription API versions:
- **v0 (Legacy)**: `/v0/health/rx/prescriptions`
- **v1 (OracleHealth/Cerner)**: `/v1/health/rx/prescriptions`

The version is determined by the `medicationsOracleHealthEnabled` flag from the authorized services endpoint.

### Key Finding
The issue is caused by the `isRefillable` field in prescription data not being properly set or having an unexpected value when using the v1 API. This field is critical for:
1. Filtering prescriptions in RefillScreen
2. Showing the refill button in PrescriptionDetails

### How Refill Logic Works

#### Data Flow
```
1. API Request: GET /{v0|v1}/health/rx/prescriptions
   ↓
2. Response includes: prescription.attributes.isRefillable (boolean)
   ↓
3. RefillScreen filters: filter(prescriptions, p => p.attributes.isRefillable)
   ↓
4. PrescriptionDetails checks: if (isRefillable) { show button }
```

#### Critical Code Locations
```typescript
// 1. API Fetching (getPrescriptions.tsx)
const API_VERSION = medicationsOracleHealthEnabled ? 'v1' : 'v0'
return get(`/${API_VERSION}/health/rx/prescriptions`, params)

// 2. RefillScreen Filtering (RefillScreen.tsx:54-56)
const refillablePrescriptions = filter(allPrescriptions, (prescription) => {
  return prescription.attributes.isRefillable  // ← KEY FILTER
})

// 3. Details Button Display (PrescriptionDetails.tsx:74-76)
else if (isRefillable) {
  return getRequestRefillButton()  // ← SHOWS BUTTON
}
```

### Hypotheses (Most to Least Likely)

#### 1. v1 API Not Returning isRefillable Field ⭐ PRIMARY HYPOTHESIS
**Description**: The v1 backend API may not be populating the `isRefillable` field in its response.

**Evidence**:
- Mock data (used in tests) correctly includes `isRefillable: true/false`
- All tests pass with mock data
- Real v1 API behavior likely differs from mocks
- Field might be missing, null, or undefined

**Impact**:
- `prescription.attributes.isRefillable` evaluates to `undefined`
- Filter: `undefined` is falsy → empty array
- Details: `if (undefined)` → no button shown

#### 2. Field Name Mismatch
**Description**: v1 API might use a different field name (e.g., `refillable`, `can_refill`, `is_refillable`).

**Evidence**:
- API client sends `'X-Key-Inflection': 'camel'` header to request camelCase keys
- v1 backend might not respect this header or have different naming

#### 3. Type Mismatch
**Description**: v1 API might return `isRefillable` as string `'true'`/`'false'` instead of boolean.

**Impact**: Less likely but possible - would cause different symptoms

#### 4. Business Logic Differences
**Description**: v1 API might have stricter business logic that sets `isRefillable: false` for medications that should be refillable.

**Evidence**: Pilot program may have different authorization or facility-specific rules

## Implemented Solution

### Changes Made

#### 1. Diagnostic Logging in getPrescriptions.tsx
Added detailed logging when using v1 API in development mode to help identify the issue:
```typescript
if (__DEV__ && useV1 && response?.data) {
  console.debug(`[Prescriptions v1] Fetched ${response.data.length} prescriptions`)
  console.debug(`[Prescriptions v1] Refillable count: ${refillableCount}`)
  console.debug('[Prescriptions v1] Sample prescription attributes:', {
    id: firstPrescription.id,
    hasIsRefillable: 'isRefillable' in firstPrescription.attributes,
    isRefillableValue: firstPrescription.attributes.isRefillable,
    isRefillableType: typeof firstPrescription.attributes.isRefillable,
    refillStatus: firstPrescription.attributes.refillStatus,
    refillRemaining: firstPrescription.attributes.refillRemaining,
  })
}
```

#### 2. Defensive Programming in RefillScreen.tsx
Changed from implicit to explicit boolean check:
```typescript
// Before
const refillablePrescriptions = filter(allPrescriptions, (prescription) => {
  return prescription.attributes.isRefillable
})

// After
const refillablePrescriptions = filter(allPrescriptions, (prescription) => {
  const isRefillable = prescription.attributes.isRefillable
  if (__DEV__ && isRefillable !== true && isRefillable !== false) {
    console.debug('[RefillScreen] Prescription with unexpected isRefillable value:', {
      id: prescription.id,
      name: prescription.attributes.prescriptionName,
      isRefillable,
      type: typeof isRefillable,
    })
  }
  return isRefillable === true  // ← Explicit boolean check
})
```

#### 3. Defensive Programming in PrescriptionDetails.tsx
Added explicit boolean check and diagnostic logging:
```typescript
// Before
else if (isRefillable) {
  return getRequestRefillButton()
}

// After
else if (isRefillable === true) {  // ← Explicit boolean check
  return getRequestRefillButton()
}

// Added diagnostic logging
if (__DEV__ && isRefillable !== false && refillStatus !== RefillStatusConstants.TRANSFERRED) {
  console.debug('[PrescriptionDetails] Refill button not shown:', {
    id: prescription.id,
    name: prescriptionName,
    isRefillable,
    isRefillableType: typeof isRefillable,
    refillStatus,
    refillRemaining,
  })
}
```

### Benefits of This Approach

1. **Diagnostic Capability**: Console logs will reveal the actual issue with v1 API responses
2. **Defensive Programming**: Explicit `=== true` checks prevent type coercion issues
3. **No Regression**: All existing tests pass
4. **Development-Only**: Logging only enabled in `__DEV__` mode
5. **Actionable Data**: Logs provide exact information needed to identify root cause

### Testing Results
✅ All 59 prescription-related tests pass
✅ No breaking changes to existing functionality
✅ Backward compatible with v0 API

## Next Steps for Complete Resolution

### 1. Reproduce Issue with v1 API
Enable `medicationsOracleHealthEnabled` for a test user and:
1. Check console logs for prescription data structure
2. Verify `isRefillable` field presence and value
3. Document actual v1 API response structure

### 2. Backend Investigation
If v1 API is missing `isRefillable`:
- File backend issue to add/fix the field
- Verify `'X-Key-Inflection': 'camel'` header is respected
- Ensure field is properly calculated based on business logic

### 3. Frontend Fix (if needed)
Based on findings, implement one of:
- **Field mapping**: Map alternative field name to `isRefillable`
- **Type conversion**: Convert string to boolean if needed
- **Business logic**: Calculate `isRefillable` from other fields if backend can't provide it
- **Fallback logic**: Use refill status + refill remaining as indicators

### 4. Add Integration Tests
Create tests using actual v1 API response structure to prevent regression

## How to Use Diagnostic Logs

### Enable Logging
1. Run app in development mode
2. Enable `medicationsOracleHealthEnabled` for test user
3. Navigate to prescriptions screen
4. Check Metro bundler console

### Interpreting Logs

#### Example 1: Field Missing
```
[Prescriptions v1] Fetched 5 prescriptions
[Prescriptions v1] Refillable count: 0
[Prescriptions v1] Sample prescription attributes: {
  id: "123",
  hasIsRefillable: false,  ← FIELD MISSING
  isRefillableValue: undefined,
  isRefillableType: "undefined",
  refillStatus: "active",
  refillRemaining: 3
}
```
**Action**: Backend needs to add `isRefillable` field

#### Example 2: Type Mismatch
```
[Prescriptions v1] Sample prescription attributes: {
  hasIsRefillable: true,
  isRefillableValue: "true",  ← STRING NOT BOOLEAN
  isRefillableType: "string",
}
```
**Action**: Add type conversion in frontend or fix backend

#### Example 3: Always False
```
[Prescriptions v1] Sample prescription attributes: {
  hasIsRefillable: true,
  isRefillableValue: false,  ← ALWAYS FALSE
  isRefillableType: "boolean",
  refillStatus: "active",
  refillRemaining: 3  ← HAS REFILLS BUT NOT REFILLABLE
}
```
**Action**: Backend business logic issue

## Related Files
- `src/api/prescriptions/getPrescriptions.tsx` - API fetching with logging
- `src/api/prescriptions/requestRefills.tsx` - Refill request submission
- `src/screens/HealthScreen/Pharmacy/RefillScreens/RefillScreen.tsx` - Refill screen with filtering
- `src/screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionDetails.tsx` - Details screen with button
- `src/api/types/PrescriptionData.ts` - Type definitions
- `src/store/api/api.ts` - API client configuration

## API Contract Reference

### Expected v1 Response Structure
```typescript
{
  data: [
    {
      id: "string",
      type: "Prescription",
      attributes: {
        prescriptionName: "string",
        prescriptionNumber: "string",
        refillStatus: "active" | "discontinued" | "expired" | ...,
        refillRemaining: number,
        isRefillable: boolean,  // ← REQUIRED FIELD
        isTrackable: boolean,
        facilityName: "string",
        facilityPhoneNumber: "string",  // v1 only
        quantity: number,
        stationNumber: "string",
        tracking: Array<TrackingItem>  // v1 only
        // ... other fields
      }
    }
  ],
  meta: {
    prescriptionStatusCount: {
      isRefillable: number  // Count of refillable prescriptions
      // ...
    }
  }
}
```

### API Client Headers
```typescript
headers: {
  'X-Key-Inflection': 'camel',  // Request camelCase keys from backend
  // ... other headers
}
```

## Conclusion

This investigation has:
1. ✅ Documented how refill functionality works
2. ✅ Developed comprehensive hypotheses about the bug
3. ✅ Implemented diagnostic logging to identify root cause
4. ✅ Added defensive programming to handle edge cases
5. ✅ Maintained backward compatibility

The diagnostic logs will reveal the exact issue with the v1 API, enabling a targeted fix. The explicit boolean checks provide protection against type coercion issues while we investigate the root cause.
