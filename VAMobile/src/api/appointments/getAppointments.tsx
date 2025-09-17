import { useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

import { appointmentsKeys } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useQuery } from 'api/queryClient'
import { customQueryCache } from 'api/queryClient'
import { AppointmentsGetData } from 'api/types'
import { storage } from 'components/QueryClientProvider/QueryClientProvider'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { ACTIVITY_STALE_TIME, LARGE_PAGE_SIZE } from 'constants/common'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { getPastAppointmentDateRange } from 'utils/appointments'
import { useDowntime } from 'utils/hooks'
import { useOfflineMode } from 'utils/hooks/offline'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch user appointments
 */
const getAppointments = (
  queryKey: string,
  startDate: string,
  endDate: string,
  timeFrame: TimeFrameType,
  includeTravelClaims: boolean = false,
): Promise<AppointmentsGetData | undefined> => {
  const pastParams = includeTravelClaims && {
    'include[]': 'travel_pay_claims',
  }

  return appointmentCacheSetter(
    queryKey,
    get<AppointmentsGetData>('/v0/appointments', {
      startDate: startDate,
      endDate: endDate,
      'page[number]': '1',
      'page[size]': LARGE_PAGE_SIZE.toString(),
      sort: `${timeFrame !== TimeFrameTypeConstants.UPCOMING ? '-' : ''}startDateUtc`, // reverse sort for past timeRanges so it shows most recent to oldest
      'included[]': 'pending',
      useCache: 'false',
      ...pastParams,
    } as Params),
  )
}

const appointmentCacheGetter = async (queryKey: string): Promise<AppointmentsGetData> => {
  // get cached appointments
  const cachedAppointmentsStr = await storage.getItem(queryKey)

  return JSON.parse(cachedAppointmentsStr || '{}') as AppointmentsGetData
}

const appointmentCacheSetter = async (queryKey: string, resPromise: Promise<AppointmentsGetData | undefined>) => {
  const response = await resPromise
  await storage.setItem(queryKey, JSON.stringify(response))

  // save last updated time
  await storage.setItem(`${queryKey}-lastUpdatedTime`, Date.now().toString())

  return response
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
  const isConnected = useOfflineMode()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')
  const includeTravelClaims = timeFrame !== TimeFrameTypeConstants.UPCOMING && travelPayEnabled
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const pastAppointmentsQueryKey = [appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS]
  return useQuery(
    {
      ...options,
      enabled: !!(authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled),
      queryKey: [appointmentsKeys.appointments, timeFrame],
      networkMode: 'always',
      queryFn: () => {
        if (timeFrame === TimeFrameTypeConstants.UPCOMING && !queryClient.getQueryData(pastAppointmentsQueryKey)) {
          const pastRange = getPastAppointmentDateRange()

          // Prefetch past appointments when upcoming appointments are being fetched so that the default
          // appointments list in the `Past` tab will already be loaded if a user views past appointments.
          // For past appointments we'll need to prefetch travel claims, unless travel pay is in downtime
          queryClient.prefetchQuery({
            queryKey: pastAppointmentsQueryKey,
            queryFn: () =>
              customQueryCache<AppointmentsGetData | undefined>(
                () =>
                  getAppointments(
                    `${[appointmentsKeys.appointments, timeFrame]}`,
                    pastRange.startDate,
                    pastRange.endDate,
                    TimeFrameTypeConstants.PAST_THREE_MONTHS,
                    travelPayEnabled,
                  ),
                `${[appointmentsKeys.appointments, timeFrame]}`,
                () => appointmentCacheGetter(`${[appointmentsKeys.appointments, timeFrame]}`),
              ),
            staleTime: ACTIVITY_STALE_TIME,
          })
        }

        return customQueryCache<AppointmentsGetData | undefined>(
          () =>
            getAppointments(
              `${[appointmentsKeys.appointments, timeFrame]}`,
              startDate,
              endDate,
              timeFrame,
              includeTravelClaims,
            ),
          `${[appointmentsKeys.appointments, timeFrame]}`,
          () => appointmentCacheGetter(`${[appointmentsKeys.appointments, timeFrame]}`),
        )
      },
      meta: {
        errorName: 'getAppointments: Service error',
      },
      staleTime: isConnected ? ACTIVITY_STALE_TIME : 0,
    },
    false,
  )
}
