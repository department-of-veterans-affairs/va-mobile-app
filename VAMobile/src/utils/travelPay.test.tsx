import { waitFor } from '@testing-library/react-native'

import { TravelPayClaimData } from 'api/types'
import { renderHook } from 'testUtils'
import { FILTER_KEY_ALL, SortOption, filteredClaims, sortedClaims, useFilterToggle } from 'utils/travelPay'

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
  it('should return a filtered list of claims', () => {
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

    expect(filtered).toEqual(claims)
    expect(filtered).toHaveLength(claims.length)
  })
})

describe('sorting travel claims', () => {
  it('should sort claims by the different sort options', () => {
    let sorted = sortedClaims(claims, SortOption.Recent)
    let ids = sorted.map(({ id }) => id)
    expect(ids).toEqual(['100', '102', '101', '104', '103'])

    sorted = sortedClaims(claims, SortOption.Oldest)
    ids = sorted.map(({ id }) => id)
    expect(ids).toEqual(['103', '104', '101', '102', '100'])
  })
})

describe('useFilterToggle hook', () => {
  it('should toggle particular filter options', async () => {
    const initialFilter = new Set(['opt_a'])
    const options = new Set(['opt_a', 'opt_b', 'opt_c'])
    const { result } = renderHook(() => useFilterToggle(options, initialFilter))
    const [selectedFilter, _setSelectedFilter, toggleFilter] = result.current

    // Initial state
    expect(selectedFilter.has('opt_a')).toBe(true)
    expect(selectedFilter.size).toBe(1)

    // Remove a) and add b) and c)
    toggleFilter('opt_a')
    toggleFilter('opt_b')
    toggleFilter('opt_c')

    // Check updated state
    await waitFor(() => {
      const updatedFilter = result.current[0]
      expect(updatedFilter.has('opt_b')).toBe(true)
      expect(updatedFilter.has('opt_c')).toBe(true)
      expect(updatedFilter.size).toBe(2)
    })
  })

  it('should toggle filter options with the "all" key', async () => {
    const initialFilter = new Set([])
    const options = new Set(['opt_a', 'opt_b', 'opt_c'])
    const { result } = renderHook(() => useFilterToggle(options, initialFilter))
    const [selectedFilter, _setSelectedFilter, toggleFilter] = result.current

    // Toggle all on when nothing has been selected
    expect(selectedFilter.size).toBe(0)
    toggleFilter(FILTER_KEY_ALL)
    await waitFor(() => {
      const updatedFilter = result.current[0]
      expect(updatedFilter.has('opt_a')).toBe(true)
      expect(updatedFilter.has('opt_b')).toBe(true)
      expect(updatedFilter.has('opt_c')).toBe(true)
      expect(updatedFilter.size).toBe(3)
    })

    // Toggle all back off
    toggleFilter(FILTER_KEY_ALL)
    await waitFor(() => {
      const updatedFilter = result.current[0]
      expect(updatedFilter.size).toBe(0)
    })

    // Toggle all on when something else has already been selected
    toggleFilter('opt_a')
    await waitFor(() => {
      const updatedFilter = result.current[0]
      expect(updatedFilter.has('opt_a')).toBe(true)
      expect(updatedFilter.size).toBe(1)
    })

    toggleFilter(FILTER_KEY_ALL)
    await waitFor(() => {
      const updatedFilter = result.current[0]
      expect(updatedFilter.has('opt_a')).toBe(true)
      expect(updatedFilter.has('opt_b')).toBe(true)
      expect(updatedFilter.has('opt_c')).toBe(true)
      expect(updatedFilter.size).toBe(3)
    })
  })
})
