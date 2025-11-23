# Medication List Data Flow and Cache Analysis

## Overview
This document analyzes the medication/prescription data flow in the VA Mobile App and identifies potential causes for medication data loss resulting in empty list displays.

## Data Flow Architecture

### 1. Data Fetching with React Query

The app uses **React Query v5** (`@tanstack/react-query: ^5.59.15`) for server state management.

#### Query Configuration

**Global Configuration** (`src/api/queryClient.ts`):
```typescript
export default new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,  // 5 seconds default
    },
  },
})
```

**Prescription-Specific Configuration** (`src/api/prescriptions/getPrescriptions.tsx`):
```typescript
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  return useQuery({
    enabled: !!(authorizedServices?.prescriptions && !rxInDowntime && queryEnabled),
    queryKey: prescriptionKeys.prescriptions, // ['prescriptions']
    queryFn: () => getPrescriptions({ useV1: medicationsOracleHealthEnabled }),
    staleTime: ACTIVITY_STALE_TIME, // 300000ms = 5 minutes
  })
}
```

**Key Query Parameters:**
- `queryKey`: `['prescriptions']` - Static key with no parameters
- `staleTime`: 300,000ms (5 minutes) - Data considered fresh for 5 minutes
- `gcTime`: Not explicitly set - Uses React Query v5 default of **5 minutes (300,000ms)**
- `enabled`: Conditionally enabled based on authorized services and downtime status

### 2. Data Call Locations

#### Home Screen (`src/screens/HomeScreen/HomeScreen.tsx`)
```typescript
const prescriptionsQuery = usePrescriptions({ enabled: isFocused })
```
- Called when Home screen is **focused**
- Used to display activity button showing refillable prescription count
- `isFocused` from `@react-navigation/native` - true when screen is active

#### Prescription History Screen (`src/screens/HealthScreen/Pharmacy/PrescriptionHistory/PrescriptionHistory.tsx`)
```typescript
const {
  data: prescriptionData,
  isFetching: loadingHistory,
  error: hasError,
  isFetched: prescriptionsFetched,
  refetch: refetchPrescriptions,
} = usePrescriptions({
  enabled: screenContentAllowed('WG_PrescriptionHistory'),
})
```
- Called when screen loads with **waygate-based** enablement
- Uses local state to manage filtered/sorted prescriptions
- `screenContentAllowed` checks remote config waygate settings

#### Refill Screen (`src/screens/HealthScreen/Pharmacy/RefillScreens/RefillScreen.tsx`)
```typescript
const {
  data: prescriptionData,
  isFetching: loadingHistory,
  isFetched: prescriptionsFetched,
  error: prescriptionHasError,
  refetch: refetchPrescriptions,
} = usePrescriptions({ enabled: screenContentAllowed('WG_RefillScreenModal') })
```
- Similar waygate-based enablement
- Filters for refillable prescriptions only

### 3. Local State Management Pattern

All medication screens follow this pattern:

```typescript
const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionsList>([])

useEffect(() => {
  if (prescriptionsFetched && prescriptionData?.data) {
    setAllPrescriptions(prescriptionData.data)
  }
}, [prescriptionsFetched, prescriptionData])
```

**Important:** The local state is only updated when `prescriptionsFetched` is true AND `prescriptionData?.data` exists.

## Potential Data Loss Scenarios

### Hypothesis 1: React Query Cache Garbage Collection ⚠️ **MOST LIKELY**

**React Query v5 Default Behavior:**
- `gcTime` (garbage collection time) defaults to **5 minutes**
- When a query becomes inactive (no components observing it), it enters garbage collection
- After `gcTime` expires, the cached data is **permanently removed from cache**

**Problematic Flow:**
1. User opens Home Screen → Prescriptions data fetched and cached (t=0)
2. User navigates to Prescription History → Uses cached data (t=1 min)
3. User navigates away from all prescription screens (t=2 min)
4. Query becomes inactive - no screens observing the query
5. User returns to Prescription History after 6+ minutes (t=8 min)
6. Cache has been garbage collected (exceeded gcTime of 5 min)
7. Query needs to refetch but component state shows `prescriptionsFetched=true` with stale reference

**Why This Causes Empty List:**
```typescript
useEffect(() => {
  if (prescriptionsFetched && prescriptionData?.data) {
    setAllPrescriptions(prescriptionData.data)
  }
}, [prescriptionsFetched, prescriptionData])
```

If `prescriptionData` is undefined after cache garbage collection, but the component doesn't trigger a refetch, the local state `allPrescriptions` remains empty or stale.

### Hypothesis 2: Enabled Flag Race Condition

**Different Enablement Logic:**
- Home Screen: `enabled: isFocused`
- Prescription screens: `enabled: screenContentAllowed('WG_PrescriptionHistory')`

**Problematic Scenario:**
1. Home Screen fetches data successfully
2. User navigates to Prescription History
3. If `screenContentAllowed('WG_PrescriptionHistory')` returns `false` temporarily:
   - Query is disabled
   - No data fetch occurs
   - `prescriptionData` remains undefined
   - Local state never updates

**Waygate Configuration** (`src/utils/waygateConfig.ts`):
```typescript
export const screenContentAllowed = (waygateToggle: WaygateToggleType) => {
  const waygate = waygateEnabled(waygateToggle)
  if (!waygate.enabled && waygate.type === 'DenyContent' && 
      (waygate.errorMsgTitle || waygate.errorMsgBody)) {
    return false
  }
  return true
}
```

If waygate settings are updated remotely and cached, this could temporarily disable queries.

### Hypothesis 3: Query Key Collision with Stale Data

