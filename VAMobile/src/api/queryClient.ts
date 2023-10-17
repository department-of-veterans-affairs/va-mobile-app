import { QueryCache, QueryClient } from '@tanstack/react-query'

import { UserAnalytic, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { isErrorObject } from 'utils/common'

export default new QueryClient({
  defaultOptions: {
    queries: {
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
