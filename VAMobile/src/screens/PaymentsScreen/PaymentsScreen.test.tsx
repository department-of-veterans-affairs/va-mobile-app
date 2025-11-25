import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { useDebts } from 'api/debts'
import { useMedicalCopays } from 'api/medicalCopays'
import PaymentsScreen from 'screens/PaymentsScreen'
import { context, render, when } from 'testUtils'
import { numberToUSDollars } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

jest.mock('api/medicalCopays', () => ({
  useMedicalCopays: jest.fn(() => ({
    summary: { amountDue: 0, count: 0 },
    isLoading: false,
    error: undefined,
  })),
}))

jest.mock('api/debts', () => ({
  useDebts: jest.fn(() => ({
    summary: { amountDue: 0, count: 0 },
    isLoading: false,
    error: undefined,
  })),
}))

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('PaymentsScreen', () => {
  const initializeTestInstance = (authorized = true): void => {
    when(featureEnabled as jest.Mock)
      .calledWith('overpayCopay')
      .mockReturnValue(true)

    render(<PaymentsScreen />, {
      queriesData: [
        {
          queryKey: authorizedServicesKeys.authorizedServices,
          data: {
            appeals: true,
            appointments: true,
            claims: true,
            decisionLetters: true,
            directDepositBenefits: true,
            directDepositBenefitsUpdate: authorized,
            disabilityRating: true,
            lettersAndDocuments: true,
            militaryServiceHistory: true,
            paymentHistory: true,
            preferredName: true,
            prescriptions: true,
            scheduleAppointments: true,
            secureMessaging: true,
            userProfileUpdate: true,
          },
        },
      ],
    })
  }

  describe('when user does not have directDepositBenefits', () => {
    it('should navigate to HowToUpdateDirectDeposit', () => {
      initializeTestInstance(false)
      fireEvent.press(screen.getByRole('link', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('HowToUpdateDirectDeposit')
    })
  })

  describe('when user does have directDepositBenefits', () => {
    it('should navigate to DirectDeposit', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Direct deposit information' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })

  describe('when user click on VA payment history', () => {
    it('should navigate to PaymentHistory', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'VA payment history' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DirectDeposit')
    })
  })

  describe('Subtext data for debts & copay', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('renders subtext when amount & count > 0', () => {
      ;(useMedicalCopays as jest.Mock).mockReturnValue({
        summary: { amountDue: 396.93, count: 6 },
        isLoading: false,
        error: undefined,
      })
      ;(useDebts as jest.Mock).mockReturnValue({
        summary: { amountDue: 347.5, count: 2 },
        isLoading: false,
        error: undefined,
      })

      render(<PaymentsScreen />)

      const copaysTitle = t('copays.title')
      const debtsTitle = t('debts.title')

      const copaysSub = t('copays.activityButton.subText', {
        amount: numberToUSDollars(396.93),
        count: 6,
      })
      const debtsSub = t('debts.activityButton.subText', {
        amount: numberToUSDollars(347.5),
        count: 2,
      })

      expect(screen.getByText(copaysSub)).toBeTruthy()
      expect(screen.getByText(debtsSub)).toBeTruthy()

      expect(screen.getByRole('link', { name: `${copaysTitle} ${copaysSub}` })).toBeTruthy()
      expect(screen.getByRole('link', { name: `${debtsTitle} ${debtsSub}` })).toBeTruthy()
    })

    it('omits subtext when summaries are empty', () => {
      ;(useMedicalCopays as jest.Mock).mockReturnValue({
        summary: { amountDue: 0, count: 0 },
        isLoading: false,
        error: undefined,
      })
      ;(useDebts as jest.Mock).mockReturnValue({
        summary: { amountDue: 0, count: 0 },
        isLoading: false,
        error: undefined,
      })

      render(<PaymentsScreen />)

      const copaysTitle = t('copays.title')
      const debtsTitle = t('debts.title')

      expect(screen.getByRole('link', { name: copaysTitle })).toBeTruthy()
      expect(screen.getByRole('link', { name: debtsTitle })).toBeTruthy()

      expect(screen.queryByText(t('copays.activityButton.subText', { amount: 0, count: 0 }))).toBeNull()
      expect(screen.queryByText(t('debts.activityButton.subText', { amount: 0, count: 0 }))).toBeNull()
    })
  })

  describe('Travel Claims button', () => {
    it('is not displayed if feature toggle is disabled', () => {
      initializeTestInstance()

      expect(screen.queryByTestId('toTravelPayClaimsLinkID')).toBeFalsy()
    })

    it('is displayed if feature toggle is enabled', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)

      initializeTestInstance()

      expect(screen.getByTestId('toTravelPayClaimsLinkID')).toBeTruthy()
    })

    it('navigates to Travel Claims screen when pressed', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)

      initializeTestInstance()

      fireEvent.press(screen.getByTestId('toTravelPayClaimsLinkID'))

      expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitsTab', { screen: 'TravelPayClaims', initial: false })
    })
  })
})
