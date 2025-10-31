import { useQuery, useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

import { appointmentsKeys } from 'api/appointments/queryKeys'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AppointmentsGetData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { getPastAppointmentDateRange } from 'utils/appointments'
import { useDowntime } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch user appointments
 */
const getAppointments = (
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  includeTravelClaims: boolean = false,
): Promise<AppointmentsGetData | undefined> => {
  const pastParams = includeTravelClaims && {
    'include[]': 'travel_pay_claims',
  }

  return get<AppointmentsGetData>('/v0/appointments', {
    startDate: startDate,
    endDate: endDate,
    'page[number]': '1',
    'page[size]': LARGE_PAGE_SIZE.toString(),
    sort: `${timeFrame !== TimeFrameTypeConstants.UPCOMING ? '-' : ''}startDateUtc`, // reverse sort for past timeRanges so it shows most recent to oldest
    'included[]': 'pending',
    useCache: 'false',
    ...pastParams,
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
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')
  const includeTravelClaims = timeFrame !== TimeFrameTypeConstants.UPCOMING && travelPayEnabled
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const pastAppointmentsQueryKey = [appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS]

  const getCachedPastAppointments = (): AppointmentsGetData | undefined => {
    const timeFrameMap = {
      [TimeFrameTypeConstants.PAST_THREE_MONTHS]: 3,
      [TimeFrameTypeConstants.PAST_SIX_MONTHS]: 6,
      [TimeFrameTypeConstants.PAST_NINE_MONTHS]: 9,
      [TimeFrameTypeConstants.PAST_ONE_YEAR]: 12,
      [TimeFrameTypeConstants.PAST_TWO_YEARS]: 24,
    }

    // Check the cache for past appointments data stored for larger timeFrames to save on calls to backend
    // PastAppointments will filter down the list accordingly
    for (const key in timeFrameMap) {
      if (timeFrameMap[key] > timeFrameMap[timeFrame]) {
        const cachedAppointments = queryClient.getQueryData([appointmentsKeys.appointments, key])
        if (cachedAppointments) return cachedAppointments as AppointmentsGetData
      }
    }
    return undefined
  }

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled),
    queryKey: [appointmentsKeys.appointments, timeFrame],
    queryFn: () => {
      if (timeFrame === TimeFrameTypeConstants.UPCOMING && !queryClient.getQueryData(pastAppointmentsQueryKey)) {
        const pastRange = getPastAppointmentDateRange()

        // Prefetch past appointments when upcoming appointments are being fetched so that the default
        // appointments list in the `Past` tab will already be loaded if a user views past appointments.
        // For past appointments we'll need to prefetch travel claims, unless travel pay is in downtime
        queryClient.prefetchQuery({
          queryKey: pastAppointmentsQueryKey,
          queryFn: () =>
            getAppointments(
              pastRange.startDate,
              pastRange.endDate,
              TimeFrameTypeConstants.PAST_THREE_MONTHS,
              travelPayEnabled,
            ),
          staleTime: ACTIVITY_STALE_TIME,
        })
      }

      if (featureEnabled('datePickerUpdate') && timeFrame !== TimeFrameTypeConstants.UPCOMING) {
        const cachedPastAppointments = getCachedPastAppointments()
        if (cachedPastAppointments) return cachedPastAppointments
      }

      return getAppointments(startDate, endDate, timeFrame, includeTravelClaims)
    },
    meta: {
      errorName: 'getAppointments: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
