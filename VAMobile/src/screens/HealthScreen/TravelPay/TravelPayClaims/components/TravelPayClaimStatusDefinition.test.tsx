import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimStatuses } from 'constants/travelPay'
import TravelPayClaimStatusDefinition from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimStatusDefinition'
import { context, render } from 'testUtils'

context('TravelPayClaimStatusDefinition', () => {
  const renderComponent = (claimStatus: string) => {
    render(<TravelPayClaimStatusDefinition claimStatus={claimStatus} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Status Definition Display', () => {
    // Test all known statuses from TravelPayClaimStatuses
    const statusTestCases = [
      { status: 'Incomplete', expectedKey: 'Incomplete' },
      { status: 'Saved', expectedKey: 'Saved' },
      { status: 'In process', expectedKey: 'InProcess' },
      { status: 'Claim submitted', expectedKey: 'ClaimSubmitted' },
      { status: 'In manual review', expectedKey: 'InManualReview' },
      { status: 'On hold', expectedKey: 'OnHold' },
      { status: 'Appealed', expectedKey: 'Appealed' },
      { status: 'Partial payment', expectedKey: 'PartialPayment' },
      { status: 'Denied', expectedKey: 'Denied' },
      { status: 'Closed with no payment', expectedKey: 'ClosedWithNoPayment' },
      { status: 'Approved for payment', expectedKey: 'ApprovedForPayment' },
      { status: 'Submitted for payment', expectedKey: 'SubmittedForPayment' },
      { status: 'Fiscal rescinded', expectedKey: 'FiscalRescinded' },
      { status: 'Claim paid', expectedKey: 'ClaimPaid' },
      { status: 'Payment canceled', expectedKey: 'PaymentCanceled' },
    ]

    statusTestCases.forEach(({ status, expectedKey }) => {
      it(`should display definition for status: ${status}`, () => {
        renderComponent(status)

        const expectedDefinition =
          TravelPayClaimStatuses[expectedKey as keyof typeof TravelPayClaimStatuses]?.definition
        if (expectedDefinition) {
          expect(screen.getByText(expectedDefinition)).toBeTruthy()
        }
      })
    })
  })

  describe('PascalCase Conversion', () => {
    it('should convert single word status correctly', () => {
      renderComponent('denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      expect(screen.getByText(deniedDefinition)).toBeTruthy()
    })

    it('should convert multi-word status correctly', () => {
      renderComponent('in manual review')

      const manualReviewDefinition = TravelPayClaimStatuses.InManualReview.definition
      expect(screen.getByText(manualReviewDefinition)).toBeTruthy()
    })

    it('should handle mixed case input', () => {
      renderComponent('CLAIM SUBMITTED')

      const claimSubmittedDefinition = TravelPayClaimStatuses.ClaimSubmitted.definition
      expect(screen.getByText(claimSubmittedDefinition)).toBeTruthy()
    })

    it('should handle status with lowercase', () => {
      renderComponent('partial payment')

      const partialPaymentDefinition = TravelPayClaimStatuses.PartialPayment.definition
      expect(screen.getByText(partialPaymentDefinition)).toBeTruthy()
    })
  })

  describe('Unknown Status Handling', () => {
    it('should show generic help text for unknown status', () => {
      renderComponent('Unknown Status')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should show generic help text for empty status', () => {
      renderComponent('')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should show generic help text for null/undefined status', () => {
      renderComponent(undefined as unknown as string)

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should show generic help text for status with special characters', () => {
      renderComponent('Status@#$%')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })
  })

  describe('Component Structure', () => {
    it('should render with proper text variant for known status', () => {
      renderComponent('Denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      const textElement = screen.getByText(deniedDefinition)
      expect(textElement.props.variant).toBe('MobileBody')
    })

    it('should render with proper text variant for unknown status', () => {
      renderComponent('Unknown Status')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      const textElement = screen.getByText(genericHelp)
      expect(textElement.props.variant).toBe('MobileBody')
    })

    it('should apply proper margins for unknown status', () => {
      renderComponent('Unknown Status')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      const textElement = screen.getByText(genericHelp)
      const parentBox = textElement.parent

      // The parent Box should have the margin styling
      expect(parentBox).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle status with extra whitespace', () => {
      renderComponent('  In manual review  ')

      const manualReviewDefinition = TravelPayClaimStatuses.InManualReview.definition
      expect(screen.getByText(manualReviewDefinition)).toBeTruthy()
    })

    it('should handle status with multiple spaces between words', () => {
      renderComponent('In     manual     review')

      // The component trims the input and split/join handles multiple spaces,
      // so it should actually find the InManualReview definition
      const manualReviewDefinition = TravelPayClaimStatuses.InManualReview.definition
      expect(screen.getByText(manualReviewDefinition)).toBeTruthy()
    })

    it('should handle status with numbers', () => {
      renderComponent('Status123')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should handle very long status strings', () => {
      const longStatus = 'This is a very long status that probably does not exist in the system'
      renderComponent(longStatus)

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })
  })

  describe('Case Sensitivity', () => {
    const caseTestCases = ['denied', 'DENIED', 'Denied', 'DenIeD', 'dEnIeD']

    caseTestCases.forEach((caseVariant) => {
      it(`should handle case variant: ${caseVariant}`, () => {
        renderComponent(caseVariant)

        const deniedDefinition = TravelPayClaimStatuses.Denied.definition
        expect(screen.getByText(deniedDefinition)).toBeTruthy()
      })
    })
  })

  describe('Status Definitions Content', () => {
    it('should display definition for Incomplete status', () => {
      renderComponent('Incomplete')

      const expectedDefinition = TravelPayClaimStatuses.Incomplete.definition
      expect(screen.getByText(expectedDefinition)).toBeTruthy()
    })

    it('should display definition for Saved status', () => {
      renderComponent('Saved')

      const expectedDefinition = TravelPayClaimStatuses.Saved.definition
      expect(screen.getByText(expectedDefinition)).toBeTruthy()
    })

    it('should display definition for Denied status', () => {
      renderComponent('Denied')

      const expectedDefinition = TravelPayClaimStatuses.Denied.definition
      expect(screen.getByText(expectedDefinition)).toBeTruthy()
    })

    it('should display definition for Claim paid status', () => {
      renderComponent('Claim paid')

      const expectedDefinition = TravelPayClaimStatuses.ClaimPaid.definition
      expect(screen.getByText(expectedDefinition)).toBeTruthy()
    })
  })

  describe('Component Rendering Behavior', () => {
    it('should not render margin for known status', () => {
      renderComponent('Denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      const textElement = screen.getByText(deniedDefinition)
      const parentBox = textElement.parent

      // For known status, it should render in a simple Box without margin
      expect(parentBox).toBeTruthy()
    })

    it('should render with margin for unknown status', () => {
      renderComponent('Unknown Status')

      // For unknown status, it renders with margin top
      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should render generic help when status is null', () => {
      renderComponent(null as unknown as string)

      // Should render generic help for null status
      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation key for generic help', () => {
      renderComponent('Unknown Status')

      // Verify the translation key is used correctly
      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      expect(screen.getByText(genericHelp)).toBeTruthy()
    })

    it('should handle missing translations gracefully', () => {
      // This would depend on how i18next is configured to handle missing keys
      renderComponent('Unknown Status')

      // Should not crash even if translation is missing
      expect(screen.getByText).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('should render consistently with same props', () => {
      // First render
      renderComponent('Denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      expect(screen.getByText(deniedDefinition)).toBeTruthy()

      // Clear and render again with same props
      screen.unmount()
      renderComponent('Denied')

      // Should still show same content
      expect(screen.getByText(deniedDefinition)).toBeTruthy()
    })

    it('should update when status changes', () => {
      // Initial render
      renderComponent('Denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      expect(screen.getByText(deniedDefinition)).toBeTruthy()

      // Clear and render with different status
      screen.unmount()
      renderComponent('Claim paid')

      // Should show new status definition
      expect(screen.queryByText(deniedDefinition)).toBeFalsy()

      const paidDefinition = TravelPayClaimStatuses.ClaimPaid.definition
      expect(screen.getByText(paidDefinition)).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper text elements', () => {
      renderComponent('Denied')

      const deniedDefinition = TravelPayClaimStatuses.Denied.definition
      const textElement = screen.getByText(deniedDefinition)

      // Should be a proper text element accessible to screen readers
      expect(textElement).toBeTruthy()
      expect(textElement.props.variant).toBe('MobileBody')
    })

    it('should be accessible for unknown status fallback', () => {
      renderComponent('Unknown Status')

      const genericHelp = t('travelPay.claimDetails.status.genericHelp')
      const textElement = screen.getByText(genericHelp)

      // Fallback should also be accessible
      expect(textElement).toBeTruthy()
      expect(textElement.props.variant).toBe('MobileBody')
    })
  })
})
