import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { GetTravelPayClaimDetailsResponse, TravelPayClaimDetails, TravelPayClaimDocument } from 'api/types'
import TravelPayClaimDetailsScreen from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimDetailsScreen'
import { RenderParams, context, mockNavProps, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

// Mock the API hook
const mockUseTravelPayClaimDetails = jest.fn()
jest.mock('api/travelPay', () => ({
  useTravelPayClaimDetails: (...args: unknown[]) => mockUseTravelPayClaimDetails(...args),
}))

// Mock navigation
const mockNavigationSpy = jest.fn()
const mockGoBack = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

// Mock remote config
jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

// Mock analytics
jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
  setAnalyticsUserProperty: jest.fn(),
}))

// Mock environment variables
jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT:
      'https://www.va.gov/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/',
  })),
}))

// Mock haptic feedback
jest.mock('react-native-haptic-feedback', () => ({
  __esModule: true,
  default: {
    trigger: jest.fn(),
  },
  HapticFeedbackTypes: {
    notificationError: 'notificationError',
    notificationWarning: 'notificationWarning',
    impactHeavy: 'impactHeavy',
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    selection: 'selection',
  },
}))

// Mock haptics
jest.mock('utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}))

// Test Data
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

const mockRegularDocument: TravelPayClaimDocument = {
  documentId: 'regular-doc-id',
  filename: 'mileage_receipt.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

const createMockResponse = (claimDetails: TravelPayClaimDetails): GetTravelPayClaimDetailsResponse => ({
  data: {
    id: claimDetails.id,
    type: 'travelPayClaimDetails',
    attributes: claimDetails,
  },
})

const mockFeatureEnabled = featureEnabled as jest.Mock

context('TravelPayClaimDetailsScreen', () => {
  const initializeTestInstance = (claimId = 'test-claim-id', renderParams?: RenderParams) => {
    const props = mockNavProps(
      undefined,
      {
        setOptions: jest.fn(),
        navigate: mockNavigationSpy,
        goBack: mockGoBack,
      },
      {
        params: {
          claimId,
        },
      },
    )

    render(<TravelPayClaimDetailsScreen {...props} />, renderParams)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFeatureEnabled.mockReturnValue(true)
  })

  describe('Loading State', () => {
    it('should show loading component when data is being fetched', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: null,
        isFetching: true,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByText(t('travelPay.claimDetails.loading'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.title'))).toBeTruthy() // Back button
    })

    it('should show help button in loading state', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: null,
        isFetching: true,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      const helpButton = screen.getByTestId('travelPayClaimDetailsHelpID')
      expect(helpButton).toBeTruthy()

      fireEvent.press(helpButton)
      expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen', { fromClaimDetails: true })
    })
  })

  describe('Error State', () => {
    it('should show error component when API call fails', () => {
      const mockError = new Error('API Error')
      const mockRefetch = jest.fn()

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: mockError,
        isFetching: false,
        refetch: mockRefetch,
      })

      initializeTestInstance()

      expect(screen.getByText(t('errors.callHelpCenter.sorry'))).toBeTruthy()
      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()

      // Note: For this screen ID, ErrorComponent renders CallHelpCenter without onTryAgain,
      // so no refresh button is rendered. The error is handled by the generic error flow.
    })
  })

  describe('No Data State', () => {
    it('should show error component when claim details are not available', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should render the screen container
      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()

      // Should show error component when data is undefined (treated as an error)
      expect(
        screen.getByText("We're sorry. Something went wrong on our end. Refresh this screen or try again later."),
      ).toBeTruthy()

      // Should not render any claim details components
      expect(screen.queryByText(baseClaimDetails.claimNumber, { exact: false })).toBeFalsy()
    })
  })

  describe('Success State - Data Display', () => {
    it('should render claim details with all components when data is available', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()
      expect(screen.queryByText(baseClaimDetails.claimNumber, { exact: false })).toBeTruthy()
      expect(screen.queryByText(baseClaimDetails.facilityName, { exact: false })).toBeTruthy()
    })

    it('should handle back navigation correctly', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      const backButton = screen.getByText(t('travelPay.title'))
      fireEvent.press(backButton)
      expect(mockGoBack).toHaveBeenCalled()
    })
  })

  describe('Document Handling', () => {
    it('should show decision letter download when documents include decision letters', () => {
      const claimWithDecisionLetter = {
        ...baseClaimDetails,
        documents: [mockDecisionLetter, mockRegularDocument],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithDecisionLetter),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should filter and show decision letter
      expect(screen.getByText(t('travelPay.claimDetails.document.decisionLetter'))).toBeTruthy()
    })

    it('should show rejection letter download when documents include rejection letters', () => {
      const claimWithRejectionLetter = {
        ...baseClaimDetails,
        documents: [mockRejectionLetter, mockRegularDocument],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithRejectionLetter),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should filter and show rejection letter
      expect(screen.getByText(t('travelPay.claimDetails.document.decisionLetter'))).toBeTruthy()
    })

    it('should not show document section when no decision/rejection letters are present', () => {
      const claimWithOnlyRegularDocs = {
        ...baseClaimDetails,
        documents: [mockRegularDocument],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithOnlyRegularDocs),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should not show decision letter section
      expect(screen.queryByText(t('travelPay.claimDetails.document.decisionLetter'))).toBeFalsy()
    })

    it('should handle empty documents array', () => {
      const claimWithNoDocuments = {
        ...baseClaimDetails,
        documents: [],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithNoDocuments),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.queryByText(t('travelPay.claimDetails.document.decisionLetter'))).toBeFalsy()
    })
  })

  describe('Different Claim Statuses', () => {
    const testStatuses = [
      'In manual review',
      'Claim submitted',
      'In process',
      'Denied',
      'Partial payment',
      'Paid',
      'Incomplete',
      'Saved',
    ]

    testStatuses.forEach((status) => {
      it(`should render correctly for claim status: ${status}`, () => {
        const claimWithStatus = {
          ...baseClaimDetails,
          claimStatus: status,
        }

        mockUseTravelPayClaimDetails.mockReturnValue({
          data: createMockResponse(claimWithStatus),
          error: null,
          isFetching: false,
          refetch: jest.fn(),
        })

        initializeTestInstance()

        expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()
        // The status should be handled by child components
      })
    })
  })

  describe('Component Integration', () => {
    it('should render all required child components', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()

      // Should render TravelPayClaimHeader component
      expect(screen.getByTestId('travelPayClaimHeader')).toBeTruthy()

      // Should render TravelPayClaimStatusDefinition component
      expect(screen.getByTestId('travelPayClaimStatusDefinitionTestID')).toBeTruthy()

      // Should render TravelPayClaimAmount component (when amounts > 0)
      expect(screen.getByTestId('travelPayClaimAmountTitleTestID')).toBeTruthy()
    })

    it('should render document download section when documents are present', () => {
      const claimWithDocuments = {
        ...baseClaimDetails,
        documents: [
          {
            documentId: 'doc1',
            filename: 'Decision Letter.pdf',
            mimetype: 'application/pdf',
            createdon: '2023-12-01T10:00:00.000Z',
          },
        ],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithDocuments),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()

      // Should render TravelPayDocumentDownload for decision/rejection letters
      expect(screen.getByText(t('travelPay.claimDetails.document.decisionLetter'))).toBeTruthy()
    })

    it('should conditionally render appeals section for denied claims', () => {
      const deniedClaim = {
        ...baseClaimDetails,
        claimStatus: 'Denied',
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(deniedClaim),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()

      // Should render TravelPayClaimAppeals component for denied claims
      expect(screen.getByText('Appealing a claim decision')).toBeTruthy()
    })

    it('should pass correct props to child components', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Verify that child components receive the correct claim details data
      expect(screen.queryByText(baseClaimDetails.claimNumber, { exact: false })).toBeTruthy()
      expect(screen.queryByText(baseClaimDetails.facilityName, { exact: false })).toBeTruthy()
      expect(screen.queryByText(baseClaimDetails.claimStatus, { exact: false })).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper accessibility setup', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      const screen_element = screen.getByTestId('TravelPayClaimDetailsScreen')
      expect(screen_element).toBeTruthy()
    })

    it('should have accessible help button', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      const helpButton = screen.getByTestId('travelPayClaimDetailsHelpID')
      expect(helpButton).toBeTruthy()
      expect(screen.getByText(t('help'))).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle malformed data gracefully', () => {
      const malformedResponse = {
        data: {
          id: 'test-id',
          type: 'travelPayClaimDetails',
          attributes: {
            ...baseClaimDetails,
            appointmentDate: null, // Missing required field
            documents: null, // Null instead of array
          },
        },
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: malformedResponse,
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should still render the main component
      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()
    })

    it('should handle missing optional fields', () => {
      const claimWithMissingFields = {
        ...baseClaimDetails,
        claimantMiddleName: '',
        rejectionReason: undefined,
        documents: [],
      }

      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(claimWithMissingFields),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()
    })

    it('should handle empty claim ID', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance('')

      // Should show error component when claim ID is empty and no data returned
      expect(screen.getByTestId('TravelPayClaimDetailsScreen')).toBeTruthy()
      expect(
        screen.getByText("We're sorry. Something went wrong on our end. Refresh this screen or try again later."),
      ).toBeTruthy()
      expect(screen.queryByText(baseClaimDetails.claimNumber, { exact: false })).toBeFalsy()
    })
  })

  describe('Direct Deposit Section', () => {
    beforeEach(() => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })
    })

    it('should render direct deposit section with all elements', () => {
      initializeTestInstance()

      // Should show section with testID
      expect(screen.getByTestId('travelPayDirectDepositInfo')).toBeTruthy()

      // Should show link
      expect(screen.getByTestId('travelPayDirectDepositLinkTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.directDeposit.link.text'))).toBeTruthy()
    })

    it('should not crash when direct deposit link is pressed', () => {
      initializeTestInstance()

      const link = screen.getByTestId('travelPayDirectDepositLinkTestID')
      expect(() => fireEvent.press(link)).not.toThrow()
    })

    it('should render direct deposit section for all claim statuses', () => {
      const testStatuses = ['In manual review', 'Denied', 'Partial payment', 'Claim paid', 'In process']

      testStatuses.forEach((status) => {
        const claimWithStatus = {
          ...baseClaimDetails,
          claimStatus: status,
        }

        mockUseTravelPayClaimDetails.mockReturnValue({
          data: createMockResponse(claimWithStatus),
          error: null,
          isFetching: false,
          refetch: jest.fn(),
        })

        initializeTestInstance()

        expect(screen.getByTestId('travelPayDirectDepositInfo')).toBeTruthy()
        expect(screen.getByText(t('travelPay.claimDetails.directDeposit.title'))).toBeTruthy()

        screen.unmount()
      })
    })
  })

  describe('API Hook Integration', () => {
    it('should call useTravelPayClaimDetails with correct parameters', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      const testClaimId = 'test-claim-123'
      initializeTestInstance(testClaimId)

      expect(mockUseTravelPayClaimDetails).toHaveBeenCalledWith(testClaimId)
    })

    it('should handle API hook error states', () => {
      const mockError = new Error('Network error')
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: mockError,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      // Should show error component with correct screen ID
      expect(screen.getByText(t('errors.callHelpCenter.sorry'))).toBeTruthy()
    })
  })

  describe('Navigation Integration', () => {
    it('should navigate to help screen with correct parameters', () => {
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: createMockResponse(baseClaimDetails),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      const helpButton = screen.getByTestId('travelPayClaimDetailsHelpID')
      fireEvent.press(helpButton)

      expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen', {
        fromClaimDetails: true,
      })
    })

    it('should handle back navigation in all states', () => {
      // Test back navigation in loading state
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: null,
        isFetching: true,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      let backButton = screen.getByText(t('travelPay.title'))
      fireEvent.press(backButton)
      expect(mockGoBack).toHaveBeenCalledTimes(1)

      // Test back navigation in error state
      mockGoBack.mockClear()
      mockUseTravelPayClaimDetails.mockReturnValue({
        data: undefined,
        error: new Error('Test error'),
        isFetching: false,
        refetch: jest.fn(),
      })

      initializeTestInstance()

      backButton = screen.getByText(t('travelPay.title'))
      fireEvent.press(backButton)
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })
})
