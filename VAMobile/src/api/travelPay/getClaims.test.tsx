import React from 'react'

import { NavigationContainer } from '@react-navigation/native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'

import { useTravelPayClaims } from 'api/travelPay/getClaims'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { DowntimeFeatureTypeConstants, get } from 'store/api'
import { context, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

jest.mock('store/api', () => {
  const original = jest.requireActual('store/api')
  return {
    ...original,
    get: jest.fn(),
  }
})

let mockUseDowntime: jest.Mock
jest.mock('utils/hooks', () => {
  mockUseDowntime = jest.fn(() => false)
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useDowntime: mockUseDowntime,
  }
})

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

const MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE: GetTravelPayClaimsResponse = {
  meta: {
    totalRecordCount: 1,
    pageNumber: 1,
    status: 200,
  },
  data: [
    {
      id: 'claim-id',
      type: 'travelPayClaimSummary',
      attributes: {
        id: 'claim-id',
        claimNumber: '123456',
        claimStatus: 'In Progress',
        appointmentDateTime: '2023-02-23T22:22:52.549Z',
        facilityId: '442',
        facilityName: 'Tomah VA Medical Center',
        totalCostRequested: 10.5,
        reimbursementAmount: 5.25,
        createdOn: '2023-02-24T22:22:52.549Z',
        modifiedOn: '2023-02-26T22:22:52.549Z',
      },
    },
  ],
}

const params: GetTravelPayClaimsParams = {
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  page: 1,
}

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer initialState={{ routes: [] }}>{children}</NavigationContainer>
    </QueryClientProvider>
  )
}

context('getClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getting travel pay claims', () => {
    it('should return the travel pay claims data from the hook', async () => {
      mockUseDowntime.mockImplementation(() => false)

      when(get as jest.Mock)
        .calledWith('/v0/travel-pay/claims', params)
        .mockResolvedValueOnce(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      // useTravelPayClaims will call the get claims endpoint and populate the query data
      const { result } = renderHook(() => useTravelPayClaims(params), { wrapper })
      const response = await waitFor(() => {
        expect(result.current.data).toBeDefined()
        return result.current.data
      })

      // Check the hook called the correct endpoint and received the correct response
      expect(get).toBeCalledWith('/v0/travel-pay/claims', params)
      expect(response).toEqual(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)
    })

    it('should not fetch data when downtime is active', async () => {
      mockUseDowntime.mockImplementation((feature) => feature === DowntimeFeatureTypeConstants.travelPayFeatures)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      renderHook(() => useTravelPayClaims(params), { wrapper })

      // Should not be called when Travel Pay is in downtime
      expect(get).not.toHaveBeenCalled()
    })

    it('should not fetch data when feature is disabled', async () => {
      mockUseDowntime.mockImplementation(() => false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(false)

      renderHook(() => useTravelPayClaims(params), { wrapper })

      // Should not be called when Travel Pay is in downtime
      expect(get).not.toHaveBeenCalled()
    })
  })
})
