import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { paymentsKeys } from 'api/payments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import { getFirstAndLastDayOfYear, groupPaymentsByDate } from 'utils/payments'

import PaymentHistoryScreen from './PaymentHistoryScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockData = {
  data: [
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
  meta: {
    pagination: {
      currentPage: '1',
      perPage: '2',
      totalEntries: '2',
    },
    availableYears: ['2021'],
  },
}

context('PaymentHistoryScreen', () => {
  const initializeTestInstance = (data = mockData) => {
    const queriesData: QueriesData = [
      {
        queryKey: paymentsKeys.payments,
        data: {
          ...data,
          paymentsByDate: groupPaymentsByDate(data.data),
        },
      },
      {
        queryKey: [paymentsKeys.payments, '2021', '1'],
        data: {
          ...data,
          paymentsByDate: groupPaymentsByDate(data.data),
        },
      },
    ]
    render(<PaymentHistoryScreen {...mockNavProps()} />, { queriesData })
  }

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      const [startDate, endDate] = getFirstAndLastDayOfYear('2021')
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {
          startDate: startDate,
          endDate: endDate,
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
        })
        .mockResolvedValue(mockData)
      initializeTestInstance()
      expect(screen.getByText('Loading your payment history...')).toBeTruthy()
    })
  })

  describe('when user has payments', () => {
    it('should show page content', async () => {
      const [startDate, endDate] = getFirstAndLastDayOfYear('2021')
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {})
        .mockResolvedValue(mockData)
        .calledWith(`/v0/payment-history`, {
          startDate: startDate,
          endDate: endDate,
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
        })
        .mockResolvedValue(mockData)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("What if I'm missing a payment?")).toBeTruthy())
      await waitFor(() => expect(screen.getByText('January 1, 2021')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Compensation & Pension - Recurring')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('$3,746.20')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Post-9/11 GI Bill')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('$1,172.60')).toBeTruthy())
    })
  })

  describe('when user has no payments', () => {
    it('should show empty state screen', async () => {
      const data = {
        data: [],
        meta: {
          pagination: {
            currentPage: '1',
            perPage: '0',
            totalEntries: '0',
          },
          availableYears: [],
        },
      }
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {})
        .mockResolvedValue(data)
      initializeTestInstance(data)
      await waitFor(() => expect(screen.getByText(" We don't have a record of VA payments for you")).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', async () => {
      const data = {
        data: [],
        meta: {
          pagination: {
            currentPage: '1',
            perPage: '0',
            totalEntries: '0',
          },
          availableYears: [],
        },
      }
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {})
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance(data)
      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })

  describe('when user clicks the missing payment link', () => {
    it('should navigate to Payment Missing Screen', async () => {
      const [startDate, endDate] = getFirstAndLastDayOfYear('2021')
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {})
        .mockResolvedValue(mockData)
        .calledWith(`/v0/payment-history`, {
          startDate: startDate,
          endDate: endDate,
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
        })
        .mockResolvedValue(mockData)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByTestId('missingPaymentsTestID')))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('PaymentMissing'))
    })
  })

  describe('when user clicks on a payment button', () => {
    it('should navigate to Payment Missing Screen', async () => {
      const [startDate, endDate] = getFirstAndLastDayOfYear('2021')
      when(api.get as jest.Mock)
        .calledWith(`/v0/payment-history`, {})
        .mockResolvedValue(mockData)
        .calledWith(`/v0/payment-history`, {
          startDate: startDate,
          endDate: endDate,
          'page[number]': '1',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
        })
        .mockResolvedValue(mockData)
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText('Post-9/11 GI Bill $1,172.60')))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('PaymentDetails', {
          payment: {
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
        }),
      )
    })
  })
})
