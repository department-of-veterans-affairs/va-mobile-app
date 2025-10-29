import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimDetails, TravelPayClaimDocument } from 'api/types'
import TravelPayClaimInformation from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimInformation'
import { context, render } from 'testUtils'
import { getFormattedDate } from 'utils/formattingUtils'

// Mock the formatting utils
jest.mock('utils/formattingUtils', () => ({
  getFormattedDate: jest.fn(),
}))

// Mock the child component
jest.mock('screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload', () => {
  return function MockTravelPayDocumentDownload({
    document,
    claimId,
  }: {
    document: { documentId: string; filename: string }
    claimId: string
  }) {
    // Return a simple object that represents the component for testing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactLib = require('react')
    return ReactLib.createElement('Text', {
      testID: `document-download-${document.documentId}`,
      children: `Document: ${document.filename} (Claim: ${claimId})`,
    })
  }
})

const mockGetFormattedDate = getFormattedDate as jest.MockedFunction<typeof getFormattedDate>

// Test data
const baseClaimDetails: TravelPayClaimDetails = {
  id: 'test-claim-id',
  claimNumber: 'TC123456789',
  claimName: 'Travel reimbursement',
  claimantFirstName: 'John',
  claimantMiddleName: 'M',
  claimantLastName: 'Doe',
  claimStatus: 'In manual review',
  appointmentDate: '2023-12-01T10:00:00.000Z',
  facilityName: 'Test VA Medical Center',
  totalCostRequested: 250.0,
  reimbursementAmount: 180.0,
  appointment: {
    id: 'appointment-id',
    appointmentSource: 'VAOS',
    appointmentDateTime: '2023-12-01T10:00:00.000Z',
    appointmentName: 'Primary Care Appointment',
    appointmentType: 'Primary Care',
    facilityId: '442',
    facilityName: 'Test VA Medical Center',
    serviceConnectedDisability: 0,
    currentStatus: 'BOOKED',
    appointmentStatus: 'CONFIRMED',
    externalAppointmentId: 'EXT-12345',
    associatedClaimId: 'test-claim-id',
    associatedClaimNumber: 'TC123456789',
    isCompleted: true,
  },
  expenses: [],
  documents: [],
  createdOn: '2023-11-30T10:00:00.000Z',
  modifiedOn: '2023-12-01T10:00:00.000Z',
}

