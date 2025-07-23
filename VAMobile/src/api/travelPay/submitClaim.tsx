import { CommonActions, useNavigation } from '@react-navigation/native'

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

import { appointmentsKeys } from 'api/appointments'
import { travelPayMutationKeys } from 'api/travelPay'
import {
  AppointmentData,
  AppointmentsGetData,
  SubmitSMOCTravelPayClaimParameters,
  SubmitTravelPayClaimResponse,
} from 'api/types'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { Params as APIParams, post } from 'store/api'
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
  return post<SubmitTravelPayClaimResponse>(endpoint, data as unknown as APIParams)
}

/**
 * Returns a mutation for submitting a travel pay claim
 */
export const useSubmitTravelClaim = (appointmentId: string, appointmentRouteKey: string) => {
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  return useMutation({
    mutationFn: submitClaim,
    mutationKey: [travelPayMutationKeys.submitClaim, appointmentId],
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

      let aptmnt: AppointmentData | undefined

      // Append the claim data to the appointments in the query data
      const newAppointmentsQueryData = validAppointmentQueries.map(([queryKey, queryData]) => {
        const eligibleCount = queryData.meta?.travelPayEligibleCount ? queryData.meta?.travelPayEligibleCount : 1
        const newQueryData = {
          data: queryData?.data.map((appointment) => {
            if (appointment.id === appointmentId) {
              const modifiedAppointment = appendClaimDataToAppointment(appointment, data?.data.attributes)
              if (!aptmnt) {
                aptmnt = modifiedAppointment
              }
              return modifiedAppointment
            }
            return { ...appointment }
          }),
          meta: { ...queryData.meta, travelPayEligibleCount: eligibleCount - 1 },
        }
        return [queryKey, newQueryData] as [QueryKey, AppointmentsGetData]
      })

      // Update the query data for the valid appointment queries
      newAppointmentsQueryData.forEach(([queryKey, queryData]) => {
        queryClient.setQueryData(queryKey, queryData)
      })

      if (aptmnt) {
        // Update the navigation params with the new appointment data
        navigation.dispatch({
          ...CommonActions.setParams({ appointment: aptmnt }),
          source: appointmentRouteKey,
        })
      }
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'submitClaim: Service error')
      }
    },
  })
}
