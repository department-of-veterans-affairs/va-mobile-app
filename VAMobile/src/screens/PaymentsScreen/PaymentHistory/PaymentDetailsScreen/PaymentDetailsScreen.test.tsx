import React from 'react'

import { screen } from '@testing-library/react-native'

import { PaymentsData } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { formatDateUtc } from 'utils/formattingUtils'

import PaymentDetailsScreen from './PaymentDetailsScreen'

context('PaymentDetailsScreen', () => {
  const paymentDate = '2021-02-01T00:00:00.000-07:00'
  const formattedDate = formatDateUtc(paymentDate, 'MMMM d, yyyy')

  const payment1: PaymentsData = {
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
  }

  const payment2: PaymentsData = {
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
  }

  const initializeTestInstance = (payment: PaymentsData) => {
    const props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
      },
      { params: { payment: payment } },
    )

    render(<PaymentDetailsScreen {...props} />)
  }

  describe('when showing payment info', () => {
    it('should show payment details information when direct deposit', () => {
      initializeTestInstance(payment1)
      expect(screen.getByText(formattedDate)).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Compensation & Pension - Recurring' })).toBeTruthy()
      expect(screen.getByText('Amount')).toBeTruthy()
      expect(screen.getByText('$3,746.20')).toBeTruthy()
      expect(screen.getByText('Method')).toBeTruthy()
      expect(screen.getByText('Direct Deposit')).toBeTruthy()
      expect(screen.getByText('Bank')).toBeTruthy()
      expect(screen.getByText('BANK OF AMERICA, N.A.')).toBeTruthy()
      expect(screen.getByText('Account')).toBeTruthy()
      expect(screen.getByText('********0567')).toBeTruthy()
    })

    it('should show payment details information when paper check', () => {
      initializeTestInstance(payment2)
      expect(screen.getByText(formattedDate)).toBeTruthy()
      expect(screen.getByRole('header', { name: 'Compensation & Pension - Recurring' })).toBeTruthy()
      expect(screen.getByText('Amount')).toBeTruthy()
      expect(screen.getByText('$3,746.20')).toBeTruthy()
      expect(screen.getByText('Method')).toBeTruthy()
      expect(screen.getByText('Paper Check')).toBeTruthy()
      expect(screen.queryByText('Bank')).toBeNull()
      expect(screen.queryByText('Account')).toBeNull()
    })
  })
})