const mockUserDocument: TravelPayClaimDocument = {
  documentId: 'user-doc-id',
  filename: 'receipt.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

const mockDecisionLetter: TravelPayClaimDocument = {
  documentId: 'decision-letter-id',
  filename: 'Decision Letter.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

const mockRejectionLetter: TravelPayClaimDocument = {
  documentId: 'rejection-letter-id',
  filename: 'Rejection Letter.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

context('TravelPayClaimInformation', () => {
  const renderComponent = (claimDetails: TravelPayClaimDetails) => {
    render(<TravelPayClaimInformation claimDetails={claimDetails} />)
  }

  beforeEach(() => {
    // Mock date formatting to return predictable values
    mockGetFormattedDate.mockImplementation((dateString, format) => {
      if (format === 'EEEE, MMMM d, yyyy') {
        return dateString === '2023-11-30T10:00:00.000Z' ? 'Thursday, November 30, 2023' : 'Friday, December 1, 2023'
      }
      if (format === 'h:mm a') {
        return '10:00 AM'
      }
      return 'Formatted Date'
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render all required sections', () => {
      renderComponent(baseClaimDetails)

      // Section title
      expect(screen.getByText(t('travelPay.claimDetails.information.title'))).toBeTruthy()

      // When section
      expect(screen.getByTestId('travelPayClaimInformationWhenTitleTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.when'))).toBeTruthy()

      // Where section
      expect(screen.getByText(t('travelPay.claimDetails.information.where'))).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationWhereTestID')).toBeTruthy()
    })

    it('should display facility name correctly', () => {
      renderComponent(baseClaimDetails)

      const facilityElement = screen.getByTestId('travelPayClaimInformationWhereTestID')
      expect(facilityElement).toBeTruthy()
      expect(screen.getByText(baseClaimDetails.facilityName)).toBeTruthy()
    })

    it('should handle different facility names', () => {
      const claimWithDifferentFacility = {
        ...baseClaimDetails,
        facilityName: 'Another VA Medical Center',
      }

      renderComponent(claimWithDifferentFacility)

      expect(screen.getByText('Another VA Medical Center')).toBeTruthy()
    })
  })

  describe('Date Formatting Integration', () => {
    it('should call getFormattedDate with correct parameters for submitted date', () => {
      renderComponent(baseClaimDetails)

      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.createdOn, 'EEEE, MMMM d, yyyy')
      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.createdOn, 'h:mm a')
    })

    it('should call getFormattedDate with correct parameters for updated date', () => {
      renderComponent(baseClaimDetails)

      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.modifiedOn, 'EEEE, MMMM d, yyyy')
      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.modifiedOn, 'h:mm a')
    })

    it('should display formatted submitted date and time', () => {
      renderComponent(baseClaimDetails)

      const submittedText = t('travelPay.claimDetails.information.submittedOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(submittedText)).toBeTruthy()
    })

    it('should display formatted updated date and time', () => {
      renderComponent(baseClaimDetails)

      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should handle different date formats correctly', () => {
      const claimWithDifferentDates = {
        ...baseClaimDetails,
        createdOn: '2024-01-15T14:30:00.000Z',
        modifiedOn: '2024-01-16T16:45:00.000Z',
      }

      mockGetFormattedDate.mockImplementation((dateString, format) => {
        if (dateString === '2024-01-15T14:30:00.000Z') {
          return format === 'EEEE, MMMM d, yyyy' ? 'Monday, January 15, 2024' : '2:30 PM'
        }
        if (dateString === '2024-01-16T16:45:00.000Z') {
          return format === 'EEEE, MMMM d, yyyy' ? 'Tuesday, January 16, 2024' : '4:45 PM'
        }
        return 'Formatted Date'
      })

      renderComponent(claimWithDifferentDates)

      const submittedText = t('travelPay.claimDetails.information.submittedOn', {
        date: 'Monday, January 15, 2024',
        time: '2:30 PM',
      })
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Tuesday, January 16, 2024',
        time: '4:45 PM',
      })

      expect(screen.getByText(submittedText)).toBeTruthy()
      expect(screen.getByText(updatedText)).toBeTruthy()
    })
  })

  describe('Document Filtering Logic', () => {
    it('should exclude decision letters from user documents', () => {
      const claimWithDecisionLetter = {
        ...baseClaimDetails,
        documents: [mockUserDocument, mockDecisionLetter],
      }

      renderComponent(claimWithDecisionLetter)

      // Should show documents section title
      expect(screen.getByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeTruthy()

      // Should show user document but not decision letter
      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
      expect(screen.queryByTestId('document-download-decision-letter-id')).toBeFalsy()
    })

    it('should exclude rejection letters from user documents', () => {
      const claimWithRejectionLetter = {
        ...baseClaimDetails,
        documents: [mockUserDocument, mockRejectionLetter],
      }

      renderComponent(claimWithRejectionLetter)

      // Should show user document but not rejection letter
      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
      expect(screen.queryByTestId('document-download-rejection-letter-id')).toBeFalsy()
    })

    it('should exclude both decision and rejection letters', () => {
      const claimWithSystemDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument, mockDecisionLetter, mockRejectionLetter],
      }

      renderComponent(claimWithSystemDocuments)

      // Should only show user document
      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
      expect(screen.queryByTestId('document-download-decision-letter-id')).toBeFalsy()
      expect(screen.queryByTestId('document-download-rejection-letter-id')).toBeFalsy()
    })

    it('should show multiple user documents', () => {
      const mockUserDocument2: TravelPayClaimDocument = {
        documentId: 'user-doc-2-id',
        filename: 'mileage_log.pdf',
        mimetype: 'application/pdf',
        createdon: '2023-12-01T10:00:00.000Z',
      }

      const claimWithMultipleUserDocs = {
        ...baseClaimDetails,
        documents: [mockUserDocument, mockUserDocument2, mockDecisionLetter],
      }

      renderComponent(claimWithMultipleUserDocs)

      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
      expect(screen.getByTestId('document-download-user-doc-2-id')).toBeTruthy()
      expect(screen.queryByTestId('document-download-decision-letter-id')).toBeFalsy()
    })
  })

  describe('Conditional Rendering', () => {
    it('should show documents section when user documents exist', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      expect(screen.getByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
    })

    it('should not show documents section when no user documents exist', () => {
      const claimWithNoUserDocs = {
        ...baseClaimDetails,
        documents: [mockDecisionLetter, mockRejectionLetter],
      }

      renderComponent(claimWithNoUserDocs)

      expect(screen.queryByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeFalsy()
      expect(screen.queryByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeFalsy()
    })

    it('should not show documents section when documents array is empty', () => {
      const claimWithEmptyDocs = {
        ...baseClaimDetails,
        documents: [],
      }

      renderComponent(claimWithEmptyDocs)

      expect(screen.queryByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeFalsy()
    })

    it('should not show documents section when documents is undefined', () => {
      const claimWithUndefinedDocs = {
        ...baseClaimDetails,
        documents: undefined,
      }

      renderComponent(claimWithUndefinedDocs as unknown as TravelPayClaimDetails)

      expect(screen.queryByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeFalsy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation keys', () => {
      renderComponent(baseClaimDetails)

      // Verify all translation keys are used
      expect(screen.getByText(t('travelPay.claimDetails.information.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.when'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.where'))).toBeTruthy()
    })

    it('should handle translation interpolation correctly', () => {
      renderComponent(baseClaimDetails)

      // Check interpolated translations
      const submittedText = t('travelPay.claimDetails.information.submittedOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })

      expect(screen.getByText(submittedText)).toBeTruthy()
      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should use documents translation when documents exist', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper testIDs for all major elements', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      expect(screen.getByTestId('travelPayClaimInformationWhenTitleTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationSubmittedOnTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationUpdatedOnTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationWhereTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationDocumentsSubmittedTitleTestID')).toBeTruthy()
    })

    it('should be accessible to screen readers', () => {
      renderComponent(baseClaimDetails)

      // All text elements should be accessible by default
      expect(screen.getByText(t('travelPay.claimDetails.information.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.when'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.where'))).toBeTruthy()
      expect(screen.getByText(baseClaimDetails.facilityName)).toBeTruthy()
    })
  })

  describe('Visual Hierarchy', () => {
    it('should use appropriate text variants for hierarchy', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      // Section headers should use MobileBodyBold
      const sectionTitle = screen.getByText(t('travelPay.claimDetails.information.title'))
      expect(sectionTitle.props.variant).toBe('MobileBodyBold')

      const whenTitle = screen.getByText(t('travelPay.claimDetails.information.when'))
      expect(whenTitle.props.variant).toBe('MobileBodyBold')

      const whereTitle = screen.getByText(t('travelPay.claimDetails.information.where'))
      expect(whereTitle.props.variant).toBe('MobileBodyBold')

      const documentsTitle = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      expect(documentsTitle.props.variant).toBe('MobileBodyBold')

      // Content should use MobileBody
      const submittedElement = screen.getByTestId('travelPayClaimInformationSubmittedOnTestID')
      expect(submittedElement.props.variant).toBe('MobileBody')

      const updatedElement = screen.getByTestId('travelPayClaimInformationUpdatedOnTestID')
      expect(updatedElement.props.variant).toBe('MobileBody')

      const facilityElement = screen.getByTestId('travelPayClaimInformationWhereTestID')
      expect(facilityElement.props.variant).toBe('MobileBody')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing facility name gracefully', () => {
      const claimWithEmptyFacility = {
        ...baseClaimDetails,
        facilityName: '',
      }

      renderComponent(claimWithEmptyFacility)

      const facilityElement = screen.getByTestId('travelPayClaimInformationWhereTestID')
      expect(facilityElement).toBeTruthy()
      expect(screen.getByText('')).toBeTruthy()
    })

    it('should handle special characters in facility name', () => {
      const claimWithSpecialChars = {
        ...baseClaimDetails,
        facilityName: 'VA Medical Center - "Special" & Symbols',
      }

      renderComponent(claimWithSpecialChars)

      expect(screen.getByText('VA Medical Center - "Special" & Symbols')).toBeTruthy()
    })

    it('should handle very long facility names', () => {
      const claimWithLongFacility = {
        ...baseClaimDetails,
        facilityName: 'Very Long Facility Name That Might Wrap Multiple Lines And Test Text Handling',
      }

      renderComponent(claimWithLongFacility)

      expect(
        screen.getByText('Very Long Facility Name That Might Wrap Multiple Lines And Test Text Handling'),
      ).toBeTruthy()
    })

    it('should handle documents with edge case filenames', () => {
      const edgeDocuments: TravelPayClaimDocument[] = [
        {
          documentId: 'normal-doc',
          filename: 'normal_receipt.pdf',
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        {
          documentId: 'partial-match-doc',
          filename: 'My Decision Letter Copy.pdf', // Contains "Decision Letter" but not exact match
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        {
          documentId: 'case-sensitive-doc',
          filename: 'rejection letter.pdf', // Lowercase
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
      ]

      const claimWithEdgeDocs = {
        ...baseClaimDetails,
        documents: edgeDocuments,
      }

      renderComponent(claimWithEdgeDocs)

      // Should show normal document
      expect(screen.getByTestId('document-download-normal-doc')).toBeTruthy()

      // Should filter out partial match (contains "Decision Letter")
      expect(screen.queryByTestId('document-download-partial-match-doc')).toBeFalsy()

      // Should show lowercase (case sensitive filtering)
      expect(screen.getByTestId('document-download-case-sensitive-doc')).toBeTruthy()
    })

    it('should handle documents with unusual but valid filenames', () => {
      const unusualDocuments = [
        {
          documentId: 'unusual-doc',
          filename: 'document with spaces & symbols!.pdf',
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        mockUserDocument,
      ]

      const claimWithUnusualDocs = {
        ...baseClaimDetails,
        documents: unusualDocuments,
      }

      renderComponent(claimWithUnusualDocs)

      // Should show both documents
      expect(screen.getByTestId('document-download-unusual-doc')).toBeTruthy()
      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
    })
  })

  describe('Component Integration', () => {
    it('should pass correct props to TravelPayDocumentDownload', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      // Verify child component receives correct props
      const documentComponent = screen.getByTestId('document-download-user-doc-id')
      expect(documentComponent).toBeTruthy()
      expect(screen.getByText('Document: receipt.pdf (Claim: test-claim-id)')).toBeTruthy()
    })

    it('should render multiple document download components', () => {
      const multipleDocuments = [
        mockUserDocument,
        {
          documentId: 'doc-2',
          filename: 'mileage.pdf',
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        {
          documentId: 'doc-3',
          filename: 'parking.pdf',
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
      ]

      const claimWithMultipleDocs = {
        ...baseClaimDetails,
        documents: multipleDocuments,
      }

      renderComponent(claimWithMultipleDocs)

      expect(screen.getByTestId('document-download-user-doc-id')).toBeTruthy()
      expect(screen.getByTestId('document-download-doc-2')).toBeTruthy()
      expect(screen.getByTestId('document-download-doc-3')).toBeTruthy()
    })
  })

  describe('Date Edge Cases', () => {
    it('should handle same created and modified dates', () => {
      const claimWithSameDates = {
        ...baseClaimDetails,
        createdOn: '2023-12-01T10:00:00.000Z',
        modifiedOn: '2023-12-01T10:00:00.000Z',
      }

      mockGetFormattedDate.mockImplementation((dateString, format) => {
        if (format === 'EEEE, MMMM d, yyyy') {
          return 'Friday, December 1, 2023'
        }
        return '10:00 AM'
      })

      renderComponent(claimWithSameDates)

      const submittedText = t('travelPay.claimDetails.information.submittedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })

      expect(screen.getByText(submittedText)).toBeTruthy()
      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should handle invalid date strings gracefully', () => {
      const claimWithInvalidDates = {
        ...baseClaimDetails,
        createdOn: 'invalid-date',
        modifiedOn: 'also-invalid',
      }

      mockGetFormattedDate.mockReturnValue('Invalid Date')

      renderComponent(claimWithInvalidDates)

      const submittedText = t('travelPay.claimDetails.information.submittedOn', {
        date: 'Invalid Date',
        time: 'Invalid Date',
      })
      expect(screen.getByText(submittedText)).toBeTruthy()
    })
  })

  describe('Document Filtering Edge Cases', () => {
    it('should handle documents with partial filename matches correctly', () => {
      const partialMatchDocuments: TravelPayClaimDocument[] = [
        {
          documentId: 'decision-in-name',
          filename: 'My Decision Letter from 2023.pdf', // Contains "Decision Letter"
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        {
          documentId: 'rejection-in-name',
          filename: 'Appeal of Rejection Letter.pdf', // Contains "Rejection Letter"
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
        {
          documentId: 'user-doc',
          filename: 'receipt_decision_copy.pdf', // Contains "decision" but not "Decision Letter"
          mimetype: 'application/pdf',
          createdon: '2023-12-01T10:00:00.000Z',
        },
      ]

      const claimWithPartialMatches = {
        ...baseClaimDetails,
        documents: partialMatchDocuments,
      }

      renderComponent(claimWithPartialMatches)

      // Should filter out documents containing "Decision Letter" and "Rejection Letter"
      expect(screen.queryByTestId('document-download-decision-in-name')).toBeFalsy()
      expect(screen.queryByTestId('document-download-rejection-in-name')).toBeFalsy()

      // Should show document that only contains "decision" but not "Decision Letter"
      expect(screen.getByTestId('document-download-user-doc')).toBeTruthy()
    })
  })
})
