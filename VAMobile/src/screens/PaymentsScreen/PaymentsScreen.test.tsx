import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, render } from 'testUtils'

import { ErrorsState, initialAuthorizedServicesState, initialAuthState, initialErrorsState } from 'store/slices'
import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'
import PaymentsScreen from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('PaymentsScreen', () => {
  let navigateToDirectDepositSpy: jest.Mock
  let navigateToHowToUpdateDirectDepositSpy: jest.Mock
  let navigateToPaymentHistorySpy: jest.Mock

  const initializeTestInstance = (
    directDepositBenefits: boolean = false,
    directDepositBenefitsUpdate: boolean = false,
    errorState: ErrorsState = initialErrorsState,
  ): void => {
    navigateToDirectDepositSpy = jest.fn()
    navigateToHowToUpdateDirectDepositSpy = jest.fn()
    navigateToPaymentHistorySpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('DirectDeposit')
      .mockReturnValue(navigateToDirectDepositSpy)
      .calledWith('HowToUpdateDirectDeposit')
      .mockReturnValue(navigateToHowToUpdateDirectDepositSpy)
      .calledWith('PaymentHistory')
      .mockReturnValue(navigateToPaymentHistorySpy)

    render(<PaymentsScreen />, {
      preloadedState: {
        auth: { ...initialAuthState },
        authorizedServices: {
          ...initialAuthorizedServicesState,
          directDepositBenefits,
          directDepositBenefitsUpdate,
        },
        errors: errorState,
      },
    })
  }

  describe('direct deposit', () => {
    describe('when directDepositBenefits is true', () => {
      it('should be shown', async () => {
        initializeTestInstance(true)
        expect(screen.getByLabelText('Payments')).toBeTruthy()
        expect(screen.getByText('VA payment history')).toBeTruthy()
        expect(screen.getByText('Direct deposit information')).toBeTruthy()
      })
    })

    describe('when user has access', () => {
      it('should navigate to PaymentHistory', async () => {
        initializeTestInstance(true, true)
        fireEvent.press(screen.getByText('VA payment history'))
        expect(navigateToPaymentHistorySpy).toHaveBeenCalled()
      })
      it('should navigate to DirectDeposit', async () => {
        initializeTestInstance(true, true)
        fireEvent.press(screen.getByText('Direct deposit information'))
        expect(navigateToDirectDepositSpy).toHaveBeenCalled()
      })
    })

    describe('when user does not have directDepositBenefits', () => {
      it('should navigate to HowToUpdateDirectDeposit', async () => {
        initializeTestInstance(true, false, initialErrorsState)
        fireEvent.press(screen.getByText('Direct deposit information'))
        expect(navigateToHowToUpdateDirectDepositSpy).toHaveBeenCalled()
      })
    })
  })
})
