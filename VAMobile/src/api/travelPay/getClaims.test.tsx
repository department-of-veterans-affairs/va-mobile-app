import React from 'react'

import { waitFor } from '@testing-library/react-native'

import { useTravelPayClaims } from 'api/travelPay/getClaims'
import { travelPayKeys } from 'api/travelPay/queryKeys'
import { GetTravelPayClaimsResponse } from 'api/types'
import { get } from 'store/api'
import { context, render, when } from 'testUtils'

const mockDispatchSpy = jest.fn()

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigation: () => ({
      dispatch: mockDispatchSpy,
    }),
  }
})

const MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE: GetTravelPayClaimsResponse = {
  metadata: {
    totalRecordCount: 1,
    pageNumber: 1,
    status: 200,
  },
  data: [
    {
      id: 'claim-id',
      type: 'TravelPayClaimSummary',
      attributes: {
        id: 'claim-id',
        claimNumber: '123456',
        claimStatus: 'In Progress',
        appointmentDateTime: '2023-02-23T22:22:52.549Z',
        facilityId: '442',
        facilityName: 'Tomah VA Medical Center',
        totalCostRequested: 10.26,
        createdOn: '2023-02-24T22:22:52.549Z',
        modifiedOn: '2023-02-26T22:22:52.549Z',
      },
    },
  ],
}

const TestComponent = () => {
  useTravelPayClaims({
    startDate: '2021-01-01',
    endDate: '2021-12-31',
    page: 1,
  })
  return <> </>
}

context('getClaims', () => {
  describe('getting travel pay claims', () => {
    it('should return the travel pay claims data', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/travel-pay/claims')
        .mockResolvedValueOnce(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)

      const { queryClient } = render(<TestComponent />)

      await waitFor(() => {
        const data = queryClient.getQueryData([travelPayKeys.claims]) as GetTravelPayClaimsResponse
        expect(data).toBeDefined()
      })

      // queryClient.setQueryData(travelPayKeys.claims, MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE);
      expect(get).toBeCalledWith('/v0/travel-pay/claims')
    })
  })
})
