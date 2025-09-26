import { useEffect, useState } from 'react'

import type { DefaultError, QueryKey } from '@tanstack/query-core'
import {
  NetworkMode,
  QueryCache,
  QueryClient,
  QueryFunction,
  useQuery as useTanstackQuery,
} from '@tanstack/react-query'
import type { UndefinedInitialDataOptions } from '@tanstack/react-query/src/queryOptions'
import type { UseQueryResult } from '@tanstack/react-query/src/types'

import { storage } from 'components/QueryClientProvider/QueryClientProvider'
import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useOfflineMode } from 'utils/hooks/offline'
import { featureEnabled } from 'utils/remoteConfig'

type CacheProps = {
  networkMode: NetworkMode
  staleTime: number
  gcTime: number
  refetchOnMount: boolean | 'always'
}

export const useQueryCacheOptions = (): CacheProps => {
  const isConnected = useOfflineMode()

  return {
    networkMode: isConnected === false ? 'offlineFirst' : 'online',
    staleTime: isConnected === false ? Infinity : 0,
    refetchOnMount: isConnected === false ? false : 'always',
    gcTime: Infinity,
  }
}

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
  const queryResult = useTanstackQuery({
    ...options,
    queryFn: async (context) => {
      const queryFn = options.queryFn as QueryFunction<TQueryFnData, TQueryKey, never>
      const response = await queryFn?.(context)

      // if (featureEnabled('offlineMode')) {
        if (`${options.queryKey}-lastUpdatedTime`.includes('appointments')) {
          console.log('setting date:', `${options.queryKey}-lastUpdatedTime`, !!storage)
        }
        await storage?.setItem(`${options.queryKey}-lastUpdatedTime`, Date.now().toString())
      // }

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

  useEffect(() => {
    const getTime = async () => {

      const storedTime = await storage?.getItem(`${key}-lastUpdatedTime`)
      if (`${key}-lastUpdatedTime`.includes('appointments') && storedTime) {
        console.log('getting date:', `${key}-lastUpdatedTime`, storedTime)
      }
      setTime(storedTime ? Number(storedTime) : undefined)
    }

    // if (featureEnabled('offlineMode')) {
      getTime()
    // }
  }, [key])

  return time
}
