import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import { TravelClaimsScreenEntry } from 'constants/travelPay'
import TravelPayClaims from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsScreen'
import { context, mockNavProps, render, when } from 'testUtils'
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
        appointmentDateTime: '2025-08-07T20:54:34.828Z',
        facilityName: 'Tomah VA Medical Center',
        createdOn: '2025-08-09T20:54:34.828Z',
        modifiedOn: '2025-08-09T20:54:34.828Z',
        totalCostRequested: 50.0,
        reimbursementAmount: 20.0,
      },
    },
  ],
}

let mockUseTravelPayClaims: jest.Mock
jest.mock('api/travelPay', () => {
  mockUseTravelPayClaims = jest.fn(() => ({
    data: {
      pages: [MOCK_TRAVEL_PAY_CLAIM_RESPONSE],
    },
    isFetchingNextPage: false,
    hasNextPage: false,
    isFetching: false,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    fetchNextPage: jest.fn(),
  }))
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
    expect(screen.getByLabelText(t('travelPay.statusList.title'))).toBeTruthy()
  })

  it('shows the list of claims', async () => {
    initializeTestInstance()

    expect(screen.getByTestId('travelPayClaimsTestID')).toBeTruthy()
    expect(screen.getByTestId('travelPayClaimsListTestId')).toBeTruthy()
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
