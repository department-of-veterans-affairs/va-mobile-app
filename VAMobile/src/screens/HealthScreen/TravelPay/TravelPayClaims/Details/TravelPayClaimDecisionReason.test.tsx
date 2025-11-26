import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import TravelPayClaimDecisionReason from 'screens/HealthScreen/TravelPay/TravelPayClaims/Details/TravelPayClaimDecisionReason'
import { context, render } from 'testUtils'

// Test data
const mockDecisionLetterReason =
  'You are a Service Connected Veteran with a rating of less than 30%, with income above the established low-income threshold or not on file to determine if a low-income status exists.'

context('TravelPayClaimDecisionReason', () => {
  const renderComponent = (claimStatus: string, decisionLetterReason: string = mockDecisionLetterReason) => {
    render(<TravelPayClaimDecisionReason claimStatus={claimStatus} decisionLetterReason={decisionLetterReason} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render for denied claims with correct title', () => {
      renderComponent('Denied')

      expect(screen.getByTestId('travelPayClaimDecisionReasonTitleTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimDecisionReasonDescriptionTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeTruthy()
      expect(screen.getByText(mockDecisionLetterReason)).toBeTruthy()
    })

    it('should render for partial payment claims with correct title', () => {
      renderComponent('Partial payment')

      expect(screen.getByTestId('travelPayClaimDecisionReasonTitleTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimDecisionReasonDescriptionTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.partialPaymentHeader'))).toBeTruthy()
      expect(screen.getByText(mockDecisionLetterReason)).toBeTruthy()
    })
  })

  describe('Different Claim Statuses', () => {
    it('should show denied header for denied status', () => {
      renderComponent('Denied')

      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeTruthy()
      expect(screen.queryByText(t('travelPay.claimDetails.decisionReason.partialPaymentHeader'))).toBeFalsy()
    })

    it('should show partial payment header for partial payment status', () => {
      renderComponent('Partial payment')

      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.partialPaymentHeader'))).toBeTruthy()
      expect(screen.queryByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeFalsy()
    })

    it('should show partial payment header for other statuses (fallback)', () => {
      renderComponent('Some Other Status')

      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.partialPaymentHeader'))).toBeTruthy()
      expect(screen.queryByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeFalsy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation keys', () => {
      renderComponent('Denied')

      // Verify that the translation function is called with correct keys
      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeTruthy()
    })

    it('should use correct translation keys for partial payment', () => {
      renderComponent('Partial payment')

      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.partialPaymentHeader'))).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper testIDs for all elements', () => {
      renderComponent('Denied')

      expect(screen.getByTestId('travelPayClaimDecisionReasonTitleTestID')).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimDecisionReasonDescriptionTestID')).toBeTruthy()
    })

    it('should be accessible to screen readers', () => {
      renderComponent('Denied')

      // All text elements should be accessible by default
      expect(screen.getByText(t('travelPay.claimDetails.decisionReason.deniedHeader'))).toBeTruthy()
      expect(screen.getByText(mockDecisionLetterReason)).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long rejection reason descriptions', () => {
      const longReason =
        'This is a very long rejection reason description that might wrap multiple lines and should be handled gracefully by the component without breaking the layout or causing any accessibility issues for users who need to read this information.'

      renderComponent('Denied', longReason)

      expect(screen.getByText(longReason)).toBeTruthy()
    })

    it('should handle special characters in rejection reason description', () => {
      const specialCharReason = 'Reason with "quotes", & symbols, and (parentheses).'

      renderComponent('Denied', specialCharReason)

      expect(screen.getByText(specialCharReason)).toBeTruthy()
    })
  })

  describe('Component Stability', () => {
    it('should render consistently with same props', () => {
      renderComponent('Denied')

      const initialTitle = t('travelPay.claimDetails.decisionReason.deniedHeader')
      expect(screen.getByText(initialTitle)).toBeTruthy()

      // Clear and render again with same props
      screen.unmount()
      renderComponent('Denied')

      // Should still show same content
      expect(screen.getByText(initialTitle)).toBeTruthy()
      expect(screen.getByText(mockDecisionLetterReason)).toBeTruthy()
    })

    it('should update when claim status changes', () => {
      renderComponent('Denied')

      const deniedTitle = t('travelPay.claimDetails.decisionReason.deniedHeader')
      expect(screen.getByText(deniedTitle)).toBeTruthy()

      // Clear and render with different status
      screen.unmount()
      renderComponent('Partial payment')

      // Should show updated title
      expect(screen.queryByText(deniedTitle)).toBeFalsy()

      const partialTitle = t('travelPay.claimDetails.decisionReason.partialPaymentHeader')
      expect(screen.getByText(partialTitle)).toBeTruthy()
    })
  })
})
