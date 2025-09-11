import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import TravelPayClaimsFilterModal from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterModal'
import { context, render } from 'testUtils'

const mockSetCurrentFilter = jest.fn()
const mockSetCurrentSortBy = jest.fn()

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
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

context('TravelPayClaimsFilterModal', () => {
  const initialFilter = new Set('Claim submitted')
  const initialSortBy = SortOption.Recent

  beforeEach(() => {
    // Reset mock call history and implementation
    mockSetCurrentFilter.mockClear()
    mockSetCurrentSortBy.mockClear()
  })

  const initializeTestInstance = (claims = MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data) => {
    render(
      <TravelPayClaimsFilterModal
        claims={claims}
        currentFilter={initialFilter}
        setCurrentFilter={mockSetCurrentFilter}
        currentSortBy={initialSortBy}
        setCurrentSortBy={mockSetCurrentSortBy}
      />,
    )
  }

  it('renders the button to show the modal', () => {
    initializeTestInstance()

    expect(screen.getByTestId('travelClaimsFilterModalButtonTestId')).toBeTruthy()
  })

  it('renders modal elements as well as the correct filter and sort options', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))

    await waitFor(() => {
      expect(screen.getByText(t('travelPay.statusList.sortBy'))).toBeTruthy()

      expect(screen.getByTestId('filterButtonApplyTestID')).toBeTruthy()
      expect(screen.getByTestId('filterButtonCancelTestID')).toBeTruthy()
      expect(screen.getByTestId('filterAndSortModalTitle')).toBeTruthy()

      expect(screen.getByTestId('checkbox_all')).toBeTruthy()
      expect(screen.getByTestId('checkbox_Claim submitted')).toBeTruthy()
      expect(screen.getByTestId('checkbox_Saved')).toBeTruthy()

      expect(screen.getByText(t('travelPay.statusList.sortOption.recent'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.statusList.sortOption.oldest'))).toBeTruthy()
    })
  })

  it('renders a single filter option per claim status ', async () => {
    // Duplicate one of the claims and then verify it doesn't result in a duplicate filter option entry
    const claims = [...MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data, { ...MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data[0] }]
    initializeTestInstance(claims)
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))

    await waitFor(() => expect(screen.getAllByTestId('checkbox_Claim submitted')).toHaveLength(1))
  })

  it('applies the filter and sort when the apply button is pressed', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))

    await waitFor(() => expect(screen.getByTestId('filterButtonApplyTestID')).toBeTruthy())
    fireEvent.press(screen.getByTestId('filterButtonApplyTestID'))

    expect(mockSetCurrentFilter).toHaveBeenCalled()
    expect(mockSetCurrentSortBy).toHaveBeenCalled()
  })

  it('hides the modal when cancel is pressed', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))
    expect(screen.getByTestId('claimsFilterModal')).toBeTruthy()

    fireEvent.press(screen.getByTestId('filterButtonCancelTestID'))
    await waitFor(() => expect(screen.queryByTestId('claimsFilterModal')).toBeNull())
  })
})
