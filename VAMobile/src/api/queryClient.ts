import NetInfo, { useNetInfo } from '@react-native-community/netinfo'

import { NetworkMode, QueryCache, QueryClient } from '@tanstack/react-query'

import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

type CacheProps = {
  networkMode: NetworkMode
  staleTime: number
  gcTime: number
  refetchOnMount: boolean | 'always'
}

export const useQueryCacheOptions = (): CacheProps => {
  const { isConnected } = useNetInfo()

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
