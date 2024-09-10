import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { AppointmentsGetData, ErrorData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { getPastAppointmentDateRange } from 'utils/appointments'
import { useDowntime } from 'utils/hooks'

import { appointmentsKeys } from './queryKeys'

/**
 * Fetch user appointments
 */
const getAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  queryClient: QueryClient,
): Promise<AppointmentsGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === appointmentsKeys.appointments[0]) {
        throw error.error
      }
    })
  }

  return get<AppointmentsGetData>('/v0/appointments', {
    startDate: startDate,
    endDate: endDate,
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: `${timeFrame !== TimeFrameTypeConstants.UPCOMING ? '-' : ''}startDateUtc`, // reverse sort for past timeRanges so it shows most recent to oldest
    'included[]': 'pending',
    useCache: 'false',
  } as Params)
}

/**
 * Returns a query for user appointments
 */
export const useAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient()
  const { data: authorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const pastAppointmentsQueryKey = [appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS]

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled),
    queryKey: [appointmentsKeys.appointments, timeFrame],
    queryFn: () => {
      if (timeFrame === TimeFrameTypeConstants.UPCOMING && !queryClient.getQueryData(pastAppointmentsQueryKey)) {
        const pastRange = getPastAppointmentDateRange()

        // Prefetch past appointments when upcoming appointments are being fetched so that the default
        // appointments list in the `Past` tab will already be loaded if a user views past appointments.
        queryClient.prefetchQuery({
          queryKey: pastAppointmentsQueryKey,
          queryFn: () =>
            getAppointments(
              pastRange.startDate,
              pastRange.endDate,
              TimeFrameTypeConstants.PAST_THREE_MONTHS,
              queryClient,
            ),
          staleTime: ACTIVITY_STALE_TIME,
        })
      }

      return getAppointments(startDate, endDate, timeFrame, queryClient)
    },
    meta: {
      errorName: 'getAppointments: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
