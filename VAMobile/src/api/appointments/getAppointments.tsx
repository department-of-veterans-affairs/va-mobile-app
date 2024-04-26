import { useQuery } from '@tanstack/react-query'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AppointmentsGetData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { DowntimeFeatureTypeConstants, Params, get } from 'store/api'
import { useDowntime } from 'utils/hooks'

import { appointmentsKeys } from './queryKeys'

/**
 * Fetch user appointments
 */
const getAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  page: number,
): Promise<AppointmentsGetData | undefined> => {
  return get<AppointmentsGetData>('/v0/appointments', {
    startDate: startDate,
    endDate: endDate,
    'page[number]': page.toString(),
    'page[size]': DEFAULT_PAGE_SIZE.toString(),
    sort: `${timeFrame !== TimeFrameTypeConstants.UPCOMING ? '-' : ''}startDateUtc`, // reverse sort for past timeRanges so it shows most recent to oldest
    'included[]': 'pending',
  } as Params)
}

/**
 * Returns a query for user appointments
 */
export const useAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  page: number,
  options?: { enabled?: boolean },
) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const queryEnabled = options && Object.hasOwn(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled,
    queryKey: [appointmentsKeys.appointments, timeFrame, page],
    queryFn: () => getAppointments(startDate, endDate, timeFrame, page),
    meta: {
      errorName: 'getAppointments: Service error',
    },
  })
}
