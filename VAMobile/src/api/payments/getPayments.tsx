import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { ErrorData, PaymentsGetData } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'
import { getFirstAndLastDayOfYear, groupPaymentsByDate } from 'utils/payments'

import { paymentsKeys } from './queryKeys'

/**
 * Fetch user payments history
 */
const getPayments = async (
  year: string | undefined,
  page: number,
  queryClient: QueryClient,
): Promise<PaymentsGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === paymentsKeys.payments[0]) {
        throw error.error
      }
    })
  }
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
  const { data: authorizedServices } = useAuthorizedServices()
  const paymentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.payments)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.paymentHistory && !paymentsInDowntime && queryEnabled),
    queryKey: [paymentsKeys.payments, year, page],
    queryFn: () => getPayments(year, page, queryClient),
    meta: {
      errorName: 'getPayments: Service error',
    },
  })
}
