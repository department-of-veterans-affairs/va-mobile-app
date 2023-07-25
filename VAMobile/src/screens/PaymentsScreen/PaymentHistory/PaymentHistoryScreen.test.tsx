import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithText, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'
import { ErrorsState, initialAuthState, initialErrorsState, initializeErrorsByScreenID, initialPaymentsState } from 'store/slices'
import { DefaultList, ErrorComponent, LoadingComponent, TextView, VAModalPicker } from 'components'
import PaymentHistoryScreen from './PaymentHistoryScreen'
import NoPaymentsScreen from './NoPayments/NoPaymentsScreen'
import { ScreenIDTypesConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateToPaymentMissingSpy: jest.Mock
  let navigatePaymentDetailsSpy: jest.Mock

  const initializeTestInstance = (loading = false, availableYears?: Array<string>, errorState: ErrorsState = initialErrorsState) => {
    navigateToPaymentMissingSpy = jest.fn()
    navigatePaymentDetailsSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('PaymentMissing')
      .mockReturnValue(navigateToPaymentMissingSpy)
      .calledWith('PaymentDetails', {
        paymentID: '2',
      })
      .mockReturnValue(navigatePaymentDetailsSpy)

    component = render(<PaymentHistoryScreen {...mockNavProps()} />, {
      preloadedState: {
        auth: { ...initialAuthState },
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
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when user has payments', () => {
    it('should show page content', async () => {
      const links = testInstance.findByProps({ accessibilityRole: 'link' })
      expect(links.findByType(TextView).props.children).toBe("What if I'm missing a payment?")

      expect(testInstance.findByType(VAModalPicker)).toBeTruthy()

      expect(findByTypeWithText(testInstance, TextView, 'January 1, 2021')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Compensation & Pension - Recurring')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '$3,746.20')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Post-9/11 GI Bill')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '$1,172.60')).toBeTruthy()
      expect(testInstance.findAllByType(DefaultList)).toHaveLength(1)
    })
  })

  describe('when user has no payments', () => {
    it('should show empty state screen', async () => {
      initializeTestInstance(false, [])
      expect(testInstance.findByType(NoPaymentsScreen)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PAYMENTS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findByType(ErrorComponent)).toBeTruthy()
    })
  })

  describe('when user clicks the missing payment link', () => {
    it('should navigate to Payment Missing Screen', async () => {
      const links = testInstance.findByProps({ accessibilityRole: 'link' })
      links.props.onPress()
      await waitFor(() => {
        expect(navigateToPaymentMissingSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when user clicks on a payment button', () => {
    it('should navigate to Payment Missing Screen', async () => {
      const link = testInstance.findByProps({ accessibilityLabel: 'Post-9/11 GI Bill $1,172.60' })
      link.props.onPress()
      await waitFor(() => {
        expect(navigatePaymentDetailsSpy).toHaveBeenCalled()
      })
    })
  })
})