**Single Static Query Key:**
```typescript
queryKey: prescriptionKeys.prescriptions, // ['prescriptions']
```

**Issue:** The query key doesn't include:
- User ID
- API version (v0 vs v1)
- Authorized services state

**Problematic Scenario:**
1. User A's data cached with key `['prescriptions']`
2. User logs out, different user logs in
3. Query key is the same, stale data might be returned
4. However, React Query should handle this with `queryClient.clear()` on logout

### Hypothesis 4: useEffect Dependency Issues

**Current Pattern:**
```typescript
useEffect(() => {
  if (prescriptionsFetched && prescriptionData?.data) {
    setAllPrescriptions(prescriptionData.data)
  }
}, [prescriptionsFetched, prescriptionData])
```

**Issue:** If `prescriptionData` object reference changes but `.data` is undefined:
- The effect runs
- Condition `prescriptionData?.data` fails
- Local state never updates
- List remains empty

**Missing reset logic:** When `prescriptionData` becomes undefined (after cache GC), there's no logic to clear local state or trigger a refetch.

### Hypothesis 5: Background vs Foreground State

**React Query Background Behavior:**
- When app goes to background, queries become inactive
- When returning from background:
  - If data is still within `staleTime`, it's used as-is
  - If data is stale, a background refetch occurs
  - If data was garbage collected, query state resets

**Problematic Flow:**
1. User views prescriptions (t=0)
2. App goes to background for 10 minutes
3. Data becomes stale after 5 minutes
4. Cache is garbage collected after 5 more minutes (gcTime elapsed)
5. User returns to app, navigates to Prescription History
6. Query has no cached data, but component might not handle the loading state properly

### Hypothesis 6: Navigation State and Query Enablement

**Focus-Based Enablement in Home Screen:**
```typescript
const prescriptionsQuery = usePrescriptions({ enabled: isFocused })
```

**Scenario:**
1. Home Screen fetches data when focused
2. User navigates to deep-linked screen (not Home) on app restart
3. Home Screen never focused, query never enabled
4. No data cached
5. Prescription History tries to use non-existent cache

## React Query v5 Specific Considerations

### Default Behaviors Changed from v4:
1. `cacheTime` renamed to `gcTime`
2. Default `gcTime`: 5 minutes (was infinite in v4 with 0)
3. Default `staleTime`: 0 (was 0 in v4, but behavior differs)

### Cache Lifecycle:
```
Query Fetched → Fresh (0-300s based on staleTime) → Stale → Inactive → Garbage Collected (after gcTime)
```

## Data API Details

**Endpoint:** `/{API_VERSION}/health/rx/prescriptions`
- API_VERSION: 'v0' or 'v1' (based on `medicationsOracleHealthEnabled`)

**Parameters:**
- `page[number]`: '1'
- `page[size]`: '5000' (LARGE_PAGE_SIZE)
- `sort`: 'refill_status'

**Response Structure:**
```typescript
{
  data: PrescriptionsList,        // Array of prescriptions
  links: PrescriptionsPaginationLinks,
  meta: {
    pagination: PrescriptionsPaginationData,
    prescriptionStatusCount: PrescriptionStatusCountData,
    hasNonVaMeds: boolean
  }
}
```

## Recommendations for Investigation

### To Verify Hypothesis 1 (Cache GC - Most Likely):
1. Add explicit `gcTime: Infinity` to prescriptions query
2. Test: Navigate away from prescriptions screens for 10+ minutes, return
3. Monitor: Does empty list issue resolve?

### To Verify Hypothesis 2 (Enablement):
1. Log when `screenContentAllowed` returns false
2. Check if waygate configurations are changing
3. Verify authorized services state during navigation

### To Verify Hypothesis 4 (useEffect):
1. Add logging in useEffect to track when condition fails
2. Check if `prescriptionData` is ever undefined when `prescriptionsFetched` is true
3. Add fallback refetch logic when data is missing

### General Debugging:
1. Add React Query Devtools to visualize cache state
2. Log query state changes: `isFetching`, `isFetched`, `isStale`, `dataUpdatedAt`
3. Monitor `queryClient.getQueryData(['prescriptions'])` at key navigation points
4. Add error boundary to catch rendering errors with undefined data

## Code Locations Summary

**Query Definition:**
- `src/api/prescriptions/getPrescriptions.tsx` - usePrescriptions hook
- `src/api/prescriptions/queryKeys.ts` - Query key constants
- `src/api/queryClient.ts` - Global QueryClient configuration

**Screens Using Prescriptions:**
- `src/screens/HomeScreen/HomeScreen.tsx` - Activity button
- `src/screens/HealthScreen/Pharmacy/PrescriptionHistory/PrescriptionHistory.tsx` - Main list
- `src/screens/HealthScreen/Pharmacy/RefillScreens/RefillScreen.tsx` - Refill selection

**Configuration:**
- `src/constants/common.ts` - ACTIVITY_STALE_TIME (300000ms)
- `src/utils/waygateConfig.ts` - screenContentAllowed function

## Conclusion

The most likely cause of medication data loss is **React Query's default garbage collection behavior**. With `gcTime` defaulting to 5 minutes and no explicit configuration, cached prescription data is removed when queries become inactive for extended periods. When users return to the prescriptions list, the component's local state management pattern doesn't properly handle the missing cache scenario, resulting in an empty list display.

Secondary factors that may contribute:
- Different `enabled` conditions across screens (focus vs waygate)
- Local state not resetting when cached data is lost
- Lack of explicit refetch logic when navigating back to screens

**Primary Recommendation:** Configure an explicit `gcTime` value for prescriptions query (e.g., `gcTime: Infinity` or a much longer duration) to prevent cache garbage collection during typical user sessions.
