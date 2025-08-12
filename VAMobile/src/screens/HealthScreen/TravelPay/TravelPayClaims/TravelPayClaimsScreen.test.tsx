import React from 'react'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimsResponse } from 'api/types'
import TravelPayClaims from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsScreen'
import { get } from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'
import { capitalizeFirstLetter } from 'utils/formattingUtils'
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

const getClaimStatusText = (index: number) => {
  // Look up claim status text for the mock data at the index
  const claimStatus = MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data[index].attributes.claimStatus
  return t('travelPay.statusList.claimStatus', { status: capitalizeFirstLetter(claimStatus) })
}

context('TravelPayClaims', () => {
  const initializeTestInstance = () => {
    render(<TravelPayClaims {...mockNavProps()} />)

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
    when(get as jest.Mock)
      .calledWith('/v0/travel-pay/claims', expect.anything())
      .mockResolvedValueOnce(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)

    initializeTestInstance()

    await waitFor(() => expect(screen.getByTestId('travelPayClaimsListTestId')).toBeTruthy())

    // Should contain 3 entries in the list - identified by claim status
    expect(screen.getAllByText(t('travelPay.statusList.claimStatus', { status: '' }), { exact: false })).toHaveLength(3)
    expect(screen.getByText(getClaimStatusText(0))).toBeTruthy()
    expect(screen.getByText(getClaimStatusText(1))).toBeTruthy()
    expect(screen.getByText(getClaimStatusText(2))).toBeTruthy()
  })
})
