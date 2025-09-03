import { waitFor } from '@testing-library/react-native'

import { useTravelPayClaims } from 'api/travelPay/getClaims'
import { GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/timeframes'
import { DowntimeFeatureTypeConstants, get } from 'store/api'
import { context, renderQuery, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { getDateRangeFromTimeFrame } from 'utils/travelPay'

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

context('getClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getting travel pay claims', () => {
    it('should return the travel pay claims data from the hook', async () => {
      mockUseDowntime.mockImplementation(() => false)

      const dateRange = getDateRangeFromTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS)
      const adjustedParams = {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        page_number: 1,
      }

      when(get as jest.Mock)
        .calledWith('/v0/travel-pay/claims', adjustedParams)
        .mockResolvedValueOnce(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)

      // useTravelPayClaims will call the get claims endpoint and populate the query data
      const { result } = renderQuery(() => useTravelPayClaims(TimeFrameTypeConstants.PAST_THREE_MONTHS))
      const response = await waitFor(() => {
        expect(result.current.data).toBeDefined()
        return result.current.data
      })

      // Check the hook called the correct endpoint and received the correct response
      expect(get).toBeCalledWith('/v0/travel-pay/claims', adjustedParams)
      // With useInfiniteQuery, data is structured as pages
      expect(response?.pages?.[0]).toEqual(MOCK_GET_TRAVEL_PAY_CLAIMS_RESPONSE)
    })

    it('should not fetch data when downtime is active', async () => {
      mockUseDowntime.mockImplementation((feature) => feature === DowntimeFeatureTypeConstants.travelPayFeatures)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)

      renderQuery(() => useTravelPayClaims(TimeFrameTypeConstants.PAST_THREE_MONTHS))

      // Should not be called when Travel Pay is in downtime
      expect(get).not.toHaveBeenCalled()
    })

    it('should not fetch data when feature is disabled', async () => {
      mockUseDowntime.mockImplementation(() => false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(false)

      renderQuery(() => useTravelPayClaims(TimeFrameTypeConstants.PAST_THREE_MONTHS))

      // Should not be called when Travel Pay is in downtime
      expect(get).not.toHaveBeenCalled()
    })
  })
})
