import React from 'react'

import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import TravelPayClaimsList from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsList'
import { fireEvent, screen } from 'testUtils'
import { render } from 'testUtils'
import getEnv from 'utils/env'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

let mockLogAnalyticsEvent: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogAnalyticsEvent = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logAnalyticsEvent: mockLogAnalyticsEvent,
  }
})

let mockNavigateTo: jest.Mock
jest.mock('utils/hooks', () => {
  mockNavigateTo = jest.fn()
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigateTo,
  }
})

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

const buildManyClaims = (count: number): GetTravelPayClaimsResponse => {
  const baseDate = new Date('2025-08-01T12:00:00.000Z').getTime()
  const data = Array.from({ length: count }).map((_, i) => {
    const id = `${i + 1}`.padStart(4, '0')
    return {
      id: id,
      type: 'travelPayClaimSummary' as const,
      attributes: {
        id: id,
        claimNumber: `claim-${id}`,
        claimStatus: 'Saved',
        appointmentDateTime: new Date(baseDate + i * 86400000).toISOString(),
        facilityName: 'Facility',
        createdOn: new Date(baseDate + (i + 1) * 86400000).toISOString(),
        modifiedOn: new Date(baseDate + (i + 1) * 86400000).toISOString(),
        totalCostRequested: 10,
        reimbursementAmount: 5,
      },
    }
  })
  return {
    meta: {
      status: 200,
      pageNumber: 1,
      totalRecordCount: count,
    },
    data,
  }
}

describe('TravelPayClaimsList', () => {
  const initialize = (props?: Partial<React.ComponentProps<typeof TravelPayClaimsList>>) => {
    const defaultProps: React.ComponentProps<typeof TravelPayClaimsList> = {
      claims: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data,
      totalRecordCount: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.meta.totalRecordCount,
      isLoading: false,
      setTimeFrame: jest.fn(),
      onNext: jest.fn(),
      onPrev: jest.fn(),
    }
    return render(<TravelPayClaimsList {...defaultProps} {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders list and items', () => {
    initialize()
    expect(screen.getByTestId('travelPayClaimsListTestId')).toBeTruthy()
    // Items are rendered with deterministic testIDs
    expect(screen.getByTestId('claim_summary_f33ef640-000f-4ecf-82b8-1c50df13d178')).toBeTruthy()
    expect(screen.getByTestId('claim_summary_352b37f2-3566-4642-98b2-6a2bc0e63757')).toBeTruthy()
    expect(screen.getByTestId('claim_summary_16cbc3d0-56de-4d86-abf3-ed0f6908ee53')).toBeTruthy()
    // Results text shows 1 - 3 of (3)
    expect(screen.getByText(/Showing 1 - 3 of \(3\) claims/)).toBeTruthy()
  })

  it('shows loading state', () => {
    initialize({ isLoading: true })
    expect(screen.getByText(t('travelPay.statusList.loading'))).toBeTruthy()
  })

  it('does not render pagination when total <= page size', () => {
    initialize()
    expect(screen.queryByTestId('next-page')).toBeNull()
    expect(screen.queryByTestId('previous-page')).toBeNull()
  })

  it('renders pagination and navigates pages, calling callbacks', () => {
    const many = buildManyClaims(12)
    const onNext = jest.fn()
    const onPrev = jest.fn()
    initialize({ claims: many.data, totalRecordCount: many.meta.totalRecordCount, onNext, onPrev })

    // Pagination should be visible (12 > 10)
    expect(screen.getByTestId('next-page')).toBeTruthy()
    expect(screen.getByText(/Showing 1 - 10 of \(12\) claims/)).toBeTruthy()

    fireEvent.press(screen.getByTestId('next-page'))
    expect(onNext).toHaveBeenCalledWith(2)
    expect(screen.getByText(/Showing 11 - 12 of \(12\) claims/)).toBeTruthy()

    fireEvent.press(screen.getByTestId('previous-page'))
    expect(onPrev).toHaveBeenCalledWith(1)
    expect(screen.getByText(/Showing 1 - 10 of \(12\) claims/)).toBeTruthy()
  })

  it('navigates to Webview and logs analytics when an item is pressed', () => {
    initialize()
    const firstId = MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data[0].id
    fireEvent.press(screen.getByTestId(`claim_summary_${firstId}`))

    expect(mockLogAnalyticsEvent).toHaveBeenCalled()
    expect(mockNavigateTo).toHaveBeenCalledWith(
      'Webview',
      expect.objectContaining({
        url: `${LINK_URL_TRAVEL_PAY_WEB_DETAILS}${firstId}`,
        displayTitle: t('travelPay.webview.claims.displayTitle'),
        loadingMessage: t('travelPay.webview.claims.loading'),
        useSSO: true,
        backButtonTestID: 'webviewBack',
      }),
    )
  })
})
