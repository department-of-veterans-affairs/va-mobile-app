import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import { TimeFrameType } from 'constants/timeframes'
import { TravelClaimsScreenEntry } from 'constants/travelPay'
import TravelPayClaims from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsScreen'
import { context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

// Mock screen reader hook to prevent act() warning within
// VAModalPicker that aren't affecting these tests
jest.mock('@department-of-veterans-affairs/mobile-component-library/src/utils/hooks/useIsScreenReaderEnabled', () => ({
  useIsScreenReaderEnabled: () => false,
}))

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

let mockGetDateRangeFromTimeFrame: jest.Mock
jest.mock('utils/dateUtils', () => {
  mockGetDateRangeFromTimeFrame = jest.fn((timeFrame) => {
    // Fixed dates, just enough for the test
    return timeFrame === 'pastThreeMonths'
      ? { startDate: '2025-07-25', endDate: '2025-09-25' }
      : { startDate: '2024-01-01', endDate: '2024-12-31' }
  })

  const original = jest.requireActual('utils/dateUtils')
  return {
    ...original,
    getDateRangeFromTimeFrame: mockGetDateRangeFromTimeFrame,
  }
})

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

const MOCK_TRAVEL_PAY_CLAIM_RESPONSE: GetTravelPayClaimsResponse = {
  meta: {
    status: 200,
    pageNumber: 1,
    totalRecordCount: 3,
  },
  data: [
    {
      id: 'f33ef640-000f-4ecf-82b8-1c50df13d178',
      type: 'travelPayClaimSummary',
      attributes: {
        id: 'f33ef640-000f-4ecf-82b8-1c50df13d178',
        claimNumber: 'c68baadf-3d95-45d5-857b-eca5bef6d4a5',
        claimStatus: 'Claim submitted',
        appointmentDateTime: '2025-08-10T20:54:34.828Z',
        facilityName: 'Cheyenne VA Medical Center',
        createdOn: '2025-08-11T20:54:34.828Z',
        modifiedOn: '2025-08-11T20:54:34.828Z',
        totalCostRequested: 50.0,
        reimbursementAmount: 50.0,
      },
    },
    {
      id: '352b37f2-3566-4642-98b2-6a2bc0e63757',
      type: 'travelPayClaimSummary',
      attributes: {
        id: '352b37f2-3566-4642-98b2-6a2bc0e63757',
        claimNumber: '93b5fff2-a71d-4b97-9e98-3298ae0564db',
        claimStatus: 'Saved',
        appointmentDateTime: '2025-08-09T20:54:34.828Z',
        facilityName: 'Tomah VA Medical Center',
        createdOn: '2025-08-10T20:54:34.828Z',
        modifiedOn: '2025-08-10T20:54:34.828Z',
        totalCostRequested: 50.0,
        reimbursementAmount: 25.0,
      },
    },
    {
      id: '16cbc3d0-56de-4d86-abf3-ed0f6908ee53',
      type: 'travelPayClaimSummary',
      attributes: {
        id: '16cbc3d0-56de-4d86-abf3-ed0f6908ee53',
        claimNumber: '5b550fe7-6985-4a69-953a-472d5cf85921',
        claimStatus: 'In process',
        appointmentDateTime: '2024-08-07T20:54:34.828Z',
        facilityName: 'Tomah VA Medical Center',
        createdOn: '2024-08-09T20:54:34.828Z',
        modifiedOn: '2024-08-09T20:54:34.828Z',
        totalCostRequested: 50.0,
        reimbursementAmount: 20.0,
      },
    },
  ],
}

let mockUseTravelPayClaims: jest.Mock
jest.mock('api/travelPay', () => {
  mockUseTravelPayClaims = jest.fn((timeFrame: TimeFrameType) => {
    const claims = MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data
    const claimsForTimeFrame = timeFrame === 'pastThreeMonths' ? [claims[0], claims[1]] : [claims[2]]
    const adjustedResponse = {
      ...MOCK_TRAVEL_PAY_CLAIM_RESPONSE,
      data: claimsForTimeFrame,
    }
    return {
      data: {
        pages: [adjustedResponse],
      },
      isFetchingNextPage: false,
      hasNextPage: false,
      isFetching: false,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    }
  })

  return {
    useTravelPayClaims: mockUseTravelPayClaims,
  }
})

context('TravelPayClaims', () => {
  const initializeTestInstance = (routeMock?: { from: string }) => {
    render(
      <TravelPayClaims
        {...mockNavProps(
          {},
          {
            setOptions: jest.fn(),
            navigate: jest.fn(),
            addListener: jest.fn(),
            goBack: jest.fn(),
          },
          { params: routeMock },
        )}
      />,
    )

    mockUseDowntime.mockImplementation(() => false)

    when(featureEnabled as jest.Mock)
      .calledWith('travelPayStatusList')
      .mockReturnValue(true)
  }

  it('should show travel claims header', () => {
    initializeTestInstance()
    expect(screen.getByLabelText(t('travelPay.title'))).toBeTruthy()
  })

  it('should show the date range picker and filter', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.statusList.selectADateRange'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.statusList.filterAndSort'))).toBeTruthy()
  })

  it('shows the list of claims', async () => {
    initializeTestInstance()

    expect(
      screen.getByText(
        t('travelPay.statusList.list.title', {
          count: 2, // Default time frame excludes the last one
          filter: 'All',
          sort: t(`travelPay.statusList.sortOption.recent`).toLowerCase(),
        }),
      ),
    ).toBeTruthy()

    expect(screen.getByTestId('travelPayClaimsTestID')).toBeTruthy()
    expect(screen.getByTestId('travelPayClaimsListTestId')).toBeTruthy()
  })

  it('should apply the selected date range to the list of claims', () => {
    initializeTestInstance()

    // Defaults to past 3 months, so the last one shouldn't be there
    expect(screen.getByTestId('claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178')).toBeTruthy()
    expect(screen.getByTestId('claim_summary_352b37f2-3566-4642-98b2-6a2bc0e63757')).toBeTruthy()
    expect(screen.queryByTestId('claim_summary_16cbc3d0-56de-4d86-abf3-ed0f6908ee53')).toBeFalsy()

    // Bring up the date picker and select the last year option
    fireEvent.press(screen.getByTestId('getDateRangeTestID'))
    fireEvent.press(screen.getByTestId('pastAllLastYearTestID'))
    fireEvent.press(screen.getByTestId('confirmDateRangeTestId'))

    // Check the claim list is accurate for the date selection
    expect(screen.queryByTestId('claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178')).toBeFalsy()
    expect(screen.queryByTestId('claim_summary_352b37f2-3566-4642-98b2-6a2bc0e63757')).toBeFalsy()
    expect(screen.getByTestId('claim_summary_16cbc3d0-56de-4d86-abf3-ed0f6908ee53')).toBeTruthy()
  })

  it('should show the loading component', async () => {
    mockUseTravelPayClaims.mockImplementation(() => ({
      data: {
        pages: [],
      },
      isFetchingNextPage: false,
      hasNextPage: false,
      isFetching: false,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    }))
    initializeTestInstance()

    expect(screen.getByText(t('travelPay.statusList.loading'))).toBeTruthy()
    expect(screen.queryByTestId('travelPayClaimsListTestId')).toBeNull()
    expect(screen.queryByText(t('travelPay.statusList.selectADateRange'))).toBeNull()
    expect(screen.queryByText(t('travelPay.statusList.filterAndSort'))).toBeNull()
  })
  
  describe('different entry points', () => {
    it('shows the correct go back title when coming from claims', () => {
      initializeTestInstance({ from: TravelClaimsScreenEntry.Claims })
      expect(screen.getByText(t('claims.title'))).toBeTruthy()
    })

    it('shows the correct go back title when coming from health', () => {
      initializeTestInstance({ from: TravelClaimsScreenEntry.Health })
      expect(screen.getByText(t('health.title'))).toBeTruthy()
    })

    it('shows the correct go back title when coming from payments', () => {
      initializeTestInstance({ from: TravelClaimsScreenEntry.Payments })
      expect(screen.getByText(t('payments.title'))).toBeTruthy()
    })

    it('shows the correct go back title when coming from appointment detail', () => {
      initializeTestInstance({ from: TravelClaimsScreenEntry.AppointmentDetail })
      expect(screen.getByText(t('appointments.appointment'))).toBeTruthy()
    })
  })

  describe('when an api error occurs', () => {
    it('should show the error screen', async () => {
      mockUseTravelPayClaims.mockImplementation(() => ({
        data: {
          pages: [],
        },
        isFetchingNextPage: false,
        hasNextPage: false,
        isFetching: false,
        isLoading: false,
        error: new Error('test error'),
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
      }))
      initializeTestInstance()

      expect(screen.getByText(t(`errors.callHelpCenter.vaAppNotWorking`))).toBeTruthy()
      expect(screen.getByText(t(`errors.callHelpCenter.sorry`))).toBeTruthy()
      expect(screen.getByText(t(`errors.callHelpCenter.informationLine`))).toBeTruthy()
      expect(screen.getByTestId('CallVATestID')).toBeTruthy()
    })
  })
})
