import { DecisionLettersGetData } from '../types'

/**
 * Type denoting the demo data store
 */
export type DecisionLettersDemoStore = {
  '/v0/claims/decision-letters': DecisionLettersGetData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type DecisionLettersDemoApiReturnTypes = DecisionLettersGetData
