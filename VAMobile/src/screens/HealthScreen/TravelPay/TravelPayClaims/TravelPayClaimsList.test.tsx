import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import TravelPayClaimsList, {
  CLAIMS_PER_PAGE,
} from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { context, render } from 'testUtils'

const mockSetPage = jest.fn()

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

context('TravelPayClaimsList', () => {
  it('renders the list of claims', () => {
    render(
      <TravelPayClaimsList
        claims={MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data}
        isLoading={false}
        scrollViewRef={React.createRef<ScrollView>()}
        currentPage={1}
        setPage={mockSetPage}
      />,
    )

    expect(screen.getByTestId('claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178')).toBeTruthy()
    expect(screen.getByTestId('claim_summary_352b37f2-3566-4642-98b2-6a2bc0e63757')).toBeTruthy()
    expect(screen.getByTestId('claim_summary_16cbc3d0-56de-4d86-abf3-ed0f6908ee53')).toBeTruthy()
    expect(screen.queryByTestId(t('travelPay.statusList.loading'))).toBeFalsy()
  })

  it('renders the loading indicator', () => {
    render(
      <TravelPayClaimsList
        claims={MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data}
        isLoading={true}
        scrollViewRef={React.createRef<ScrollView>()}
        currentPage={1}
        setPage={mockSetPage}
      />,
    )

    expect(screen.getByText(t('travelPay.statusList.loading'))).toBeTruthy()
    expect(screen.queryByTestId('claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178')).toBeFalsy()
  })

  it('renders the pagination widget if there are enough items', async () => {
    // Duplicate claims to make the list large enough to show the pagination widgets
    const claims = MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data
    const duplicateAmount = CLAIMS_PER_PAGE + 1 - claims.length // 1 more than allowed on a page
    const duplicatedClaims = [
      ...MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data,
      ...Array(duplicateAmount)
        .fill(null)
        .map(() => ({ ...claims[0] })),
    ]

    render(
      <TravelPayClaimsList
        claims={duplicatedClaims}
        isLoading={false}
        scrollViewRef={React.createRef<ScrollView>()}
        setPage={mockSetPage}
        currentPage={1}
      />,
    )
    expect(screen.getByTestId('previous-page')).toBeTruthy()
    expect(screen.getByTestId('next-page')).toBeTruthy()

    fireEvent.press(screen.getByTestId('next-page'))
    expect(mockSetPage).toHaveBeenCalledTimes(1)
  })
})
