import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { DecisionLettersGetData, ErrorData } from 'api/types'
import { get } from 'store/api'

import { decisionLettersKeys } from './queryKeys'

/**
 * Fetch user decision letters
 */
const getDecisionLetters = (queryClient: QueryClient): Promise<DecisionLettersGetData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === decisionLettersKeys.decisionLetters[0]) {
        throw error.error
      }
    })
  }
  return get<DecisionLettersGetData>('/v0/claims/decision-letters')
}

/**
 * Returns a query for user decision letters
 */
export const useDecisionLetters = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  const { data: authorizedServices } = useAuthorizedServices()
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.decisionLetters && queryEnabled),
    queryKey: decisionLettersKeys.decisionLetters,
    queryFn: () => getDecisionLetters(queryClient),
    meta: {
      errorName: 'getDecisionLetters: Service error',
    },
  })
}
