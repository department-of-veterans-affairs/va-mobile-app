import { QueryClient, onlineManager } from '@tanstack/react-query'
import { has } from 'underscore'

import { appointmentsKeys } from 'api/appointments/queryKeys'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { offlineRetry, useQuery } from 'api/queryClient'
import { AvsBinariesGetData, SummaryMetadata } from 'api/types'
import { AfterVisitSummaryToIncludeOH } from 'constants/appointments'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { AppDispatch } from 'store'
import { Params, get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { setLastUpdatedTimestamp } from 'store/slices'
import { useDowntime } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
 * Fetch AVS binaries for an appointment
 */
const getAvsBinaries = async (
  toFetch: SummaryMetadata[],
  appointmentId: string,
): Promise<AvsBinariesGetData | undefined> => {
  return get<AvsBinariesGetData>(`/v0/appointments/avs_binaries/${appointmentId}`, {
    docIds: toFetch.map((item) => item.id).join(','),
  } as Params)
}

export const prefetchAvsBinaries = async (
  queryClient: QueryClient,
  dispatch: AppDispatch,
  avsMetadata: SummaryMetadata[] | undefined,
): Promise<void> => {
  const appointmentId = avsMetadata?.[0]?.apptId
  if (!appointmentId) {
    return
  }

  const toInclude = AfterVisitSummaryToIncludeOH
  const toFetch = avsMetadata.filter((item) => !!toInclude[item.noteType])
  if (!toFetch.length) {
    return
  }

  const avsQueryKey = [...appointmentsKeys.avsBinaries, appointmentId]
  if (queryClient.getQueryData(avsQueryKey)) {
    return
  }

  await queryClient.prefetchQuery({
    queryKey: avsQueryKey,
    retry: offlineRetry,
    queryFn: async () => {
      const binaries = await getAvsBinaries(toFetch, appointmentId)

      if (featureEnabled('offlineMode') && onlineManager.isOnline()) {
        dispatch(setLastUpdatedTimestamp(`${avsQueryKey}`, Date.now().toString()))
      }
      return binaries
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}

/**
 * Returns a query for user appointments
 */
export const useAvsBinaries = (avsMetadata: SummaryMetadata[] | undefined, options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const appointmentId = avsMetadata?.[0]?.apptId
  const avsQueryKey = [...appointmentsKeys.avsBinaries, appointmentId]

  return useQuery({
    ...options,
    enabled: !!(
      authorizedServices?.appointments &&
      !appointmentsInDowntime &&
      queryEnabled &&
      !!appointmentId &&
      Array.isArray(avsMetadata) &&
      avsMetadata.length > 0
    ),
    queryKey: avsQueryKey,
    queryFn: async () => {
      if (!appointmentId || !avsMetadata || avsMetadata.length === 0) {
        return undefined
      }

      const toInclude = AfterVisitSummaryToIncludeOH
      const toFetch = avsMetadata.filter((a) => !!toInclude[a.noteType])
      if (toFetch.length === 0) {
        return undefined
      }
      return await getAvsBinaries(toFetch, appointmentId)
    },
    meta: {
      errorName: 'getAppointments: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
