import React, { useRef, useState } from 'react'

import { DateTime } from 'luxon'

import { useContactInformation } from 'api/contactInformation'
import { useSubmitTravelClaim } from 'api/travelPay'
import { AppointmentData } from 'api/types'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation } from 'utils/hooks'
import { TravelPayContext } from 'utils/travelPay'

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
