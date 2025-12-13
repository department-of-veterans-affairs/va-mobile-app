import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import type { DefaultError, QueryKey } from '@tanstack/query-core'
import {
  QueryCache,
  QueryClient,
  QueryFunction,
  onlineManager,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query'
import type { UndefinedInitialDataOptions } from '@tanstack/react-query/src/queryOptions'
import type { UseQueryResult } from '@tanstack/react-query/src/types'

import { Events } from 'constants/analytics'
import { RootState } from 'store'
import { OfflineState, queueOfflineEvent, setLastUpdatedTimestamp } from 'store/slices'
import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useAppDispatch } from 'utils/hooks'
import { CONNECTION_STATUS, useAppIsOnline } from 'utils/hooks/offline'
import { featureEnabled } from 'utils/remoteConfig'

export default new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
    },
  },
  queryCache: new QueryCache({
    onSuccess: async (data, query) => {
      const analyticsUserProperty = query?.meta?.analyticsUserProperty as UserAnalytic
      if (analyticsUserProperty) {
        await setAnalyticsUserProperty(analyticsUserProperty)
      }
    },
    onError: (error, query) => {
      const errorName = query?.meta?.errorName as string
      if (errorName && isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, errorName)
      }
    },
  }),
})
// Retry on network error. If the connection is lost this will trigger pulling the latest data from the cache
export const offlineRetry = <TError = DefaultError>(_: number, error: TError) => {
  // @ts-ignore networkError comes from a locally thrown error and is not expected on type Error
  return featureEnabled('offlineMode') && !!error.networkError
}

const useQueryAnalytics = (queryKey: QueryKey) => {
  const connectionStatus = useAppIsOnline()
  const dispatch = useAppDispatch()
  const lastUpdatedDate = useGetLastUpdatedTime(queryKey)

  // This state prevents the events from being queued multiple times
  const [cachedEventLogged, setCachedEventLogged] = useState(false)
  const [noDataEventLogged, setNoDataEventLogged] = useState(false)

  // log analytics to show when the user is getting cached data vs no data being available while offline
  useEffect(() => {
    if (connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
      if (lastUpdatedDate && !cachedEventLogged) {
        dispatch(queueOfflineEvent(Events.vama_offline_cache(`${queryKey}`)))
        setCachedEventLogged(true)
      } else if (!lastUpdatedDate && !noDataEventLogged) {
        dispatch(queueOfflineEvent(Events.vama_offline_no_data(`${queryKey}`)))
        setNoDataEventLogged(true)
      }
    }
  }, [cachedEventLogged, connectionStatus, dispatch, lastUpdatedDate, noDataEventLogged, queryKey])
}

/*
  useQuery is a wrapper hook for the react-query useQuery. It acts the same but with two changes. First it adds tracking
  for the last time the data was fetched from the api. And second it will kick off a retry when the device disconnects
  mid-request to fetch the data from the cache instead.
 */
export const useQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> & { lastUpdatedDate: number | undefined } => {
  const lastUpdatedDate = useGetLastUpdatedTime(options.queryKey)
  const dispatch = useAppDispatch()
  useQueryAnalytics(options.queryKey)

  const queryResult = useTanstackQuery({
    /**
     By default, the query client caches for 5 minutes with a max expiration of 24 days.
     To support offline we want to allow cached by setting the garbage collection time to Infinity.
     */
    gcTime: Infinity,
    retry: offlineRetry,
    ...options,
    queryFn: async (context) => {
      const queryFn = options.queryFn as QueryFunction<TQueryFnData, TQueryKey, never>
      const response = await queryFn?.(context)

      // Save last updated timestamp while online
      if (featureEnabled('offlineMode') && onlineManager.isOnline()) {
        dispatch(setLastUpdatedTimestamp(`${options.queryKey}`, Date.now().toString()))
      }

      return response
    },
  })

  return {
    ...queryResult,
    lastUpdatedDate,
  }
}

/*
  useGetLastUpdatedTime returns the timestamp for a query based on the query key provided.
 */
const useGetLastUpdatedTime = (key: QueryKey) => {
  const [time, setTime] = useState<number>()
  const { lastUpdatedTimestamps } = useSelector<RootState, OfflineState>((state) => state.offline)

  useEffect(() => {
    const getTime = async () => {
      const storedTime = lastUpdatedTimestamps[`${key}`]
      setTime(storedTime ? Number(storedTime) : undefined)
    }

    if (featureEnabled('offlineMode')) {
      getTime()
    }
  }, [key, lastUpdatedTimestamps])

  return time
}
