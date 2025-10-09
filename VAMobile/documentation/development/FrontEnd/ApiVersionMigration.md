# API Version Migration Guide

This comprehensive guide outlines the steps and best practices for migrating from V0 to V1 APIs in the VA Mobile App codebase, using the Prescriptions API migration as a reference implementation.

## Table of Contents

1. [Goals](#goals)
2. [Type System Organization](#type-system-organization)
3. [Migration Strategy](#migration-strategy)
4. [Implementation Steps](#implementation-steps)
5. [Real-World Examples](#real-world-examples)
6. [Testing Approach](#testing-approach)
7. [Rollout Process](#rollout-process)
8. [Cleanup Process](#cleanup-process)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Goals

1. **Seamless Migration**: Migrate API endpoints from legacy versions (v0) to new versions (v1+) without breaking existing functionality
2. **Backward Compatibility**: Ensure existing code continues to work during the transition period
3. **Minimal Client Changes**: Reduce the impact on client-side code through smart type design
4. **Feature Toggle Control**: Support gradual rollout using feature flags and user-based controls
5. **Type Safety**: Maintain strong TypeScript typing throughout the migration

## Type System Organization

### Versioned Type Structure

Types are organized with clear version prefixes to separate API versions:

```typescript
// V0 Types (Legacy)
export type PrescriptionTrackingItemV0 = {
  // ... V0 specific fields
  deliveryService?: string  // V0 uses deliveryService
}

// V1 Types (New)
export type PrescriptionTrackingItemV1 = {
  // ... V1 specific fields  
  carrier?: string  // V1 uses carrier instead
}

// Union Types for Compatibility
export type PrescriptionTrackingItem = PrescriptionTrackingItemV0 | PrescriptionTrackingItemV1

// Backward Compatibility Aliases
export type PrescriptionRefillAttributeData = PrescriptionRefillAttributeDataV0 | PrescriptionRefillAttributeDataV1
```

### Key Differences Between Versions

| Aspect                | V0                        | V1                                             |
| --------------------- | ------------------------- | ---------------------------------------------- |
| **Failed IDs**        | `string[]`                | `{ id: string; stationNumber: string }[]`      |
| **Delivery Service**  | `deliveryService: string` | `carrier: string`                              |
| **Request Format**    | `{ ids: string[] }`       | `Array<{ id: string; stationNumber: string }>` |
| **Additional Fields** | Basic structure           | Enhanced with Oracle Health data               |

## Migration Strategy

### 1. Feature Flag Control

```typescript
const shouldUseV1 = medicationsOracleHealthEnabled && oracleMedsEnabled
```

### 2. API Switching Logic

```typescript
const requestRefills = async (prescriptions: PrescriptionsList, useV1: boolean = false) => {
  const API_VERSION = useV1 ? 'v1' : 'v0'
  let requestBody: { ids: string[] } | Array<SingleRefillRequest>

  if (useV1) {
    // V1 format: Array of objects
    requestBody = prescriptions.map((prescription) => ({
      id: prescription.id,
      stationNumber: prescription.attributes.stationNumber,
    }))
  } else {
    // V0 format: Object with array of IDs
    requestBody = {
      ids: prescriptions.map((prescription) => prescription.id),
    }
  }
  
  return await put(`/${API_VERSION}/health/rx/prescriptions/refill`, requestBody)
}
```

### 3. Union Type Handling

```typescript
// Handle union types with type guards
const attributes = prescriptionTrackingInfo?.attributes
const deliveryService = 'deliveryService' in attributes ? attributes.deliveryService : undefined
const carrier = 'carrier' in attributes ? attributes.carrier : undefined
const deliveryServiceFinal = deliveryService || carrier || ''
```

## Implementation Steps

### Step 1: Define Versioned Types

1. Create V0 and V1 specific types with clear naming
2. Create union types for components that need to handle both
3. Add backward compatibility aliases
4. Update imports gradually

### Step 2: Update API Layer

1. Add version detection logic
2. Implement request/response transformations
3. Handle different payload formats
4. Add proper error handling for both versions

### Step 3: Update Components

1. Use type guards for union type properties
2. Update destructuring to handle version differences
3. Test with both API versions
4. Ensure UI works with both data formats

### Step 4: Add Comprehensive Tests

1. Test both V0 and V1 scenarios
2. Test feature flag switching
3. Test error handling for both versions
4. Test union type edge cases

## Real-World Examples

### Example 1: Handling Union Types in Components

**Before (Breaking):**

```typescript
const { trackingNumber, deliveryService, carrier } = 
  prescriptionTrackingInfo?.attributes || ({} as PrescriptionTrackingItem)
```

**After (Working):**

```typescript
const { trackingNumber, shippedDate, otherPrescriptions } =
  prescriptionTrackingInfo?.attributes || ({} as PrescriptionTrackingItem)

const attributes = prescriptionTrackingInfo?.attributes
const deliveryService = 'deliveryService' in attributes ? attributes.deliveryService : undefined
const carrier = 'carrier' in attributes ? attributes.carrier : undefined
const deliveryServiceFinal = deliveryService || carrier || ''
```

### Example 2: API Request Transformation

```typescript
const failedPrescriptionIds = response?.data.attributes.failedPrescriptionIds.map((failed) => {
  if (useV1 && typeof failed === 'object' && failed !== null && 'id' in failed) {
    return (failed as { id: string }).id
  } else {
    return failed as string
  }
}) || []
```

### Example 3: Test Cases for Both Versions

```typescript
it('should handle v0 API failedPrescriptionIds as strings', async () => {
  const responseWithStringIds: PrescriptionRefillData = {
    data: {
      attributes: {
        failedPrescriptionIds: ['456'], // V0 format
        // ... other fields
      },
    },
  }
  // Test V0 behavior
})

it('should handle v1 API failedPrescriptionIds as objects', async () => {
  const responseWithObjectIds: PrescriptionRefillData = {
    data: {
      attributes: {
        failedPrescriptionIds: [{ id: '456', stationNumber: '456' }], // V1 format
        // ... other fields
      },
    },
  }
  // Test V1 behavior
})
```

## Testing Approach

### Unit Tests

- ✅ Test both V0 and V1 API responses
- ✅ Test feature flag switching logic
- ✅ Test union type handling
- ✅ Test error scenarios for both versions
- ✅ Test backward compatibility

### Integration Tests

- Test end-to-end workflows with both versions as needed
- Test demo mode with both API formats
- Verify UI consistency across versions

### Manual Testing

- Test with feature flags enabled/disabled
- Verify graceful fallbacks
- Test error handling in production-like scenarios

## Rollout Process

### Phase 1: Development & Internal Testing

```typescript
// Initially disabled for all users
const { medicationsOracleHealthEnabled = false } = authorizedServices || {}
const { enabled: oracleMedsEnabled } = waygateEnabled('WG_MedsOracleHealthApiEnabled')
```

### Phase 2: Gradual Rollout

- Enable for internal users via flipper
- Monitor metrics and error rates
- Gradual percentage rollout

### Phase 3: Full Deployment

- Enable waygate for all version past X
- Set flipper toggle at 100%
- Monitor for issues

## Cleanup Process

### Phase 1: Remove Feature Flags

```typescript
// Remove conditional logic
const shouldUseV1 = true // Always use V1

// Or remove the logic entirely and always call V1
```

### Phase 2: Type Cleanup

```typescript
// Remove V0 types and use V1 types directly
export type PrescriptionTrackingItem = PrescriptionTrackingItemV1
// Remove: export type PrescriptionTrackingItemV0
```

### Phase 3: Remove Legacy Code

- Remove V0 API calls
- Remove compatibility type aliases
- Update documentation
- Remove demo/mock V0 data

## Troubleshooting

### Common Issues

1. **Union Type Property Access**
   - **Problem**: `Property 'deliveryService' does not exist on type 'PrescriptionTrackingItem'`
   - **Solution**: Use type guards: `'deliveryService' in attributes`

2. **Type Import Errors**
   - **Problem**: `'PrescriptionTrackingInfoAttributeData' has no exported member`
   - **Solution**: Update imports to use versioned types or aliases

3. **Demo Mode Errors**
   - **Problem**: Mock data doesn't match V1 format
   - **Solution**: Update demo store to return appropriate format based on endpoint

4. **Test Failures**
   - **Problem**: Tests expecting V0 format but getting V1
   - **Solution**: Update test mocks to include required fields for both versions

### Debugging Tips

1. **Check Feature Flags**: Ensure waygate and auth service flags are set correctly
2. **Verify Type Definitions**: Check that union types include all necessary properties
3. **Test Both Paths**: Always test both V0 and V1 code paths
4. **Monitor Network**: Verify correct API version is being called

## Best Practices

### Type Design

- ✅ Use descriptive version suffixes (V0, V1)
- ✅ Create union types for gradual migration
- ✅ Provide backward compatibility aliases
- ✅ Document differences between versions

### Code Organization

- ✅ Keep version-specific logic centralized
- ✅ Use feature flags for runtime switching
- ✅ Maintain clear separation between API versions
- ✅ Document migration decisions

### Testing Strategy

- ✅ Test all version combinations
- ✅ Include edge cases and error scenarios
- ✅ Test feature flag behavior
- ✅ Verify backward compatibility

### Rollout Planning

- ✅ Plan gradual rollout with monitoring
- ✅ Have rollback procedures ready
- ✅ Monitor key metrics during migration
- ✅ Communicate changes to team

## References

- **Type Definitions**: `src/api/types/PrescriptionData.ts`
- **API Implementation**: `src/api/prescriptions/requestRefills.tsx`
- **Test Examples**: `src/api/prescriptions/requestRefills.test.tsx`
- **Demo Logic**: `src/store/api/demo/store.ts`
- **Component Usage**: `src/screens/HealthScreen/Pharmacy/RefillTrackingDetails/RefillTrackingDetails.tsx`

---

*For questions or suggestions, please reach out to the API migration team or create an issue in the repository.*
