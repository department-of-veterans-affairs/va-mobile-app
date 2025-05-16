import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

import { appointmentsKeys } from 'api/appointments'
import { AppointmentsGetData, SubmitSMOCTravelPayClaimParameters, SubmitTravelPayClaimResponseData } from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { Params as APIParams, post } from 'store/api/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { appendClaimDataToAppointment, stripTZOffset } from 'utils/travelPay'

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
export const useSubmitTravelClaim = (appointmentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitClaim,
    onSuccess: (data) => {
      // Find what appointment queries have data
      const appointmentQueries = queryClient.getQueriesData<AppointmentsGetData>({
        queryKey: [appointmentsKeys.appointments],
      })

      // Filter out to only the queries where an appointment can submit a claim and that appointment is in the query data
      const validAppointmentQueries = appointmentQueries.filter(([queryKey, queryData]) => {
        const timeFrame = queryKey[1] as TimeFrameType
        return (
          [TimeFrameTypeConstants.PAST_THREE_MONTHS, TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR].includes(
            timeFrame,
          ) &&
          !!queryData &&
          queryData.data.some((appointment) => appointment.id === appointmentId)
        )
      }) as [QueryKey, AppointmentsGetData][]

      // Append the claim data to the appointments in the query data
      const newAppointmentsQueryData = validAppointmentQueries.map(([queryKey, queryData]) => {
        const newQueryData = {
          data: queryData?.data.map((appointment) => {
            if (appointment.id === appointmentId) {
              return appendClaimDataToAppointment(appointment, data?.data)
            }
            return { ...appointment }
          }),
          meta: { ...queryData.meta },
        }
        return [queryKey, newQueryData] as [QueryKey, AppointmentsGetData]
      })

      // Update the query data for the valid appointment queries
      newAppointmentsQueryData.forEach(([queryKey, queryData]) => {
        queryClient.setQueryData(queryKey, queryData)
      })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaim: Service error')
      }
    },
  })
}
