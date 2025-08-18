import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { decisionLettersKeys } from 'api/decisionLetters'
import { useQueryCacheOptions } from 'api/queryClient'
import { DecisionLettersGetData } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user decision letters
 */
const getDecisionLetters = (): Promise<DecisionLettersGetData | undefined> => {
  return get<DecisionLettersGetData>('/v0/claims/decision-letters')
}

/**
 * Returns a query for user decision letters
 */
export const useDecisionLetters = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const queryCacheOptions = useQueryCacheOptions()
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    ...queryCacheOptions,
    enabled: !!(authorizedServices?.decisionLetters && queryEnabled),
    queryKey: decisionLettersKeys.decisionLetters,
    queryFn: () => getDecisionLetters(),
    meta: {
      errorName: 'getDecisionLetters: Service error',
    },
  })
}
