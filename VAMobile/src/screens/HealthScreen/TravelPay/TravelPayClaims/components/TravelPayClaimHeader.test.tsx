import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import TravelPayClaimHeader from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimHeader'
import { context, render } from 'testUtils'
import { getFormattedDateOrTimeWithFormatOption } from 'utils/formattingUtils'

// Mock the formatting utils
jest.mock('utils/formattingUtils', () => ({
  getFormattedDateOrTimeWithFormatOption: jest.fn(),
}))

const mockGetFormattedDate = getFormattedDateOrTimeWithFormatOption as jest.MockedFunction<
  typeof getFormattedDateOrTimeWithFormatOption
>

context('TravelPayClaimHeader', () => {
  const defaultProps = {
    appointmentDate: '2023-12-15T14:30:00.000Z',
    claimNumber: 'TC123456789',
    claimStatus: 'In manual review',
  }

  const renderComponent = (props = defaultProps) => {
    render(<TravelPayClaimHeader {...props} />)
  }

  beforeEach(() => {
    // Mock the formatted date function to return a predictable value
    mockGetFormattedDate.mockReturnValue('Friday, December 15, 2023')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render all required elements', () => {
      renderComponent()

      // Check that all main elements are present by testID
      expect(screen.getByTestId('travelPayClaimHeader')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimHeaderTitle')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimHeaderNumber')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimHeaderStatus')).toBeTruthy()

      // Check that all main elements have correct content
      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      expect(screen.getByText(titleText)).toBeTruthy()

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: defaultProps.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: defaultProps.claimStatus,
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })

    it('should call date formatting function with correct parameters', () => {
      renderComponent()

      expect(mockGetFormattedDate).toHaveBeenCalledWith(defaultProps.appointmentDate, DateTime.DATE_FULL, undefined, {
        weekday: 'long',
      })
    })
  })

  describe('Date Formatting', () => {
    it('should handle different date formats correctly', () => {
      const testCases = [
        {
          input: '2023-01-01T08:00:00.000Z',
          mockOutput: 'Sunday, January 1, 2023',
        },
        {
          input: '2023-12-25T16:45:00.000Z',
          mockOutput: 'Monday, December 25, 2023',
        },
        {
          input: '2024-02-29T12:00:00.000Z', // Leap year
          mockOutput: 'Thursday, February 29, 2024',
        },
      ]

      testCases.forEach(({ input, mockOutput }) => {
        mockGetFormattedDate.mockReturnValue(mockOutput)

        renderComponent({
          ...defaultProps,
          appointmentDate: input,
        })

        const titleText = t('travelPay.claimDetails.header.title', {
          appointmentDate: mockOutput,
        })
        expect(screen.getByText(titleText)).toBeTruthy()
      })
    })

    it('should handle invalid date gracefully', () => {
      mockGetFormattedDate.mockReturnValue('Invalid Date')

      renderComponent({
        ...defaultProps,
        appointmentDate: 'invalid-date',
      })

      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Invalid Date',
      })
      expect(screen.getByText(titleText)).toBeTruthy()
    })
  })

  describe('Claim Number Display', () => {
    it('should display different claim number formats', () => {
      const testClaimNumbers = [
        'TC123456789',
        'TRAVEL-2023-001',
        'ABC-123-XYZ',
        '1234567890',
        '', // Empty claim number
      ]

      testClaimNumbers.forEach((claimNumber) => {
        renderComponent({
          ...defaultProps,
          claimNumber,
        })

        const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
          claimNumber,
        })
        expect(screen.getByText(claimNumberText)).toBeTruthy()
      })
    })

    it('should handle very long claim numbers', () => {
      const longClaimNumber = 'VERY-LONG-CLAIM-NUMBER-THAT-MIGHT-WRAP-123456789'

      renderComponent({
        ...defaultProps,
        claimNumber: longClaimNumber,
      })

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: longClaimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()
    })
  })

  describe('Claim Status Display', () => {
    it('should display different claim statuses', () => {
      const testStatuses = [
        'In manual review',
        'Claim submitted',
        'In process',
        'Denied',
        'Partial payment',
        'Claim paid',
        'Incomplete',
        'Saved',
        'Appealed',
      ]

      testStatuses.forEach((claimStatus) => {
        renderComponent({
          ...defaultProps,
          claimStatus,
        })

        const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
          claimStatus,
        })
        expect(screen.getByText(claimStatusText)).toBeTruthy()
      })
    })

    it('should handle empty or undefined claim status', () => {
      const testCases = ['', undefined, null]

      testCases.forEach((claimStatus) => {
        renderComponent({
          ...defaultProps,
          claimStatus: claimStatus as string,
        })

        const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
          claimStatus: claimStatus || '',
        })
        expect(screen.getByText(claimStatusText)).toBeTruthy()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper accessibility roles', () => {
      renderComponent()

      // Check for accessibility roles
      const headerElements = screen.getAllByRole('header')
      expect(headerElements).toHaveLength(2) // Title and claim number have header roles

      // Verify specific elements have header roles
      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      const titleElement = screen.getByText(titleText)
      expect(titleElement.props.accessibilityRole).toBe('header')

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: defaultProps.claimNumber,
      })
      const claimNumberElement = screen.getByText(claimNumberText)
      expect(claimNumberElement.props.accessibilityRole).toBe('header')
    })

    it('should be accessible with screen readers', () => {
      renderComponent()

      // All text elements should be accessible by default
      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      expect(screen.getByText(titleText)).toBeTruthy()

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: defaultProps.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: defaultProps.claimStatus,
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation keys', () => {
      renderComponent()

      // Verify that the translation function is called with correct keys
      // The actual translation content is tested by verifying the rendered text
      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      expect(screen.getByText(titleText)).toBeTruthy()

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: defaultProps.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: defaultProps.claimStatus,
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })

    it('should handle translation interpolation correctly', () => {
      const customProps = {
        appointmentDate: '2024-03-20T10:15:00.000Z',
        claimNumber: 'CUSTOM-123',
        claimStatus: 'Custom Status',
      }

      mockGetFormattedDate.mockReturnValue('Wednesday, March 20, 2024')
      renderComponent(customProps)

      // Check that interpolated values are correctly inserted
      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Wednesday, March 20, 2024',
      })
      expect(screen.getByText(titleText)).toBeTruthy()

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: 'CUSTOM-123',
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: 'Custom Status',
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })
  })

  describe('Visual Hierarchy', () => {
    it('should use appropriate text variants for hierarchy', () => {
      renderComponent()

      const titleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      const titleElement = screen.getByText(titleText)
      expect(titleElement.props.variant).toBe('MobileBody')

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: defaultProps.claimNumber,
      })
      const claimNumberElement = screen.getByText(claimNumberText)
      expect(claimNumberElement.props.variant).toBe('MobileBodyBold')

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: defaultProps.claimStatus,
      })
      const claimStatusElement = screen.getByText(claimStatusText)
      expect(claimStatusElement.props.variant).toBe('MobileBodyBold')
    })

    it('should apply correct styling props', () => {
      renderComponent()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: defaultProps.claimStatus,
      })
      const claimStatusElement = screen.getByText(claimStatusText)
      expect(claimStatusElement.props.color).toBe('bodyText')
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in props', () => {
      const propsWithSpecialChars = {
        appointmentDate: '2023-12-15T14:30:00.000Z',
        claimNumber: 'TC-123&456@789#',
        claimStatus: 'Status with "quotes" & symbols',
      }

      renderComponent(propsWithSpecialChars)

      const claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: propsWithSpecialChars.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: propsWithSpecialChars.claimStatus,
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })

    it('should handle different timezone dates', () => {
      const timezoneDates = [
        '2023-12-15T14:30:00.000Z', // UTC
        '2023-12-15T14:30:00-05:00', // EST
        '2023-12-15T14:30:00+09:00', // JST
      ]

      timezoneDates.forEach((dateString) => {
        mockGetFormattedDate.mockReturnValue('Friday, December 15, 2023')

        renderComponent({
          ...defaultProps,
          appointmentDate: dateString,
        })

        expect(mockGetFormattedDate).toHaveBeenCalledWith(dateString, DateTime.DATE_FULL, undefined, {
          weekday: 'long',
        })
      })
    })
  })

  describe('Component Stability', () => {
    it('should render consistently with same props', () => {
      // First render
      renderComponent(defaultProps)

      const initialTitleText = t('travelPay.claimDetails.header.title', {
        appointmentDate: 'Friday, December 15, 2023',
      })
      expect(screen.getByText(initialTitleText)).toBeTruthy()

      // Clear screen and render again with same props
      screen.unmount()
      renderComponent(defaultProps)

      // Should still show same content
      expect(screen.getByText(initialTitleText)).toBeTruthy()
    })

    it('should render correctly with different props', () => {
      const initialProps = defaultProps
      const updatedProps = {
        ...defaultProps,
        claimNumber: 'NEW-CLAIM-123',
        claimStatus: 'Updated Status',
      }

      // Initial render
      renderComponent(initialProps)
      let claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: initialProps.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      // Clear and render with updated props
      screen.unmount()
      renderComponent(updatedProps)

      // Should show updated content
      claimNumberText = t('travelPay.claimDetails.header.claimNumber', {
        claimNumber: updatedProps.claimNumber,
      })
      expect(screen.getByText(claimNumberText)).toBeTruthy()

      const claimStatusText = t('travelPay.claimDetails.header.claimStatus', {
        claimStatus: updatedProps.claimStatus,
      })
      expect(screen.getByText(claimStatusText)).toBeTruthy()
    })
  })
})
