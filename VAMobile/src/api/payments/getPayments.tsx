import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { PaymentsGetData } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'
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
  const response = await get<PaymentsGetData>('/v0/payment-history', params, paymentsKeys.payments)
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
  const { data: authorizedServices } = useAuthorizedServices()
  const paymentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.payments)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.paymentHistory && !paymentsInDowntime && queryEnabled),
    queryKey: [paymentsKeys.payments, year, page],
    queryFn: () => getPayments(year, page),
    meta: {
      errorName: 'getPayments: Service error',
    },
  })
}
