import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { initialAuthState, initialPaymentsState } from 'store/slices'
import PaymentDetailsScreen from './PaymentDetailsScreen'
import { formatDateUtc } from 'utils/formattingUtils'
import { screen } from '@testing-library/react-native'

context('PaymentDetailsScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let paymentDate: string
  let formattedDate: string

  const initializeTestInstance = (pId: string = '1') => {
    props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
      },
      { params: { paymentID: pId } },
    )
    paymentDate = '2021-02-01T00:00:00.000-07:00'
    formattedDate = formatDateUtc(paymentDate, 'MMMM d, yyyy')

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
                date: paymentDate,
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
                date: paymentDate,
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
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when showing payment info', () => {
    it('should show payment details information when direct deposit', async () => {
      initializeTestInstance()
      expect(screen.getByText(formattedDate)).toBeTruthy()
      expect(screen.getByText(formattedDate)).toBeTruthy()
      expect(screen.getByText('Compensation & Pension - Recurring')).toBeTruthy()
      expect(screen.getByText('Amount')).toBeTruthy()
      expect(screen.getByText('$3,746.20')).toBeTruthy()
      expect(screen.getByText('Method')).toBeTruthy()
      expect(screen.getByText('Direct Deposit')).toBeTruthy()
      expect(screen.getByText('Bank')).toBeTruthy()
      expect(screen.getByText('BANK OF AMERICA, N.A.')).toBeTruthy()
      expect(screen.getByText('Account')).toBeTruthy()
      expect(screen.getByText('********0567')).toBeTruthy()
    })

    it('should show payment details information when paper check', async () => {
      initializeTestInstance('2')
      expect(screen.getByText(formattedDate)).toBeTruthy()
      expect(screen.getByText('Compensation & Pension - Recurring')).toBeTruthy()
      expect(screen.getByText('Amount')).toBeTruthy()
      expect(screen.getByText('$3,746.20')).toBeTruthy()
      expect(screen.getByText('Method')).toBeTruthy()
      expect(screen.getByText('Paper Check')).toBeTruthy()
      expect(screen.queryByText('Bank')).toBeNull()
      expect(screen.queryByText('Account')).toBeNull()
    })
  })
})
