import React from 'react'

import { waitFor } from '@testing-library/react-native'

import { useTravelPayClaims } from 'api/travelPay/getClaims'
import { travelPayKeys } from 'api/travelPay/queryKeys'
import { GetTravelPayClaimsParams, GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/timeframes'
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

const params: GetTravelPayClaimsParams = {
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  page: 1,
}

const TestComponent = () => {
  useTravelPayClaims(params)
  return <> </>
}

context('getClaims', () => {
  describe('getting travel pay claims', () => {
    it('should return the travel pay claims data', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/travel-pay/claims', params)
        .mockResolvedValueOnce(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)

      const { queryClient } = render(<TestComponent />)

      const response = await waitFor(() => {
        const data = queryClient.getQueryData([
          travelPayKeys.claims,
          TimeFrameTypeConstants.PAST_THREE_MONTHS,
        ]) as GetTravelPayClaimsResponse

        expect(data).toBeDefined()
        return data
      })

      expect(get).toBeCalledWith(`/v0/travel-pay/claims`, params)
      expect(response).toEqual(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)
    })
  })
})
