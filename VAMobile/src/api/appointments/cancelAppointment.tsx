import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'

import { AppointmentStatusConstants, AppointmentsGetData } from 'api/types'
import { DEFAULT_UPCOMING_DAYS_LIMIT, TimeFrameTypeConstants } from 'constants/appointments'
import { put } from 'store/api'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'

import { appointmentsKeys } from './queryKeys'

/**
 * Determines whether a date is within the specified number of days (defaults to 7 days)
 */
const isWithinDaysLimit = (date: string, upcomingDaysLimit?: number) => {
  const currentDate = DateTime.now()
  return DateTime.fromISO(date).diff(currentDate, 'days').days <= (upcomingDaysLimit || DEFAULT_UPCOMING_DAYS_LIMIT)
}

/**
 * Cancels a user's appointment
 */
const cancelAppointment = (cancelID: string) => {
  return put(`/v0/appointments/cancel/${cancelID}`)
}

/**
 * Returns a mutation for canceling an appointment
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess(_, variables) {
      registerReviewEvent()
      const oldAppointments = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.UPCOMING,
      ]) as AppointmentsGetData
      let appointmentStartDate = ''

      const newAppointmentsList = oldAppointments.data.map((appointment) => {
        const newAppointment = { ...appointment }

        if (newAppointment.attributes.cancelId === variables) {
          newAppointment.attributes.status = AppointmentStatusConstants.CANCELLED
          appointmentStartDate = newAppointment.attributes.startDateUtc
        }

        return { ...newAppointment }
      })

      const newAppointments = {
        data: newAppointmentsList,
        meta: {
          ...oldAppointments.meta,
          upcomingAppointmentsCount:
            oldAppointments.meta?.upcomingAppointmentsCount &&
            isWithinDaysLimit(appointmentStartDate, oldAppointments.meta?.upcomingDaysLimit)
              ? oldAppointments.meta.upcomingAppointmentsCount - 1
              : oldAppointments.meta?.upcomingAppointmentsCount,
        },
      }

      queryClient.setQueryData([appointmentsKeys.appointments, TimeFrameTypeConstants.UPCOMING], newAppointments)
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'cancelAppointment: Service error')
      }
    },
  })
}
