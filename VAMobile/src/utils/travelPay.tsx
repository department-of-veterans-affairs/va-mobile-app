import { AppointmentData, TravelPayClaimSummary } from 'api/types'

export function stripTZOffset(datetimeString: string) {
  // We need the local time with no TZ indicators for the external API
  // There are 19 characters in the string required by the external API
  // i.e. 2024-06-25T08:00:00
  return datetimeString.slice(0, 19)
}

/**
 * Appends the claim data to the appointment
 * @param appointment - The appointment to append the claim data to
 * @param claimData - The claim data to append to the appointment
 * @returns The appointment with the claim data appended
 */
export function appendClaimDataToAppointment(
  appointment: AppointmentData,
  claimData?: TravelPayClaimSummary,
): AppointmentData {
  const newAppointment = {
    ...appointment,
    attributes: {
      ...appointment.attributes,
      travelPayClaim: {
        metadata: {
          status: 200,
          message: 'Data retrieved successfully',
          success: true,
        },
        claim: claimData,
      },
    },
  }

  return newAppointment
}
