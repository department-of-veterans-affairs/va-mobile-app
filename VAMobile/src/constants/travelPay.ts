import { AppointmentData, UserContactInformation } from 'api/types'

export type TravelPayError = 'noAddress' | 'unsupportedType' | 'error'

export type TravelPayPartialSuccessStatus = 'Incomplete' | 'Saved'

/**
 * These statuses are only returned for a travel pay claim that is a partial success.
 */
export const TravelPayPartialSuccessStatusConstants = {
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
} as const

export type TravelPayContextValue = {
  /**
   * The appointment for which the user is filing a travel pay claim.
   */
  appointment: AppointmentData
  /**
   * Whether the user has checked the certification/acknowledgement checkbox on
   * the Review Claim screen indicating they agree with the penalty statement.
   */
  isCheckboxChecked: boolean
  /**
   * Setter to update {@link TravelPayContextValue.isCheckboxChecked}. Typically
   * invoked when the user toggles the review-screen checkbox.
   */
  setIsCheckboxChecked: (isCheckboxChecked: boolean) => void
  /**
   * Flag indicating the checkbox is required but has not been selected. When
   * true, validation messaging is displayed to the user.
   */
  checkboxError: boolean
  /**
   * Fires the network request that submits the travel pay claim for the current
   * appointment. Also handles navigation to the success or error screens based
   * on the result.
   */
  submitTravelClaim: () => void
  /**
   * True while the claim is actively being submitted; used to show loading
   * indicators and disable duplicate submissions.
   */
  submittingTravelClaim: boolean
  /**
   * The veteran’s contact information (address, phone, etc.) fetched from the
   * backend. Optional because the data may still be loading when the context is
   * first created or the user has not yet provided their contact information.
   */
  userContactInformation?: UserContactInformation
  /**
   * Initiates the SMOC (Self-Mileage Other Claims) flow by navigating to the
   * mileage entry screen and marking the start time for analytics.
   */
  startSmocFlow: () => void
}
