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

import { RootState } from 'store'
import { OfflineState, setLastUpdatedTimestamp } from 'store/slices'
import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useAppDispatch } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

/**
  By default, the query client caches for 5 minutes with a max expiration of 24 days.
 To support offline we want to allow cached
 */
const GARBAGE_COLLECT_TIME = Infinity

export default new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
      gcTime: GARBAGE_COLLECT_TIME,
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
  const queryResult = useTanstackQuery({
    ...options,
    queryFn: async (context) => {
      const queryFn = options.queryFn as QueryFunction<TQueryFnData, TQueryKey, never>
      const response = await queryFn?.(context)

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

const useGetLastUpdatedTime = (key: QueryKey) => {
  const [time, setTime] = useState<number>()
  const { lastUpdatedTimestamps } = useSelector<RootState, OfflineState>((state) => state.offline)

  useEffect(() => {
    const getTime = async () => {
      const storedTime = lastUpdatedTimestamps[`${key}`]
      //const storedTime = await storage?.getItem(`${key}-lastUpdatedTime`)
      setTime(storedTime ? Number(storedTime) : undefined)
    }

    if (featureEnabled('offlineMode')) {
      getTime()
    }
  }, [key, lastUpdatedTimestamps])

  return time
}
