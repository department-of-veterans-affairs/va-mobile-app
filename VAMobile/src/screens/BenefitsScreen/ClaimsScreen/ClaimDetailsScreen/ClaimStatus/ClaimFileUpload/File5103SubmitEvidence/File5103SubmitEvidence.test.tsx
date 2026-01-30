import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimEventData } from 'api/types'
import File5103SubmitEvidence from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103SubmitEvidence/File5103SubmitEvidence'
import { context, mockNavProps, render } from 'testUtils'

context('File5103SubmitEvidence', () => {
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

  const renderWithRequest = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })
    render(<File5103SubmitEvidence {...props} />)
  }

  it('should display the select a file and take or select photos buttons', () => {
    renderWithRequest(request5103)
    expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
    expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
  })

  it('should display request title and description', () => {
    renderWithRequest(request5103)
    expect(screen.getByText(t('claimDetails.5103.submit.evidence.how'))).toBeTruthy()
    expect(screen.getByText(t('claimDetails.5103.submit.evidence.title'))).toBeTruthy()
  })
})
