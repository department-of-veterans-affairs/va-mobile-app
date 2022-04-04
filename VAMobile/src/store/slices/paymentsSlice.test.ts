import { find } from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { getPayments } from './paymentsSlice'

const url: string = '/v0/payment-history'

export const ActionTypes: {
  PAYMENTS_START_GET_PAYMENTS: string
  PAYMENTS_FINISH_GET_PAYMENTS: string
} = {
  PAYMENTS_START_GET_PAYMENTS: 'payments/dispatchStartGetPayments',
  PAYMENTS_FINISH_GET_PAYMENTS: 'payments/dispatchFinishGetPayments',
}

context('paymentHistory', () => {
  describe('getPaymentHistory', () => {
    it('should get users payment history', async () => {
      const mockPaymentsPayload: api.PaymentsGetData = {
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
            currentPage: 1,
            perPage: 10,
            totalEntries: 2,
          },
          availableYears: ['2021'],
        },
        links: {
          self: 'https://staging-api.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
          first: 'https://staging-api.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
          prev: null,
          next: null,
          last: 'https://staging-api.va.gov/mobile/v0/payment-history?startDate=&endDate=&page[size]=10&page[number]=1',
        },
      }

      when(api.get as jest.Mock)
        .calledWith(url, {})
        .mockResolvedValue(mockPaymentsPayload)

      const store = realStore()
      await store.dispatch(getPayments())
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.PAYMENTS_START_GET_PAYMENTS })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.payments.loading).toBeTruthy()

      const endAction = find(actions, { type: ActionTypes.PAYMENTS_FINISH_GET_PAYMENTS })
      expect(endAction?.state.payments.loading).toBeFalsy()
      expect(endAction?.state.payments.error).toBeFalsy()

      const { payments } = store.getState()
      expect(payments.currentPagePayments).toEqual({ '2021-01-01': mockPaymentsPayload.data })
      expect(payments.error).toBeFalsy()
    })

    it('should get error if it cant get data', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock)
        .calledWith(url, {})
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getPayments())
      const actions = store.getActions()

      const startAction = find(actions, { type: ActionTypes.PAYMENTS_START_GET_PAYMENTS })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.payments.loading).toBeTruthy()

      const endAction = find(actions, { type: ActionTypes.PAYMENTS_FINISH_GET_PAYMENTS })
      expect(endAction?.state.payments.loading).toBeFalsy()
      expect(endAction?.state.payments.error).toBeTruthy()

      const { payments } = store.getState()
      expect(payments.currentPagePayments[0]).toEqual(undefined)
      expect(payments.error).toEqual(error)
    })
  })
})
