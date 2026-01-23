import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimEventData } from 'api/types'
import File5103ReviewWaiver from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103ReviewWaiver/File5103ReviewWaiver'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

const request5103 = {
  type: 'still_need_from_you_list',
  trackedItemId: 651827,
  description: 'Automated 5103 Notice Response',
  displayName: 'Automated 5103 Notice Response',
  overdue: false,
  status: 'NEEDED',
  uploaded: false,
  uploadsAllowed: true,
  openedDate: '2025-11-24',
  requestedDate: '2025-11-24',
  receivedDate: null,
  closedDate: null,
  suspenseDate: '2025-12-24',
  documents: [],
  uploadDate: null,
  date: '2025-11-24',
  documentType: null,
  filename: null,
}

const claimID = 'claimID'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('File5103ReviewWaiver', () => {
  const renderWithRequest = (requests: ClaimEventData[]) => {
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, claimID],
        data: {
          ...Claim,
          attributes: {
            ...Claim.attributes,
            waiverSubmitted: false,
            eventsTimeline: requests,
          },
        },
      },
    ]

    when(api.get as jest.Mock)
      .calledWith(`/v0/claim/${claimID}`, {})
      .mockResolvedValue({
        data: {
          ...Claim,
          id: claimID,
          attributes: {
            ...Claim.attributes,
            waiverSubmitted: false,
            eventsTimeline: [request5103],
          },
        },
      })

    const props = mockNavProps(undefined, undefined, { params: { claimID } })
    render(<File5103ReviewWaiver {...props} />, { queriesData })
  }

  it('should render the correct content', async () => {
    renderWithRequest([request5103])
    expect(screen.findByText(t('claimDetails.5103.review.waiver'))).toBeTruthy()
    expect(screen.findByText(t('claimDetails.5103.review.waiver.body1'))).toBeTruthy()
    expect(screen.findByText(t('claimDetails.5103.review.waiver.confirmation'))).toBeTruthy()
    expect(screen.findByRole('button', { name: t('claimDetails.5103.submit.waiver') })).toBeTruthy()
  })

  it('should display an error if checkbox is not marked', async () => {
    renderWithRequest([request5103])
    await waitFor(() => expect(screen.getByText(t('claimDetails.5103.submit.waiver'))).toBeTruthy())
    fireEvent.press(screen.getByText(t('claimDetails.5103.submit.waiver')))
    await waitFor(() =>
      expect(screen.getByText(t('claimDetails.5103.review.waiver.confirmation.error.checkbox'))).toBeTruthy(),
    )
  })
})
