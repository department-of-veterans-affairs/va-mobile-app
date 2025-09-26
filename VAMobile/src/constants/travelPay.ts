export type TravelPayError = 'noAddress' | 'unsupportedType' | 'error'

export type TravelPayPartialSuccessStatus = 'Incomplete' | 'Saved'

export type TravelClaimsScreenEntryType = 'Health' | 'Claims' | 'Payments'

export const TravelClaimsScreenEntry: {
  Health: TravelClaimsScreenEntryType
  Claims: TravelClaimsScreenEntryType
  Payments: TravelClaimsScreenEntryType
} = {
  Health: 'Health',
  Claims: 'Claims',
  Payments: 'Payments',
}

/**
 * These statuses are only returned for a travel pay claim that is a partial success.
 */
export const TravelPayPartialSuccessStatusConstants = {
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
} as const
