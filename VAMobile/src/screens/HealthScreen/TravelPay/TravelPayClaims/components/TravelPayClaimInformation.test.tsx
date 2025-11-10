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
jest.mock('screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimDocuments', () => {
  return function MockTravelPayClaimDocuments({
    documents,
    claimId,
    claimStatus,
  }: {
    documents: Array<{ documentId: string; filename: string }>
    claimId: string
    claimStatus: string
  }) {
    // Return a simple object that represents the component for testing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactLib = require('react')
    return ReactLib.createElement('Text', {
      testID: 'travel-pay-claim-documents-mock',
      children: `Documents: ${documents.length} documents for claim ${claimId} (${claimStatus})`,
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

      // Claim submission timeline section
      expect(screen.getByTestId('travelPayClaimInformationSubmissionTimelineTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.timeline'))).toBeTruthy()

      // Appointment information section
      expect(screen.getByText(t('travelPay.claimDetails.information.appointmentDateTime.title'))).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationAppointmentDateTestID')).toBeTruthy()
    })

    it('should display facility name correctly', () => {
      renderComponent(baseClaimDetails)

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
    it('should call getFormattedDate with correct parameters for created date when shown', () => {
      const incompleteClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Incomplete',
      }

      renderComponent(incompleteClaimDetails)

      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.createdOn, 'EEEE, MMMM d, yyyy')
      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.createdOn, 'h:mm a')
    })

    it('should call getFormattedDate with correct parameters for updated date', () => {
      renderComponent(baseClaimDetails)

      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.modifiedOn, 'EEEE, MMMM d, yyyy')
      expect(mockGetFormattedDate).toHaveBeenCalledWith(baseClaimDetails.modifiedOn, 'h:mm a')
    })

    it('should display formatted created date and time when status allows', () => {
      const savedClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Saved',
      }

      renderComponent(savedClaimDetails)

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(createdText)).toBeTruthy()
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
        claimStatus: 'Incomplete',
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

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Monday, January 15, 2024',
        time: '2:30 PM',
      })
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Tuesday, January 16, 2024',
        time: '4:45 PM',
      })

      expect(screen.getByText(createdText)).toBeTruthy()
      expect(screen.getByText(updatedText)).toBeTruthy()
    })
  })

  describe('Created On Conditional Logic', () => {
    it('should show "Created on" for Incomplete status', () => {
      const incompleteClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Incomplete',
      }

      renderComponent(incompleteClaimDetails)

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(createdText)).toBeTruthy()
    })

    it('should show "Created on" for Saved status', () => {
      const savedClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Saved',
      }

      renderComponent(savedClaimDetails)

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(createdText)).toBeTruthy()
    })

    it('should NOT show "Created on" for In process status', () => {
      const inProcessClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'In process',
      }

      renderComponent(inProcessClaimDetails)

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Thursday, November 30, 2023',
        time: '10:00 AM',
      })
      expect(screen.queryByText(createdText)).toBeFalsy()
    })

    it('should always show "Updated on" for Incomplete status', () => {
      const incompleteClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Incomplete',
      }

      renderComponent(incompleteClaimDetails)

      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should always show "Updated on" for Denied status', () => {
      const deniedClaimDetails = {
        ...baseClaimDetails,
        claimStatus: 'Denied',
      }

      renderComponent(deniedClaimDetails)

      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(updatedText)).toBeTruthy()
    })
  })

  describe('TravelPayClaimDocuments Integration', () => {
    it('should render TravelPayClaimDocuments when documents exist', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [mockUserDocument],
      }

      renderComponent(claimWithDocuments)

      expect(screen.getByTestId('travel-pay-claim-documents-mock')).toBeTruthy()
      expect(screen.getByText('Documents: 1 documents for claim test-claim-id (In manual review)')).toBeTruthy()
    })

    it('should not render TravelPayClaimDocuments when documents array is empty', () => {
      const claimWithEmptyDocs = {
        ...baseClaimDetails,
        documents: [],
      }

      renderComponent(claimWithEmptyDocs)

      expect(screen.queryByTestId('travel-pay-claim-documents-mock')).toBeFalsy()
    })

    it('should not render TravelPayClaimDocuments when documents is undefined', () => {
      const claimWithUndefinedDocs = {
        ...baseClaimDetails,
        documents: undefined,
      }

      renderComponent(claimWithUndefinedDocs as unknown as TravelPayClaimDetails)

      expect(screen.queryByTestId('travel-pay-claim-documents-mock')).toBeFalsy()
    })

    it('should pass correct props to TravelPayClaimDocuments', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        id: 'specific-claim-123',
        claimStatus: 'Denied',
        documents: [mockUserDocument, mockDecisionLetter],
      }

      renderComponent(claimWithDocuments)

      // Verify child component receives correct props
      expect(screen.getByText('Documents: 2 documents for claim specific-claim-123 (Denied)')).toBeTruthy()
    })

    it('should pass all documents to TravelPayClaimDocuments (filtering is handled by child)', () => {
      const claimWithMultipleDocs = {
        ...baseClaimDetails,
        documents: [mockUserDocument, mockDecisionLetter, mockRejectionLetter],
      }

      renderComponent(claimWithMultipleDocs)

      // Should pass all 3 documents to the child component
      expect(screen.getByText('Documents: 3 documents for claim test-claim-id (In manual review)')).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation keys', () => {
      renderComponent(baseClaimDetails)

      // Verify all translation keys are used
      expect(screen.getByText(t('travelPay.claimDetails.information.timeline'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.appointmentDateTime.title'))).toBeTruthy()
    })

    it('should handle translation interpolation correctly', () => {
      renderComponent(baseClaimDetails)

      // Check interpolated translations
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })

      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should use appointment date translation correctly', () => {
      mockGetFormattedDate.mockImplementation((dateString, format) => {
        if (dateString === baseClaimDetails.appointmentDate) {
          return format === 'EEEE, MMMM d, yyyy' ? 'Friday, December 1, 2023' : '10:00 AM'
        }
        return 'Formatted Date'
      })

      renderComponent(baseClaimDetails)

      const appointmentText = t('travelPay.claimDetails.information.appointmentDate', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      expect(screen.getByText(appointmentText)).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing facility name gracefully', () => {
      const claimWithEmptyFacility = {
        ...baseClaimDetails,
        facilityName: '',
      }

      renderComponent(claimWithEmptyFacility)

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
  })

  describe('Date Edge Cases', () => {
    it('should handle same created and modified dates', () => {
      const claimWithSameDates = {
        ...baseClaimDetails,
        claimStatus: 'Incomplete',
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

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })
      const updatedText = t('travelPay.claimDetails.information.updatedOn', {
        date: 'Friday, December 1, 2023',
        time: '10:00 AM',
      })

      expect(screen.getByText(createdText)).toBeTruthy()
      expect(screen.getByText(updatedText)).toBeTruthy()
    })

    it('should handle invalid date strings gracefully for Created On when status allows', () => {
      const claimWithInvalidDates = {
        ...baseClaimDetails,
        claimStatus: 'Saved',
        createdOn: 'invalid-date',
        modifiedOn: 'also-invalid',
      }

      mockGetFormattedDate.mockReturnValue('Invalid Date')

      renderComponent(claimWithInvalidDates)

      const createdText = t('travelPay.claimDetails.information.createdOn', {
        date: 'Invalid Date',
        time: 'Invalid Date',
      })
      expect(screen.getByText(createdText)).toBeTruthy()
    })
  })
})
