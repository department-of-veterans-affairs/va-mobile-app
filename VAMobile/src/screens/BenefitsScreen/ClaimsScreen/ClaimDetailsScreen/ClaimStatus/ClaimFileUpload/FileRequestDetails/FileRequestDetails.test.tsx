import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { when } from 'jest-when'

import { ClaimEventData } from 'api/types'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import { context, mockNavProps, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('FileRequestDetails', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock

  beforeEach(() => {
    mockFeatureEnabled.mockReset()
  })

  const requestWithoutFiles: ClaimEventData = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
    description: 'Need DD214',
    requestedDate: '2020-07-16',
    suspenseDate: '2020-08-16',
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

  const renderWithRequest = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })
    render(<FileRequestDetails {...props} />)
  }

  describe("when the 'evidenceRequestsUpdatedUI' feature flag is enabled", () => {
    beforeEach(() => {
      when(mockFeatureEnabled).calledWith('evidenceRequestsUpdatedUI').mockReturnValue(true)
    })

    describe("when the request hasn't had files uploaded", () => {
      beforeEach(() => {
        renderWithRequest(requestWithoutFiles)
      })

      it('should display the select a file and take or select photos buttons', () => {
        expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
        expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
      })

      it('should display the new title and respond by subtitle', () => {
        expect(screen.getByText(t('fileRequestDetails.title'))).toBeTruthy()
        expect(screen.getByText(/Respond by/)).toBeTruthy()
      })

      it('should display the request date blurb with formatted date', () => {
        expect(screen.getByText(/We requested this evidence from you on July 16, 2020/)).toBeTruthy()
      })

      it("should display the 'What we need from you' section with description", () => {
        expect(screen.getByRole('header', { name: t('fileRequestDetails.whatWeNeedFromYou') })).toBeTruthy()
        expect(screen.getByText('Need DD214')).toBeTruthy()
      })

      it("should display the 'How to submit this information' section with links", () => {
        expect(screen.getByRole('header', { name: t('fileRequestDetails.nextSteps') })).toBeTruthy()
        expect(screen.getByText(t('fileRequestDetails.nextSteps.toRespond'))).toBeTruthy()
        expect(screen.getByText(t('fileRequestDetails.accessYourClaimLetters'))).toBeTruthy()
        expect(screen.getByText(t('fileRequestDetails.findVAForm'))).toBeTruthy()
      })

      it("should display the 'Need help' accordion with phone number when expanded", () => {
        expect(screen.getByRole('tab', { name: t('fileRequestDetails.needHelp') })).toBeTruthy()
        fireEvent.press(screen.getByRole('tab', { name: t('fileRequestDetails.needHelp') }))
        expect(screen.getByText('800-827-1000')).toBeTruthy()
      })

      it("should display 'More on submitting files' accordion with 'Find a VA location' when expanded", () => {
        expect(screen.getByRole('tab', { name: t('fileRequestDetails.moreOnSubmitting') })).toBeTruthy()
        fireEvent.press(screen.getByRole('tab', { name: t('fileRequestDetails.moreOnSubmitting') }))
        expect(screen.getByText(t('fileRequestDetails.moreOnSubmitting.findVALocation'))).toBeTruthy()
      })
    })

    describe('when request data is missing or restricted', () => {
      it('should NOT display request date blurb when requestedDate is missing', () => {
        renderWithRequest({ ...requestWithoutFiles, requestedDate: undefined })
        expect(screen.queryByText(/We requested this evidence from you on/)).toBeFalsy()
      })

      it('should NOT display respond by subtitle when suspenseDate is null', () => {
        renderWithRequest({ ...requestWithoutFiles, suspenseDate: null })
        expect(screen.queryByText(/Respond by/)).toBeFalsy()
      })

      it("should NOT display 'More on submitting files' accordion when uploadsAllowed is false", () => {
        renderWithRequest({ ...requestWithoutFiles, uploadsAllowed: false })
        expect(screen.queryByRole('tab', { name: t('fileRequestDetails.moreOnSubmitting') })).toBeFalsy()
      })
    })

    describe('when the request has files uploaded awaiting review', () => {
      it('should display headings and info', () => {
        renderWithRequest(requestWithFilesAwaitingReview)
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
  })

  describe("when the 'evidenceRequestsUpdatedUI' feature flag is disabled", () => {
    beforeEach(() => {
      when(mockFeatureEnabled).calledWith('evidenceRequestsUpdatedUI').mockReturnValue(false)
    })

    describe("when the request hasn't had files uploaded", () => {
      beforeEach(() => {
        renderWithRequest(requestWithoutFiles)
      })

      it('should display the select a file and take or select photos buttons', () => {
        expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
        expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
      })

      it('should display displayName as the title and description', () => {
        expect(screen.getAllByRole('header', { name: 'Request 1' })[0]).toBeTruthy()
        expect(screen.getByText('Need DD214')).toBeTruthy()
      })

      it('should NOT display any of the new UI sections', () => {
        expect(screen.queryByText(/Respond by/)).toBeFalsy()
        expect(screen.queryByText(/We requested this evidence from you on/)).toBeFalsy()
        expect(screen.queryByRole('header', { name: t('fileRequestDetails.nextSteps') })).toBeFalsy()
        expect(screen.queryByRole('tab', { name: t('fileRequestDetails.needHelp') })).toBeFalsy()
        expect(screen.queryByRole('tab', { name: t('fileRequestDetails.moreOnSubmitting') })).toBeFalsy()
        expect(screen.queryByText(t('fileRequestDetails.accessYourClaimLetters'))).toBeFalsy()
        expect(screen.queryByText(t('fileRequestDetails.findVAForm'))).toBeFalsy()
      })
    })

    describe('when the request has files uploaded awaiting review', () => {
      it('should display headings and info with displayName as title', () => {
        renderWithRequest(requestWithFilesAwaitingReview)
        expect(screen.getAllByRole('header', { name: 'Request 4' })[0]).toBeTruthy()
        expect(screen.getByRole('header', { name: t('fileRequestDetails.submittedTitle') })).toBeTruthy()
        expect(screen.getByText('May 13, 2021 (pending)')).toBeTruthy()
        expect(screen.getByRole('header', { name: t('fileRequestDetails.fileTitle') })).toBeTruthy()
        expect(screen.getByText('post-deployment-document.pdf')).toBeTruthy()
        expect(screen.getByText('DD214.pdf')).toBeTruthy()
      })
    })

    describe('when the request has files which are no longer required', () => {
      it('should display special heading instead of submission date', () => {
        renderWithRequest(requestWithFilesNoLongerRequired)
        expect(screen.getByRole('header', { name: t('noLongerNeeded') })).toBeTruthy()
        expect(screen.queryByRole('header', { name: 'Submitted' })).toBeFalsy()
      })
    })
  })
})
