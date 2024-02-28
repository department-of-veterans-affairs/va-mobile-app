import { useQuery } from '@tanstack/react-query'

import { DecisionLettersGetData } from 'api/types'
import { get } from 'store/api'

import { decisionLettersKeys } from './queryKeys'

/**
 * Fetch user decision letters
 */
const getDecisionLetters = async (): Promise<DecisionLettersGetData | undefined> => {
  return get<DecisionLettersGetData>('/v0/claims/decision-letters')
}

/**
 * Returns a query for user decision letters
 */
export const useDecisionLetters = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: decisionLettersKeys.decisionLetters,
    queryFn: () => getDecisionLetters(),
    meta: {
      errorName: 'getDecisionLetters: Service error',
    },
  })
}
