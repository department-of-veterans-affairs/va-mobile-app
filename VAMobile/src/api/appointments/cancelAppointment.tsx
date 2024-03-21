import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as underscore from 'underscore'

import { AppointmentStatusConstants, AppointmentsGetData } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { put } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { appointmentsKeys } from './queryKeys'

/**
 * Cancels a user's appointment
 */
const cancelAppointment = (cancelID: string) => {
  return put(`/v0/appointments/cancel/${cancelID}`)
}

/**
 * Returns a mutation for canceling an appointment
 */
export const useCancelAppointment = (currentPage: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelAppointment,
    onSettled: () => {
      registerReviewEvent()
    },
    onSuccess(_, variables) {
      const appointmentsData = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.UPCOMING,
        currentPage,
      ]) as AppointmentsGetData
      const newAppointmentsList = underscore.map(appointmentsData.data, (appointment) => {
        const newAppointment = { ...appointment }

        if (newAppointment.attributes.cancelId === variables) {
          newAppointment.attributes.status = AppointmentStatusConstants.CANCELLED
        }

        return { ...newAppointment }
      })
      appointmentsData.data = newAppointmentsList
      queryClient.setQueryData(
        [appointmentsKeys.appointments, TimeFrameTypeConstants.UPCOMING, currentPage],
        appointmentsData,
      )
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'cancelAppointment: Service error')
      }
    },
  })
}
