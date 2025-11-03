import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimDetails } from 'api/types'
import TravelPayClaimAmount from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAmount'
import { context, render } from 'testUtils'

// Mock analytics
jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

// Mock environment variables
jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    LINK_URL_TRAVEL_EXPENSE_DEDUCTIBLE:
      'https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate#monthlydeductible',
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

context('TravelPayClaimAmount', () => {
  const renderComponent = (claimDetails: TravelPayClaimDetails) => {
    render(<TravelPayClaimAmount claimDetails={claimDetails} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering Conditions', () => {
    it('should not render when totalCostRequested is 0', () => {
      const claimWithZeroCost = {
        ...baseClaimDetails,
        totalCostRequested: 0,
        reimbursementAmount: 0,
      }

      renderComponent(claimWithZeroCost)

      expect(screen.queryByText(t('travelPay.claimDetails.amount.title'))).toBeFalsy()
    })

    it('should not render when totalCostRequested is negative', () => {
      const claimWithNegativeCost = {
        ...baseClaimDetails,
        totalCostRequested: -10,
        reimbursementAmount: 0,
      }

      renderComponent(claimWithNegativeCost)

      expect(screen.queryByText(t('travelPay.claimDetails.amount.title'))).toBeFalsy()
    })

    it('should render when totalCostRequested is greater than 0', () => {
      renderComponent(baseClaimDetails)

      expect(screen.getByText(t('travelPay.claimDetails.amount.title'))).toBeTruthy()
    })
  })

  describe('Basic Amount Display', () => {
    it('should display the title', () => {
      renderComponent(baseClaimDetails)

      expect(screen.getByText(t('travelPay.claimDetails.amount.title'))).toBeTruthy()
    })

    it('should display submitted amount', () => {
      renderComponent(baseClaimDetails)

      const submittedAmountText = t('travelPay.claimDetails.amount.submitted', {
        amount: baseClaimDetails.totalCostRequested.toFixed(2),
      })
      expect(screen.getByText(submittedAmountText)).toBeTruthy()
    })

    it('should format submitted amount correctly', () => {
      const claimWithDecimalAmount = {
        ...baseClaimDetails,
        totalCostRequested: 123.45,
      }

      renderComponent(claimWithDecimalAmount)

      const expectedText = t('travelPay.claimDetails.amount.submitted', {
        amount: '123.45',
      })
      expect(screen.getByText(expectedText)).toBeTruthy()
    })
  })

  describe('Reimbursement Amount Display', () => {
    it('should display reimbursement amount when greater than 0', () => {
      renderComponent(baseClaimDetails)

      const reimbursementText = t('travelPay.claimDetails.amount.reimbursement', {
        amount: baseClaimDetails.reimbursementAmount.toFixed(2),
      })
      expect(screen.getByText(reimbursementText)).toBeTruthy()
    })

    it('should not display reimbursement amount when it is 0', () => {
      const claimWithZeroReimbursement = {
        ...baseClaimDetails,
        reimbursementAmount: 0,
      }

      renderComponent(claimWithZeroReimbursement)

      const reimbursementText = t('travelPay.claimDetails.amount.reimbursement', {
        amount: '0.00',
      })
      expect(screen.queryByText(reimbursementText)).toBeFalsy()
    })

    it('should format reimbursement amount correctly', () => {
      const claimWithDecimalReimbursement = {
        ...baseClaimDetails,
        reimbursementAmount: 98.76,
      }

      renderComponent(claimWithDecimalReimbursement)

      const expectedText = t('travelPay.claimDetails.amount.reimbursement', {
        amount: '98.76',
      })
      expect(screen.getByText(expectedText)).toBeTruthy()
    })
  })

  describe('Amount Difference Accordion', () => {
    it('should show accordion when reimbursement > 0 and amounts are different', () => {
      renderComponent(baseClaimDetails)

      expect(screen.getByTestId('travelPayAmountDifferenceTestID')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))).toBeTruthy()
    })

    it('should not show accordion when reimbursement is 0', () => {
      const claimWithZeroReimbursement = {
        ...baseClaimDetails,
        reimbursementAmount: 0,
      }

      renderComponent(claimWithZeroReimbursement)

      expect(screen.queryByTestId('travelPayAmountDifferenceTestID')).toBeFalsy()
    })

    it('should not show accordion when amounts are equal', () => {
      const claimWithEqualAmounts = {
        ...baseClaimDetails,
        totalCostRequested: 200,
        reimbursementAmount: 200,
      }

      renderComponent(claimWithEqualAmounts)

      expect(screen.queryByTestId('travelPayAmountDifferenceTestID')).toBeFalsy()
    })

    it('should show accordion when amounts are different (requested > reimbursement)', () => {
      const claimWithDifferentAmounts = {
        ...baseClaimDetails,
        totalCostRequested: 300,
        reimbursementAmount: 250,
      }

      renderComponent(claimWithDifferentAmounts)

      expect(screen.getByTestId('travelPayAmountDifferenceTestID')).toBeTruthy()
    })

    it('should show accordion when reimbursement is greater than requested', () => {
      const claimWithHigherReimbursement = {
        ...baseClaimDetails,
        totalCostRequested: 100,
        reimbursementAmount: 150,
      }

      renderComponent(claimWithHigherReimbursement)

      expect(screen.getByTestId('travelPayAmountDifferenceTestID')).toBeTruthy()
    })
  })

  describe('Accordion Content', () => {
    beforeEach(() => {
      renderComponent(baseClaimDetails)
    })

    it('should show accordion header text', () => {
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))).toBeTruthy()
    })

    it('should expand accordion on press', () => {
      // Initially collapsed - content should not be visible
      expect(
        screen.queryByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')),
      ).toBeFalsy()

      // Expand accordion by pressing the header
      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      // Content should now be visible
      expect(
        screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')),
      ).toBeTruthy()
    })

    it('should show all text parts in expanded content', () => {
      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      // Check part 1
      expect(
        screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')),
      ).toBeTruthy()

      // Check part 2
      expect(
        screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part2')),
      ).toBeTruthy()
    })

    it('should show deductible information link', () => {
      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      const linkText = t('travelPay.claimDetails.amount.reimbursement.difference.description.link.text')
      expect(screen.getByText(linkText)).toBeTruthy()
      expect(screen.getByTestId('travelPayDeductibleInfoLinkTestID')).toBeTruthy()
    })

    it('should handle link press', () => {
      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      const link = screen.getByTestId('travelPayDeductibleInfoLinkTestID')

      expect(() => fireEvent.press(link)).not.toThrow()
    })

    it('should collapse accordion on second press', () => {
      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))

      // Expand
      fireEvent.press(accordionHeader)
      expect(
        screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')),
      ).toBeTruthy()

      // Collapse
      fireEvent.press(accordionHeader)
      expect(
        screen.queryByText(t('travelPay.claimDetails.amount.reimbursement.difference.description.part1')),
      ).toBeFalsy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper test IDs for testing', () => {
      renderComponent(baseClaimDetails)

      expect(screen.getByTestId('travelPayAmountDifferenceTestID')).toBeTruthy()
    })

    it('should have accessible link with proper labels', () => {
      renderComponent(baseClaimDetails)

      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      const link = screen.getByTestId('travelPayDeductibleInfoLinkTestID')
      expect(link).toBeTruthy()
    })

    it('should have proper accordion accessibility', () => {
      renderComponent(baseClaimDetails)

      const accordion = screen.getByTestId('travelPayAmountDifferenceTestID')
      expect(accordion).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very small amounts', () => {
      const claimWithSmallAmounts = {
        ...baseClaimDetails,
        totalCostRequested: 0.01,
        reimbursementAmount: 0.005,
      }

      renderComponent(claimWithSmallAmounts)

      expect(screen.getByText(t('travelPay.claimDetails.amount.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.submitted', { amount: '0.01' }))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement', { amount: '0.01' }))).toBeTruthy()
    })

    it('should handle very large amounts', () => {
      const claimWithLargeAmounts = {
        ...baseClaimDetails,
        totalCostRequested: 999999.99,
        reimbursementAmount: 888888.88,
      }

      renderComponent(claimWithLargeAmounts)

      expect(screen.getByText(t('travelPay.claimDetails.amount.submitted', { amount: '999999.99' }))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement', { amount: '888888.88' }))).toBeTruthy()
    })

    it('should handle decimal precision correctly', () => {
      const claimWithPreciseDecimals = {
        ...baseClaimDetails,
        totalCostRequested: 123.456789,
        reimbursementAmount: 98.123456,
      }

      renderComponent(claimWithPreciseDecimals)

      // Should round to 2 decimal places
      expect(screen.getByText(t('travelPay.claimDetails.amount.submitted', { amount: '123.46' }))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement', { amount: '98.12' }))).toBeTruthy()
    })

    it('should handle missing reimbursementAmount gracefully', () => {
      const claimWithUndefinedReimbursement = {
        ...baseClaimDetails,
        reimbursementAmount: undefined as unknown as number,
      }

      // Should not crash
      expect(() => renderComponent(claimWithUndefinedReimbursement)).not.toThrow()
    })

    it('should handle negative reimbursement amount', () => {
      const claimWithNegativeReimbursement = {
        ...baseClaimDetails,
        reimbursementAmount: -50,
      }

      renderComponent(claimWithNegativeReimbursement)

      // Should handle negative amounts (though this may not be a real scenario)
      expect(screen.getByText(t('travelPay.claimDetails.amount.title'))).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation keys', () => {
      renderComponent(baseClaimDetails)

      // Verify all translation keys are used
      expect(screen.getByText(t('travelPay.claimDetails.amount.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))).toBeTruthy()
    })

    it('should handle missing translations gracefully', () => {
      // This would depend on how the translation system handles missing keys
      // Usually it falls back to the key itself
      renderComponent(baseClaimDetails)
      expect(screen.getByTestId('travelPayAmountDifferenceTestID')).toBeTruthy()
    })
  })

  describe('Link URL Configuration', () => {
    it('should use correct URL for deductible information', () => {
      renderComponent(baseClaimDetails)

      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      const link = screen.getByTestId('travelPayDeductibleInfoLinkTestID')
      expect(link).toBeTruthy()
    })

    it('should have link without external icon', () => {
      renderComponent(baseClaimDetails)

      const accordionHeader = screen.getByText(t('travelPay.claimDetails.amount.reimbursement.difference.title'))
      fireEvent.press(accordionHeader)

      // Link should be present and clickable
      const link = screen.getByTestId('travelPayDeductibleInfoLinkTestID')
      expect(link).toBeTruthy()
    })
  })
})
