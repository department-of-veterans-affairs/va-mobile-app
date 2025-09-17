import { useEffect, useState } from 'react'

import NetInfo from '@react-native-community/netinfo'

import type { DefaultError, QueryKey } from '@tanstack/query-core'
import { NetworkMode, QueryCache, QueryClient, useQuery as useTanstackQuery } from '@tanstack/react-query'
import type { UndefinedInitialDataOptions } from '@tanstack/react-query/src/queryOptions'
import type { UseQueryResult } from '@tanstack/react-query/src/types'

import { storage } from 'components/QueryClientProvider/QueryClientProvider'
import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { useOfflineMode } from 'utils/hooks/offline'

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

export const customQueryCache = async <T>(
  queryFn: (queryKey: string, ...p: never[]) => Promise<T | undefined>,
  queryKey: string,
  cacheGetter: () => Promise<T | undefined>,
  ...params: never[]
): Promise<T | undefined> => {
  const { isConnected } = await NetInfo.fetch()

  if (isConnected) {
    await storage.setItem(`${queryKey}`, Date.now().toString())
    return queryFn(queryKey, ...params)
  }

  return cacheGetter()
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
  saveUpdatedTime = true,
): UseQueryResult<TData, TError> & { lastUpdatedDate: number | undefined } => {
  const lastUpdatedDate = useGetLastUpdatedTime(options.queryKey)
  const queryResult = useTanstackQuery({
    ...options,
    queryFn: async () => {
      if (saveUpdatedTime) {
        await storage.setItem(`${options.queryKey}-lastUpdatedTime`, Date.now().toString())
      }
      // @ts-ignore
      return options.queryFn()
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
      const storedTime = await storage.getItem(`${key}`)
      if (storedTime) {
        setTime(Number(storedTime))
      }
    }
    getTime()
  }, [key])

  return time
}
