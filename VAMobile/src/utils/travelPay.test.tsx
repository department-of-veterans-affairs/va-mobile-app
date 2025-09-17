import { TravelPayClaimData } from 'api/types'
import { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import { filteredClaims, sortedClaims } from 'utils/travelPay'

const createTestClaim = (id: string, claimStatus: string, appointmentDateTime: string) => ({
  id,
  type: 'travelPayClaimSummary',
  attributes: {
    id,
    facilityName: 'Cheyenne VA Medical Center',
    createdOn: '2025-09-16T00:00:00.000Z',
    modifiedOn: '2025-09-16T00:00:00.000Z',
    claimStatus,
    appointmentDateTime,
  },
})

const claims: Array<TravelPayClaimData> = [
  createTestClaim('100', 'In manual review', '2025-09-16T00:00:00.000Z'),
  createTestClaim('101', 'Closed', '2025-09-14T00:00:00.000Z'),
  createTestClaim('102', 'In Progress', '2025-09-15T00:00:00.000Z'),
  createTestClaim('103', 'Approved', '2025-07-12T00:00:00.000Z'),
  createTestClaim('104', 'Closed', '2025-08-05T00:00:00.000Z'),
]

describe('filtering travel claims', () => {
  it('should filter a list of claims', () => {
    const filtered = filteredClaims(claims, new Set(['Approved', 'Closed']))
    const ids = filtered.map(({ id }) => id)

    expect(ids).toContain('101')
    expect(ids).toContain('103')
    expect(ids).toContain('104')
    expect(ids).toHaveLength(3)
  })

  it('should return empty list if no filters match the list', () => {
    const filtered = filteredClaims(claims, new Set(['NonExistentStatus']))
    expect(filtered).toHaveLength(0)
  })

  it('should return all claims when the filter is empty', () => {
    const filtered = filteredClaims(claims, new Set([]))
    const ids = filtered.map(({ id }) => id)

    expect(filtered).toEqual(claims)
    expect(ids).toHaveLength(claims.length)
  })
})

describe(`sorting travel claims`, () => {
  it('should sort claims by the different sort options', () => {
    let sorted = sortedClaims(claims, SortOption.Recent)
    let ids = sorted.map(({ id }) => id)
    expect(ids).toEqual(['100', '102', '101', '104', '103'])

    sorted = sortedClaims(claims, SortOption.Oldest)
    ids = sorted.map(({ id }) => id)
    expect(ids).toEqual(['103', '104', '101', '102', '100'])
  })
})
