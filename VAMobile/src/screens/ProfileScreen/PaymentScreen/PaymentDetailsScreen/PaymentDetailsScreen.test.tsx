import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithText, mockNavProps, render, RenderAPI } from 'testUtils'
import { initialAuthState, initialPaymentsState } from 'store/slices'
import { TextView } from 'components'
import PaymentDetailsScreen from './PaymentDetailsScreen'

context('PaymentDetailsScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (pId: string = '1') => {
    props = mockNavProps(undefined, undefined, { params: { paymentID: pId } })

    component = render(<PaymentDetailsScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        payments: {
          ...initialPaymentsState,
          paymentsById: {
            '1': {
              id: '1',
              type: 'paymentHistoryInformation',
              attributes: {
                date: '2021-02-01T00:00:00.000-07:00',
                amount: '$3,746.20',
                paymentType: 'Compensation & Pension - Recurring',
                paymentMethod: 'Direct Deposit',
                bank: 'BANK OF AMERICA, N.A.',
                account: '********0567',
              },
            },
            '2': {
              id: '2',
              type: 'paymentHistoryInformation',
              attributes: {
                date: '2021-02-01T00:00:00.000-07:00',
                amount: '$3,746.20',
                paymentType: 'Compensation & Pension - Recurring',
                paymentMethod: 'Paper Check',
                bank: null,
                account: null,
              },
            },
          },
        },
      },
    })
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when showing payment info', () => {
    it('should show payment details information when direct deposit', async () => {
      initializeTestInstance()
      expect(findByTypeWithText(testInstance, TextView, 'February 1, 2021')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Compensation & Pension - Recurring')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Amount')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '$3,746.20')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Method')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Direct Deposit')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Bank')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'BANK OF AMERICA, N.A.')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Account')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '********0567')).toBeTruthy()
    })

    it('should show payment details information when paper check', async () => {
      initializeTestInstance('2')
      expect(findByTypeWithText(testInstance, TextView, 'February 1, 2021')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Compensation & Pension - Recurring')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Amount')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '$3,746.20')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Method')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Paper Check')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Bank')).toBeFalsy()
      expect(findByTypeWithText(testInstance, TextView, 'Account')).toBeFalsy()
    })
  })
})
