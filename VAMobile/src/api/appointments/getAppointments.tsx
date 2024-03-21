import { useQuery } from '@tanstack/react-query'

import { AppointmentsGetData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'

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
  return useQuery({
    ...options,
    queryKey: [appointmentsKeys.appointments, timeFrame, page],
    queryFn: () => getAppointments(startDate, endDate, timeFrame, page),
    meta: {
      errorName: 'getAppointments: Service error',
    },
  })
}
