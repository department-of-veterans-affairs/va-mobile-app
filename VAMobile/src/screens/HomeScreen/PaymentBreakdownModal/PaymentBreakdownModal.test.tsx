import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { PaymentsGetData } from 'api/types'
import { get } from 'store/api'
import { context, mockNavProps, render } from 'testUtils'
import { when } from 'testUtils'
import { getFormattedDate } from 'utils/formattingUtils'

import PaymentBreakdownModal from './PaymentBreakdownModal'

const PAYMENT_HISTORY_PAYLOAD = {
  data: [
    {
      id: '6137485',
      type: 'payment_history',
      attributes: {
        account: null,
        amount: '$603.33',
        bank: null,
        date: '2024-06-01T00:00:00.000-05:00',
        paymentMethod: 'Paper Check',
        paymentType: 'Regular Chapter 31',
      },
    },
    {
      id: '4396444',
      type: 'payment_history',
      attributes: {
        account: '********0567',
        amount: '$1,172.60',
        bank: 'BANK OF AMERICA, N.A.',
        date: '2024-06-01T00:00:00.000-03:00',
        paymentMethod: 'Direct Deposit',
        paymentType: 'Post-9/11 GI Bill',
      },
    },
    {
      id: '5927090',
      type: 'payment_history',
      attributes: {
        account: null,
        amount: '$603.33',
        bank: null,
        date: '2024-05-01T00:00:00.000-05:00',
        paymentMethod: 'Paper Check',
        paymentType: 'Regular Chapter 31',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 3,
    },
    availableYears: [2024],
    recurringPayment: {
      amount: '$1,775.93',
      date: '2024-06-01T00:00:00.000-05:00',
    },
  },
  links: {
    self: 'https://test.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
    first: 'https://test.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
    prev: null,
    next: null,
    last: 'https://test.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
  },
} as PaymentsGetData

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

context('PaymentBreakdownModal', () => {
  const setVisibleMock = jest.fn((visible: boolean) => {})
  beforeEach(() => {
    when(get as jest.Mock)
      .calledWith('/v0/payment-history', expect.anything())
      .mockResolvedValue(PAYMENT_HISTORY_PAYLOAD)
    render(<PaymentBreakdownModal visible={true} setVisible={setVisibleMock} />)
  })

  it('display breakdown', async () => {
    const firstPayment = PAYMENT_HISTORY_PAYLOAD.data[0].attributes
    const secondPayment = PAYMENT_HISTORY_PAYLOAD.data[1].attributes

    expect(screen.getByText(t('paymentBreakdownModal.title'))).toBeTruthy()
    await waitFor(() => {
      expect(screen.getByText(getFormattedDate(firstPayment.date.substring(0, 10), 'MMMM d, yyyy'))).toBeTruthy()
    })

    expect(screen.getByText(`${firstPayment.paymentType}`)).toBeTruthy()
    expect(screen.getByText(`${firstPayment.amount}`)).toBeTruthy()
    expect(screen.getByText(`${secondPayment.paymentType}`)).toBeTruthy()
    expect(screen.getByText(`${secondPayment.amount}`)).toBeTruthy()
    expect(screen.getByText(t('paymentBreakdownModal.goToPaymentHistory'))).toBeTruthy()
  })

  it('should navigate to payment history', async () => {
    fireEvent.press(screen.getByTestId('GoToPaymentHistoryTestID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('PaymentsTab', {
      screen: 'PaymentHistory',
      initial: false,
    })
  })
})
