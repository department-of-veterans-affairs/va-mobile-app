import { useMutation, useQueryClient } from '@tanstack/react-query'

import { appointmentsKeys } from 'api/appointments'
import { AppointmentsGetData, SubmitSMOCTravelPayClaimParameters, SubmitTravelPayClaimResponseData } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { Params as APIParams, post } from 'store/api/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { stripTZOffset } from 'utils/travelPay'

const submitClaim = async (smocTravelPayClaimData: SubmitSMOCTravelPayClaimParameters) => {
  const endpoint = '/v0/travel-pay/claims'
  const data = {
    ...smocTravelPayClaimData,
    // We need the local time with no TZ indicators for the external API
    appointmentDateTime: stripTZOffset(smocTravelPayClaimData.appointmentDateTime),
  }
  return post<SubmitTravelPayClaimResponseData>(endpoint, data as unknown as APIParams)
}

/**
 * Returns a mutation for submitting a travel pay claim
 */
export const useSubmitTravelClaim = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitClaim,
    onSuccess: (data, variables) => {
      const oldAppointments = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.PAST_THREE_MONTHS,
      ]) as AppointmentsGetData

      const newAppointmentsList = oldAppointments.data.map((appointment) => {
        const newAppointment = { ...appointment }

        //TODO: Find a better way to identify the appointment and append the claim data
        if (
          newAppointment.attributes.startDateUtc === variables.appointmentDateTime &&
          newAppointment.attributes.location.id === variables.facilityStationNumber &&
          !newAppointment.attributes.travelPayClaim?.claim?.id
        ) {
          newAppointment.attributes.travelPayClaim = {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully',
              success: true,
            },
            claim: data?.data,
          }
        }
        return { ...newAppointment }
      })

      const newAppointments = {
        data: newAppointmentsList,
        meta: {
          ...oldAppointments.meta,
        },
      }

      queryClient.setQueryData(
        [appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS],
        newAppointments,
      )
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaim: Service error')
      }
    },
  })
}
