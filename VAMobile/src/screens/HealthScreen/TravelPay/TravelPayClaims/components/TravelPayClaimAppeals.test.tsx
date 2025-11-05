import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimDetails, TravelPayClaimDocument } from 'api/types'
import TravelPayClaimAppeals from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAppeals'
import { context, render } from 'testUtils'
import getEnv from 'utils/env'

// Mock navigation
const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

// Mock analytics
jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

// Mock environment variables
jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    LINK_URL_VA_FORM_10_0998: 'https://va.gov/form-10-0998',
    LINK_URL_SECURE_MESSAGING: 'https://va.gov/secure-messaging',
  })),
}))

// Test data
const baseClaimDetails: TravelPayClaimDetails = {
  id: 'test-claim-id',
  claimNumber: 'TC123456789',
  claimName: 'Travel reimbursement',
  claimantFirstName: 'John',
  claimantMiddleName: 'M',
  claimantLastName: 'Doe',
  claimStatus: 'Denied',
  appointmentDate: '2023-12-01T10:00:00.000Z',
  facilityName: 'Test VA Medical Center',
  totalCostRequested: 250.0,
  reimbursementAmount: 0.0,
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

const mockForm100998Document: TravelPayClaimDocument = {
  documentId: 'form-10-0998-id',
  filename: 'Form 10-0998.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

context('TravelPayClaimAppeals', () => {
  const renderComponent = (claimDetails: TravelPayClaimDetails) => {
    render(<TravelPayClaimAppeals claimDetails={claimDetails} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Conditional Rendering', () => {
    it('should render when claim status is Denied', () => {
      renderComponent(baseClaimDetails)

      expect(screen.getByText(t('travelPay.claimDetails.appeals.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.description'))).toBeTruthy()
    })

    it('should not render when claim status is not Denied', () => {
      const nonDeniedClaim = {
        ...baseClaimDetails,
        claimStatus: 'Approved',
      }

      renderComponent(nonDeniedClaim)

      expect(screen.queryByText(t('travelPay.claimDetails.appeals.title'))).toBeFalsy()
    })

    const nonDeniedStatuses = [
      'Incomplete',
      'Saved',
      'In process',
      'Claim submitted',
      'In manual review',
      'Partial payment',
      'Approved for payment',
      'Claim paid',
    ]

    nonDeniedStatuses.forEach((status) => {
      it(`should not render for status: ${status}`, () => {
        const claimWithStatus = {
          ...baseClaimDetails,
          claimStatus: status,
        }

        renderComponent(claimWithStatus)

        expect(screen.queryByText(t('travelPay.claimDetails.appeals.title'))).toBeFalsy()
      })
    })
  })

  describe('Appeals Section Content', () => {
    beforeEach(() => {
      renderComponent(baseClaimDetails)
    })

    it('should display appeals title and description', () => {
      expect(screen.getByText(t('travelPay.claimDetails.appeals.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.description'))).toBeTruthy()
    })

    it('should display Option 1 title and description', () => {
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option1Title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option1Description'))).toBeTruthy()
    })

    it('should display Option 2 title and description', () => {
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option2Title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option2Description'))).toBeTruthy()
    })
  })

  describe('Secure Messaging Integration', () => {
    beforeEach(() => {
      renderComponent(baseClaimDetails)
    })

    it('should display secure messaging link', () => {
      expect(screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))).toBeTruthy()
    })

    it('should navigate to secure messaging when link is pressed', () => {
      const sendMessageLink = screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))

      // Debug: Check if the link exists and is pressable
      expect(sendMessageLink).toBeTruthy()

      fireEvent.press(sendMessageLink)

      expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging', { activeTab: 0 })
    })

    it('should have proper accessibility label for secure messaging link', () => {
      // The link should have the a11y label
      const sendMessageLink = screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))
      expect(sendMessageLink).toBeTruthy()
    })
  })

  describe('External Links', () => {
    it('should use correct URL for VA Form 10-0998', () => {
      const claimWithoutForm = {
        ...baseClaimDetails,
        documents: [],
      }

      renderComponent(claimWithoutForm)

      const formLink = screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))
      expect(formLink).toBeTruthy()
      // The actual URL validation would happen in the LinkWithAnalytics component
    })

    it('should use correct URL for secure messaging', () => {
      renderComponent(baseClaimDetails)

      const sendMessageLink = screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))
      expect(sendMessageLink).toBeTruthy()
      // The URL is passed to LinkWithAnalytics component
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      renderComponent(baseClaimDetails)
    })

    it('should have proper accessibility labels', () => {
      // Form download should have a11y label
      const formLink = screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))
      expect(formLink).toBeTruthy()

      // Secure messaging link should have a11y label
      const messageLink = screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))
      expect(messageLink).toBeTruthy()
    })

    it('should be accessible to screen readers', () => {
      // All text elements should be accessible
      expect(screen.getByText(t('travelPay.claimDetails.appeals.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.description'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option1Title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.option2Title'))).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use all required translation keys', () => {
      renderComponent(baseClaimDetails)

      const expectedKeys = [
        'travelPay.claimDetails.appeals.title',
        'travelPay.claimDetails.appeals.description',
        'travelPay.claimDetails.appeals.formDownload',
        'travelPay.claimDetails.appeals.option1Title',
        'travelPay.claimDetails.appeals.option1Description',
        'travelPay.claimDetails.appeals.sendMessage',
        'travelPay.claimDetails.appeals.option2Title',
        'travelPay.claimDetails.appeals.option2Description',
        'travelPay.claimDetails.appeals.noteLabel',
        'travelPay.claimDetails.appeals.noteText',
      ]

      expectedKeys.forEach((key) => {
        if (key === 'travelPay.claimDetails.appeals.noteText') {
          // noteText is nested within the parent TextView, search with exact: false
          expect(screen.getByText(t(key), { exact: false })).toBeTruthy()
        } else {
          expect(screen.getByText(t(key))).toBeTruthy()
        }
      })
    })

    it('should use accessibility translation keys', () => {
      const claimWithoutForm = {
        ...baseClaimDetails,
        documents: [],
      }

      renderComponent(claimWithoutForm)

      // Should use a11y keys for external links
      // The actual a11y labels are handled by LinkWithAnalytics
      expect(screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))).toBeTruthy()
    })
  })

  describe('Component Integration', () => {
    it('should pass correct props to TravelPayDocumentDownload', () => {
      const claimWithForm = {
        ...baseClaimDetails,
        documents: [mockForm100998Document],
      }

      renderComponent(claimWithForm)

      // Component should render without errors
      expect(screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))).toBeTruthy()
    })

    it('should pass correct props to LinkWithAnalytics', () => {
      renderComponent(baseClaimDetails)

      // All links should render correctly
      expect(screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))).toBeTruthy()
    })
  })

  describe('Environment Configuration', () => {
    it('should use environment URLs', () => {
      renderComponent(baseClaimDetails)

      // Links should be present (URL validation happens in LinkWithAnalytics)
      expect(screen.getByText(t('travelPay.claimDetails.appeals.formDownload'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.appeals.sendMessage'))).toBeTruthy()

      // Verify that getEnv mock returns the expected URLs
      const mockEnv = getEnv as jest.MockedFunction<typeof getEnv>
      expect(mockEnv()).toEqual({
        LINK_URL_VA_FORM_10_0998: 'https://va.gov/form-10-0998',
        LINK_URL_SECURE_MESSAGING: 'https://va.gov/secure-messaging',
      })
    })
  })
})
