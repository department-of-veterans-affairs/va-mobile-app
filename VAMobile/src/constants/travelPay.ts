export type TravelPayError = 'noAddress' | 'unsupportedType' | 'error'

export type TravelPayPartialSuccessStatus = 'Incomplete' | 'Saved'

/**
 * These statuses are only returned for a travel pay claim that is a partial success.
 */
export const TravelPayPartialSuccessStatusConstants = {
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
} as const
