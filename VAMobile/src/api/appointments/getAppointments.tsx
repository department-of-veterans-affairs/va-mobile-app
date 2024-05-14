import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AppointmentsGetData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { appointmentsKeys } from './queryKeys'

/**
 * Fetch user appointments
 */
const getAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
): Promise<AppointmentsGetData | undefined> => {
  return get<AppointmentsGetData>('/v0/appointments', {
    startDate: startDate,
    endDate: endDate,
    'page[number]': '1',
    'page[size]': '5000',
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
  const { data: authorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled),
    queryKey: [appointmentsKeys.appointments, timeFrame],
    queryFn: () => getAppointments(startDate, endDate, timeFrame),
    meta: {
      errorName: 'getAppointments: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
