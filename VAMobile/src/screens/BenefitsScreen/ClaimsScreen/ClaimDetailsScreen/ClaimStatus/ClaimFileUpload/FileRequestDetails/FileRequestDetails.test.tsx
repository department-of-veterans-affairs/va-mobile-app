import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimEventData } from 'api/types'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import { context, mockNavProps, render } from 'testUtils'

context('FileRequestDetails', () => {
  const requestWithoutFiles: ClaimEventData = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
    description: 'Need DD214',
  }

  const requestWithFilesAwaitingReview: ClaimEventData = {
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

  const requestWithFilesNoLongerRequired: ClaimEventData = {
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

  const requestWithEnrichedFields: ClaimEventData = {
    type: 'still_need_from_you_list',
    trackedItemId: 12345,
    date: '2026-01-21',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: '21-4142/21-4142a',
    description: 'We need your authorization to disclose information to a third party.',
    friendlyName: 'Authorization to disclose information',
    shortDescription: 'We need your permission to request your records from a non-VA source.',
    suspenseDate: '2026-02-20',
    longDescription: {
      blocks: [
        {
          type: 'paragraph',
          content:
            'This form authorizes VA to obtain information from a non-VA source on your behalf. You may need to complete and submit VA Form 21-4142 and 21-4142a.',
        },
        {
          type: 'list',
          style: 'bullet',
          items: ['Medical records', 'Employment records', 'Insurance records'],
        },
      ],
    },
    nextSteps: {
      blocks: [
        { type: 'paragraph', content: 'To complete this request:' },
        {
          type: 'paragraph',
          content: [
            'You can complete and sign this form online, or use a PDF version and upload or mail it.',
            { type: 'lineBreak' },
            {
              type: 'link',
              text: 'Download VA Form 21-4142',
              href: 'https://www.va.gov/find-forms/about-form-21-4142/',
            },
          ],
        },
      ],
    },
    canUploadFile: true,
  }

  const requestWithCanUploadFileFalse: ClaimEventData = {
    type: 'still_need_from_you_list',
    date: '2026-01-21',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true, // Should be overridden by canUploadFile
    displayName: 'Request with no upload',
    description: 'This request does not allow file uploads.',
    canUploadFile: false,
  }

  const requestWithPastDueSuspenseDate: ClaimEventData = {
    type: 'still_need_from_you_list',
    date: '2024-01-21',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Past due request',
    description: 'This request has a past due suspense date.',
    suspenseDate: '2024-06-01', // Past date
    canUploadFile: true,
  }

  const renderWithRequest = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })
    render(<FileRequestDetails {...props} />)
  }

  describe("when the request hasn't had files uploaded", () => {
    it('should display the select a file and take or select photos buttons', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
      expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
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
      expect(screen.getByRole('header', { name: t('fileRequestDetails.submittedTitle') })).toBeTruthy()
      expect(screen.getByText('May 13, 2021 (pending)')).toBeTruthy()
      expect(screen.getByRole('header', { name: t('fileRequestDetails.fileTitle') })).toBeTruthy()
      expect(screen.getByText('post-deployment-document.pdf')).toBeTruthy()
      expect(screen.getByText('DD214.pdf')).toBeTruthy()
      expect(screen.getByRole('header', { name: t('fileRequestDetails.typeTitle') })).toBeTruthy()
      expect(screen.getByText('Military Personnel Record')).toBeTruthy()
      expect(screen.getByText('Combat not verified')).toBeTruthy()
    })
  })

  describe('when the request has files which are no longer required', () => {
    it('should display special heading instead of submission date', () => {
      renderWithRequest(requestWithFilesNoLongerRequired)
      expect(screen.getByRole('header', { name: t('noLongerNeeded') })).toBeTruthy()
      expect(screen.queryByRole('header', { name: 'Submitted' })).toBeFalsy()
      expect(screen.queryByText('May 13, 2021 (pending)')).toBeFalsy()
    })
  })

  describe('when enriched fields are present', () => {
    it('should display friendlyName instead of displayName for title', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(screen.getAllByRole('header', { name: 'Authorization to disclose information' })[0]).toBeTruthy()
      expect(screen.queryByRole('header', { name: '21-4142/21-4142a' })).toBeFalsy()
    })

    it('should display "Respond by" with formatted suspenseDate', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(screen.getByText('Respond by February 20, 2026')).toBeTruthy()
    })

    it('should display "What we need from you" heading with longDescription content', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(screen.getByRole('header', { name: t('fileRequestDetails.whatWeNeed') })).toBeTruthy()
      expect(screen.getByTestId('longDescriptionContent')).toBeTruthy()
      expect(
        screen.getByText(
          'This form authorizes VA to obtain information from a non-VA source on your behalf. You may need to complete and submit VA Form 21-4142 and 21-4142a.',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Medical records')).toBeTruthy()
      expect(screen.getByText('Employment records')).toBeTruthy()
      expect(screen.getByText('Insurance records')).toBeTruthy()
    })

    it('should render "How to submit this information" section with nextSteps content', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(screen.getByRole('header', { name: t('fileRequestDetails.howToSubmit') })).toBeTruthy()
      expect(screen.getByTestId('nextStepsContent')).toBeTruthy()
      expect(screen.getByText('To complete this request:')).toBeTruthy()
    })

    it('should render clickable links in nextSteps', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(
        screen.getByText('You can complete and sign this form online, or use a PDF version and upload or mail it.'),
      ).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Download VA Form 21-4142' })).toBeTruthy()
    })

    it('should show upload buttons when canUploadFile is true', () => {
      renderWithRequest(requestWithEnrichedFields)
      expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
      expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
    })
  })

  describe('when canUploadFile is false', () => {
    it('should hide upload buttons even when uploadsAllowed is true', () => {
      renderWithRequest(requestWithCanUploadFileFalse)
      expect(screen.queryByRole('button', { name: t('fileUpload.selectAFile') })).toBeFalsy()
      expect(screen.queryByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeFalsy()
    })
  })

  describe('when suspense date is past due', () => {
    it('should display past due warning alert', () => {
      renderWithRequest(requestWithPastDueSuspenseDate)
      expect(screen.getByText(t('fileRequestDetails.pastDue.title'))).toBeTruthy()
      expect(screen.getByText(t('fileRequestDetails.pastDue.body'))).toBeTruthy()
      expect(screen.getByText(t('fileRequestDetails.pastDue.callText'))).toBeTruthy()
    })

    it('should still show upload buttons when past due', () => {
      renderWithRequest(requestWithPastDueSuspenseDate)
      expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
      expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
    })

    it('should not show past due alert when suspense date is in the future', () => {
      renderWithRequest(requestWithEnrichedFields) // Has future suspenseDate
      expect(screen.queryByText(t('fileRequestDetails.pastDue.title'))).toBeFalsy()
    })

    it('should still show past due alert even after files have been uploaded', () => {
      const pastDueWithUpload: ClaimEventData = {
        ...requestWithPastDueSuspenseDate,
        uploaded: true,
        type: 'received_from_you_list',
        status: 'SUBMITTED_AWAITING_REVIEW',
        uploadDate: '2024-05-15',
        documents: [{ filename: 'test.pdf', fileType: 'PDF' }],
      }
      renderWithRequest(pastDueWithUpload)
      expect(screen.getByText(t('fileRequestDetails.pastDue.title'))).toBeTruthy()
    })
  })

  describe('graceful fallback behavior', () => {
    it('should fall back to displayName when friendlyName is not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getAllByRole('header', { name: 'Request 1' })[0]).toBeTruthy()
    })

    it('should fall back to description when shortDescription is not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getByText('Need DD214')).toBeTruthy()
    })

    it('should fall back to uploadsAllowed when canUploadFile is not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
    })

    it('should not render "What we need from you" section when longDescription not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.queryByTestId('longDescriptionContent')).toBeFalsy()
      expect(screen.queryByRole('header', { name: t('fileRequestDetails.whatWeNeed') })).toBeFalsy()
    })

    it('should not render "How to submit" section when nextSteps not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.queryByTestId('nextStepsContent')).toBeFalsy()
      expect(screen.queryByRole('header', { name: t('fileRequestDetails.howToSubmit') })).toBeFalsy()
    })

    it('should not show "Respond by" when suspenseDate is not present', () => {
      renderWithRequest(requestWithoutFiles)
      expect(screen.queryByText(/Respond by/)).toBeFalsy()
    })
  })
})
