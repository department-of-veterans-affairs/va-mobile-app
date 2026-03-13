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
const mockAlertSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useShowActionSheet: () => mockAlertSpy,
  }
})

context('File5103ReviewWaiver', () => {
  const renderWithRequest = (requests: ClaimEventData[], provider?: string, extraAttributes: object = {}) => {
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, claimID],
        data: {
          ...Claim,
          attributes: {
            ...Claim.attributes,
            waiverSubmitted: false,
            eventsTimeline: requests,
            ...extraAttributes,
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
            ...extraAttributes,
          },
        },
      })

    const props = mockNavProps(undefined, undefined, { params: { claimID, provider } })
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

  describe('navigation after successful submit', () => {
    const closedClaimAttributes = { open: false, decisionLetterSent: true }

    beforeEach(() => {
      mockNavigationSpy.mockReset()
      ;(api.post as jest.Mock).mockResolvedValue({})
      mockAlertSpy.mockImplementation((_: unknown, callback: (idx: number) => void) => callback(0))
    })

    it('navigates to ClaimDetailsScreen with provider when provider param is set', async () => {
      renderWithRequest([request5103], 'lighthouseV2', closedClaimAttributes)
      await waitFor(() => fireEvent.press(screen.getByText(t('claimDetails.5103.review.waiver.confirmation'))))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('claimDetails.5103.submit.waiver') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID,
          claimType: 'CLOSED',
          provider: 'lighthouseV2',
        }),
      )
    })

    it('navigates to ClaimDetailsScreen without provider when provider param is not set', async () => {
      renderWithRequest([request5103], undefined, closedClaimAttributes)
      await waitFor(() => fireEvent.press(screen.getByText(t('claimDetails.5103.review.waiver.confirmation'))))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('claimDetails.5103.submit.waiver') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID,
          claimType: 'CLOSED',
          provider: undefined,
        }),
      )
    })
  })
})
