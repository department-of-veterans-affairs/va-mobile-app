import { useQuery } from '@tanstack/react-query'

import { PaymentsGetData } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { getFirstAndLastDayOfYear, groupPaymentsByDate } from 'utils/payments'

import { paymentsKeys } from './queryKeys'

/**
 * Fetch user payments history
 */
const getPayments = async (year: string | undefined, page: number): Promise<PaymentsGetData | undefined> => {
  const [startDate, endDate] = getFirstAndLastDayOfYear(year)

  const params: Params =
    startDate && endDate
      ? {
          startDate: startDate,
          endDate: endDate,
          'page[number]': page.toString(),
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
        }
      : {}
  const response = await get<PaymentsGetData>('/v0/payment-history', params)
  if (response) {
    return {
      ...response,
      paymentsByDate: groupPaymentsByDate(response.data),
    }
  }
}

/**
 * Returns a query for user payments history
 */
export const usePayments = (year: string | undefined, page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [paymentsKeys.payments, year, page],
    queryFn: () => getPayments(year, page),
    meta: {
      errorName: 'getPayments: Service error',
    },
  })
}
