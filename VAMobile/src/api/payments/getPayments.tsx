import { useQuery } from '@tanstack/react-query'

import { VaccineLocationPayload } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { getFirstAndLastDayOfYear } from 'utils/payments'

import { paymentKeys } from './queryKeys'

/**
 * Fetch user payments history
 */
const getPayments = async (year: string, page: number): Promise<VaccineLocationPayload | undefined> => {
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
  const response = await get<VaccineLocationPayload>('/v0/payment-history', params)
  return response
}

/**
 * Returns a query for user payments history
 */
export const usePayments = (year: string, page: number, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: [paymentKeys.payment, year, page],
    queryFn: () => getPayments(year, page),
    meta: {
      errorName: 'getPayments: Service error',
    },
  })
}
