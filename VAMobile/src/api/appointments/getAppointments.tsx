import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNetInfo } from '@react-native-community/netinfo'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { forEach, has } from 'underscore'

import { appointmentsKeys } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { customQueryCache } from 'api/queryClient'
import { AppointmentsGetData, AppointmentsGetDataMeta, AppointmentsList, AppointmentsMap } from 'api/types'
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

const appointmentCacheGetter = async (
  queryKey: string,
  startDate: string,
  endDate: string,
): Promise<AppointmentsGetData> => {
  console.log('getting from cache', startDate, 'to', endDate)
  // get cached appointments
  const cachedAppointmentsStr = await AsyncStorage.getItem(queryKey)
  const cachedAppointments = JSON.parse(cachedAppointmentsStr || '{}') as AppointmentsMap

  // initialize metadata
  const meta: AppointmentsGetDataMeta = {
    travelPayEligibleCount: 0,
    upcomingAppointmentsCount: 0,
    upcomingDaysLimit: 0,
  }

  // find appointments within range and update metadata along the way
  const data: AppointmentsList = []
  forEach(cachedAppointments, (appointment) => {
    if (appointment.attributes.startDateUtc > startDate && appointment.attributes.startDateUtc < endDate) {
      data.push(appointment)
      if (appointment.attributes.travelPayEligible) {
        meta.travelPayEligibleCount = meta.travelPayEligibleCount ? meta.travelPayEligibleCount + 1 : 1
      }
    }
  })

  meta.pagination = {
    currentPage: 1,
    perPage: LARGE_PAGE_SIZE,
    totalEntries: data.length,
  }

  return {
    data,
    meta,
  }
}

const appointmentCacheSetter = async (queryKey: string, resPromise: Promise<AppointmentsGetData | undefined>) => {
  const response = await resPromise

  // map new appointments to object for storage
  const newAppointmentMap: AppointmentsMap = {}
  response?.data.forEach((appt) => {
    newAppointmentMap[appt.id] = appt
  })

  // get cached appointments
  const cachedAppointmentsStr = await AsyncStorage.getItem(queryKey)
  const cachedAppointments = JSON.parse(cachedAppointmentsStr || '{}') as AppointmentsMap

  // save new appointments overlapping with cached appointments
  await AsyncStorage.setItem(
    queryKey,
    JSON.stringify({
      ...cachedAppointments,
      ...newAppointmentMap,
    }),
  )

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
  const { isConnected } = useNetInfo()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const travelPayEnabled =
    !useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures) && featureEnabled('travelPaySMOC')
  const includeTravelClaims = timeFrame !== TimeFrameTypeConstants.UPCOMING && travelPayEnabled
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const pastAppointmentsQueryKey = [appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS]

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.appointments && !appointmentsInDowntime && queryEnabled),
    queryKey: [appointmentsKeys.appointments, timeFrame],
    networkMode: 'always',
    queryFn: () => {
      console.log('getting appts@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@S', timeFrame)
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
                  'appointments',
                  pastRange.startDate,
                  pastRange.endDate,
                  TimeFrameTypeConstants.PAST_THREE_MONTHS,
                  travelPayEnabled,
                ),
              'appointments',
              () => appointmentCacheGetter('appointments', pastRange.startDate, pastRange.endDate),
            ),
          staleTime: ACTIVITY_STALE_TIME,
        })
      }

      return customQueryCache<AppointmentsGetData | undefined>(
        () => getAppointments('appointments', startDate, endDate, timeFrame, includeTravelClaims),
        'appointments',
        () => appointmentCacheGetter('appointments', startDate, endDate),
      )
    },
    meta: {
      errorName: 'getAppointments: Service error',
    },
    staleTime: isConnected ? ACTIVITY_STALE_TIME : 0,
  })
}
