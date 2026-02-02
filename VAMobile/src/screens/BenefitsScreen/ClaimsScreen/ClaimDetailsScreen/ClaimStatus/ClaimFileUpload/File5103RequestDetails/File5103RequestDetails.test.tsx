import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimEventData } from 'api/types'
import File5103RequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103RequestDetails/File5103RequestDetails'
import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'

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

const decisionLetters = [
  {
    id: '{87B6DE5D-CD79-4D15-B6DC-A5F9A324DC3E}',
    type: 'decisionLetter',
    attributes: {
      seriesId: '{EC1B5F0C-E3FB-4A41-B93F-E1A88D549CDF}',
      version: '1',
      typeDescription: 'Decision Rating Letter',
      typeId: '184',
      docType: '184',
      receivedAt: '2022-09-21',
      source: 'VBMS',
      mimeType: 'application/pdf',
      altDocTypes: '',
      restricted: false,
      uploadDate: '2022-09-22',
    },
  },
]

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('File5103RequestDetails', () => {
  const renderWithRequest = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { claimID, request } })

    when(api.get as jest.Mock)
      .calledWith(`/v0/claims/decision-letters`)
      .mockResolvedValue({
        data: decisionLetters,
      })

    render(<File5103RequestDetails {...props} />)
  }

  it('should render the correct content', () => {
    renderWithRequest(request5103)
    expect(screen.findByText(t('claimDetails.5103.title'))).toBeTruthy()
    expect(screen.findByText(t('claimDetails.5103.read'))).toBeTruthy()
    expect(screen.findByText(t('claimDetails.5103.submit'))).toBeTruthy()
    expect(screen.findByRole('button', { name: t('claimDetails.5103.review.waiver') })).toBeTruthy()
    expect(screen.findByRole('button', { name: t('claimDetails.5103.submit.evidence') })).toBeTruthy()
  })

  it('navigates to review waiver on click', async () => {
    renderWithRequest(request5103)
    const claimEvent = {
      claimID: claimID,
      request: request5103,
    }

    const reviewWaiverBtn = await screen.findByRole('button', { name: t('claimDetails.5103.review.waiver') })
    fireEvent.press(reviewWaiverBtn)
    expect(mockNavigationSpy).toHaveBeenCalledWith('File5103ReviewWaiver', claimEvent)
  })

  it('navigates to submit evidence on click', async () => {
    renderWithRequest(request5103)
    const claimEvent = {
      claimID: claimID,
      request: request5103,
    }

    const submitEvidenceBtn = await screen.findByRole('button', { name: t('claimDetails.5103.submit.evidence') })
    fireEvent.press(submitEvidenceBtn)
    expect(mockNavigationSpy).toHaveBeenCalledWith('File5103SubmitEvidence', claimEvent)
  })
})
