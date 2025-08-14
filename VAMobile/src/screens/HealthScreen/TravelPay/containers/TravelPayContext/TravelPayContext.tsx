import React, { createContext, useContext, useRef, useState } from 'react'

import { DateTime } from 'luxon'

import { useContactInformation } from 'api/contactInformation'
import { useSubmitTravelClaim } from 'api/travelPay'
import { AppointmentData, UserContactInformation } from 'api/types'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation } from 'utils/hooks'

export type TravelPayContextValue = {
  /**
   * The appointment for which the user is filing a travel pay claim.
   */
  appointment: AppointmentData
  /**
   * Whether the user has checked the certification/acknowledgement checkbox on
   * the Review Claim screen indicating they agree with the penalty statement.
   */
  penaltyStatementAccepted: boolean
  /**
   * Setter to update {@link TravelPayContextValue.penaltyStatementAccepted}. Typically
   * invoked when the user toggles the review-screen checkbox to agree to the penalty statement.
   */
  setPenaltyStatementAccepted: (penaltyStatementAccepted: boolean) => void
  /**
   * Flag indicating the penalty statement checkbox is required but has not been selected.
   */
  penaltyStatementError: boolean
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
   * Initiates the SMOC (Simple Mileage Only Claim) flow by navigating to the
   * mileage entry screen and marking the start time for analytics.
   */
  startSmocFlow: () => void
}

/**
 * React context that provides shared state and actions for the **Submit Travel Pay**
 * flow.
 *
 * @remarks The context value shape is described by {@link TravelPayContextValue}.
 * The context is created with a placeholder (empty object cast to that type) so
 * that it can be safely imported before the real value is supplied by
 * `TravelPayContextProvider`.
 *
 * Components should wrap their subtree with `TravelPayContextProvider` (located
 * in `SubmitTravelPayFlowSteps/components`) to supply the actual value.
 */
export const TravelPayContext = createContext<TravelPayContextValue>({} as TravelPayContextValue)

/**
 * React hook that returns the current value of {@link TravelPayContext}.
 *
 * @returns The current {@link TravelPayContextValue} provided higher in the
 * component tree.
 *
 * @example
 * ```tsx
 * const { appointment, startSmocFlow } = useTravelPayContext();
 * ```
 */
export const useTravelPayContext = () => useContext(TravelPayContext)

export default function TravelPayContextProvider({
  children,
  appointment,
  appointmentRouteKey,
}: {
  children: React.ReactNode
  appointment: AppointmentData
  appointmentRouteKey: string
}) {
  const smocFlowStartDate = useRef<string | undefined>(undefined)
  const [penaltyStatementAccepted, setPenaltyStatementAccepted] = useState(false)
  const [penaltyStatementError, setPenaltyStatementError] = useState<boolean>(false)

  const { mutate: submitClaim, isPending: submittingTravelClaim } = useSubmitTravelClaim(
    appointment.id,
    appointmentRouteKey,
  )

  const navigateTo = useRouteNavigation()
  const userContactInformationQuery = useContactInformation({ enabled: true })

  const navigateToErrorScreen = (error: string) => {
    logAnalyticsEvent(Events.vama_smoc_error(error))
    navigateTo('SMOCErrorScreen', { error })
  }

  const submitTravelClaim = async () => {
    if (!penaltyStatementAccepted) {
      setPenaltyStatementError(true)
      return
    }

    if (!appointment.attributes.location.id) {
      navigateToErrorScreen('error')
      return
    }

    if (smocFlowStartDate.current) {
      const totalTime = DateTime.now().diff(DateTime.fromISO(smocFlowStartDate.current)).toMillis()
      logAnalyticsEvent(Events.vama_smoc_time_taken(totalTime))
    }

    submitClaim(
      {
        appointmentDateTime: appointment.attributes.startDateLocal,
        facilityStationNumber: appointment.attributes.location.id,
        facilityName: appointment.attributes.location.name,
        appointmentType: 'Other',
        isComplete: false,
      },
      {
        onSuccess: (data) => {
          if (data?.data) {
            navigateTo('SubmitSuccessScreen', {
              appointmentDateTime: data.data.attributes.appointmentDateTime,
              facilityName: data.data.attributes.facilityName,
              status: data.data.attributes.claimStatus,
            })
            setPenaltyStatementAccepted(false)
            setPenaltyStatementError(false)
            smocFlowStartDate.current = undefined
          } else {
            navigateToErrorScreen('error')
          }
        },
        onError: () => navigateToErrorScreen('error'),
      },
    )
  }

  const startSmocFlow = () => {
    navigateTo('MileageScreen')
    smocFlowStartDate.current = DateTime.now().toISO()
  }

  return (
    <TravelPayContext.Provider
      value={{
        appointment,
        penaltyStatementAccepted,
        setPenaltyStatementAccepted,
        penaltyStatementError,
        submitTravelClaim,
        submittingTravelClaim,
        userContactInformation: userContactInformationQuery.data,
        startSmocFlow,
      }}>
      {children}
    </TravelPayContext.Provider>
  )
}
