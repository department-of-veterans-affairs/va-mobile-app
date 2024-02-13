import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { ErrorsState, initialErrorsState, initialPaymentsState, initializeErrorsByScreenID } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import PaymentHistoryScreen from './PaymentHistoryScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
  return {
    ...actual,
    getPayments: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('PaymentHistoryScreen', () => {
  const initializeTestInstance = (
    loading = false,
    availableYears?: Array<string>,
    errorState: ErrorsState = initialErrorsState,
  ) => {
    render(<PaymentHistoryScreen {...mockNavProps()} />, {
      preloadedState: {
        payments: {
          ...initialPaymentsState,
          currentPagePayments: {
            '2021-01-01': [
              {
                id: '1',
                type: 'paymentHistoryInformation',
                attributes: {
                  date: '2021-01-01T00:00:00.000-07:00',
                  amount: '$3,746.20',
                  paymentType: 'Compensation & Pension - Recurring',
                  paymentMethod: 'Direct Deposit',
                  bank: 'BANK OF AMERICA, N.A.',
                  account: '********0567',
                },
              },
              {
                id: '2',
                type: 'paymentHistoryInformation',
                attributes: {
                  date: '2021-01-01T00:00:00.000-06:00',
                  amount: '$1,172.60',
                  paymentType: 'Post-9/11 GI Bill',
                  paymentMethod: 'Direct Deposit',
                  bank: 'BANK OF AMERICA, N.A.',
                  account: '********0567',
                },
              },
            ],
          },
          availableYears: availableYears || ['2021'],
          loading,
        },
        errors: errorState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your payment history...')).toBeTruthy()
    })
  })

  describe('when user has payments', () => {
    it('should show page content', () => {
      expect(screen.getByText("What if I'm missing a payment?")).toBeTruthy()
      expect(screen.getByText('January 1, 2021')).toBeTruthy()
      expect(screen.getByText('Compensation & Pension - Recurring')).toBeTruthy()
      expect(screen.getByText('$3,746.20')).toBeTruthy()
      expect(screen.getByText('Post-9/11 GI Bill')).toBeTruthy()
      expect(screen.getByText('$1,172.60')).toBeTruthy()
    })
  })

  describe('when user has no payments', () => {
    it('should show empty state screen', () => {
      initializeTestInstance(false, [])
      expect(screen.getByText(" We don't have a record of VA payments for you")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PAYMENTS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(false, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })

  describe('when user clicks the missing payment link', () => {
    it('should navigate to Payment Missing Screen', () => {
      fireEvent.press(screen.getByTestId("What if I'm missing a payment?"))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PaymentMissing')
    })
  })

  describe('when user clicks on a payment button', () => {
    it('should navigate to Payment Missing Screen', () => {
      fireEvent.press(screen.getByLabelText('Post-9/11 GI Bill $1,172.60'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PaymentDetails', { paymentID: '2' })
    })
  })
})
