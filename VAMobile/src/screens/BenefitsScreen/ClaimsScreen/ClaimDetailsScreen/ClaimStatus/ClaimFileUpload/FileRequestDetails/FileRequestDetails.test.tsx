import React from 'react'

import { screen } from '@testing-library/react-native'

import { ClaimEventData } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import FileRequestDetails from './FileRequestDetails'

context('FileRequestDetails', () => {
  const requestWithoutFiles = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
    description: 'Need DD214',
  }

  const requestWithFilesAwaitingReview = {
    type: 'still_need_from_you_list',
    trackedItemId: 293448,
    description: 'Combat not verified',
    displayName: 'Request 4',
    overdue: false,
    status: 'SUBMITTED_AWAITING_REVIEW',
    uploaded: true,
    uploadsAllowed: true,
    openedDate: '2021-05-05',
    requestedDate: '2021-05-05',
    receivedDate: null,
    closedDate: null,
    suspenseDate: null,
    documents: [
      {
        trackedItemId: 293448,
        fileType: 'Military Personnel Record',
        documentType: 'L034',
        filename: 'post-deployment-document.pdf',
        uploadDate: '2021-05-13',
      },
      {
        trackedItemId: 293448,
        fileType: 'Military Personnel Record',
        documentType: 'L034',
        filename: 'DD214.pdf',
        uploadDate: '2021-05-13',
      },
    ],
    uploadDate: '2021-05-13',
    date: '2021-06-04',
  }

  const requestWithFilesNoLongerRequired = {
    type: 'received_from_you_list',
    trackedItemId: 293446,
    description: 'Buddy mentioned - No complete address',
    displayName: 'Request 5',
    overdue: false,
    status: 'NO_LONGER_REQUIRED',
    uploaded: true,
    uploadsAllowed: false,
    openedDate: null,
    requestedDate: '2021-05-05',
    receivedDate: null,
    closedDate: '2021-06-04',
    suspenseDate: null,
    documents: [
      {
        trackedItemId: 293446,
        fileType: 'VA 21-4142a General Release for Medical Provider Information',
        documentType: 'L827',
        filename: 'sample.pdf',
        uploadDate: '2021-05-13',
      },
    ],
    uploadDate: '2021-05-13',
    date: '2021-06-04',
  }

  const renderWithRequest = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })
    render(<FileRequestDetails {...props} />)
  }

  describe("when the request hasn't had files uploaded", () => {
    it('should display the select a file and take or select photos buttons', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getByRole('button', { name: 'Select a file' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Take or select photos' })).toBeTruthy()
    })

    it('should display request title and description', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getAllByRole('header', { name: 'Request 1' })[0]).toBeTruthy()
      expect(screen.getByText('Need DD214')).toBeTruthy()
    })
  })

  describe('when the request has files uploaded awaiting review', () => {
    it('should display headings and info', () => {
      renderWithRequest(requestWithFilesAwaitingReview)
      expect(screen.getAllByRole('header', { name: 'Request 4' })[0]).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Submitted on' })).toBeTruthy()
      expect(screen.getByText('May 13, 2021 (pending)')).toBeTruthy()
      expect(screen.getByRole('header', { name: 'File type' })).toBeTruthy()
      expect(screen.getByText('post-deployment-document.pdf')).toBeTruthy()
      expect(screen.getByText('DD214.pdf')).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Request type' })).toBeTruthy()
      expect(screen.getByText('Military Personnel Record')).toBeTruthy()
      expect(screen.getByText('Combat not verified')).toBeTruthy()
    })
  })

  describe('when the request has files which are no longer required', () => {
    it('should display special heading instead of submission date', () => {
      renderWithRequest(requestWithFilesNoLongerRequired)
      expect(screen.getByRole('header', { name: 'No longer needed' })).toBeTruthy()
      expect(screen.queryByRole('header', { name: 'Submitted' })).toBeFalsy()
      expect(screen.queryByText('May 13, 2021 (pending)')).toBeFalsy()
    })
  })
})
