import { DateTime, type DateTimeUnit } from 'luxon'

import { AppointmentData } from 'api/types'
import mocks from 'store/api/demo/mocks/appointments.json'
import { filterAppointments } from 'utils/appointments'

type AppointmentDataMod = Omit<AppointmentData, 'attributes'> & {
  attributes: Record<string, unknown> & {
    startDateLocal: string
    startDateUtc: string
  }
}

const modifyAppt = (
  inappt: AppointmentDataMod | undefined,
  unit: DateTimeUnit,
  amount: number,
): AppointmentDataMod | undefined => {
  if (!inappt) return undefined
  const appt = structuredClone(inappt) as AppointmentDataMod
  const startDate = DateTime.now().plus({ [unit]: amount })
  appt.attributes.startDateLocal = startDate.toISO()
  appt.attributes.startDateUtc = startDate.toUTC().toISO()
  appt.id = `${startDate.valueOf()}`
  return appt
}

// could choose either
const { upcoming } = mocks['/v0/appointments']
const exampleData = [
  // 1 day future video
  modifyAppt(
    upcoming.data.find(
      (appt) => appt.attributes.status === 'BOOKED' && appt.attributes.appointmentType === 'VA_VIDEO_CONNECT_HOME',
    ),
    'day',
    2,
  ),
  // 1 hour ago not video
  modifyAppt(
    upcoming.data.find((appt) => appt.attributes.status === 'BOOKED' && appt.attributes.appointmentType === 'VA'),
    'hour',
    -1,
  ),
  // 1 hour ago video
  modifyAppt(
    upcoming.data.find(
      (appt) => appt.attributes.status === 'BOOKED' && appt.attributes.appointmentType === 'VA_VIDEO_CONNECT_HOME',
    ),
    'hour',
    -1,
  ),
  // 4 hours ago video
  modifyAppt(
    upcoming.data.find(
      (appt) => appt.attributes.status === 'BOOKED' && appt.attributes.appointmentType === 'VA_VIDEO_CONNECT_HOME',
    ),
    'hour',
    -4,
  ),
]

describe('appointments utility: filterAppointments', () => {
  it('should return only appointments that should be shown in the past most picker option', () => {
    const filteredAppointmentsPast = filterAppointments(exampleData as AppointmentData[], true)
    expect(filteredAppointmentsPast).toBeDefined()
    expect(filteredAppointmentsPast).toHaveLength(2)
    expect(filteredAppointmentsPast?.[0].id).toBe(exampleData?.[1]?.id) // 1 hour ago not video
    expect(filteredAppointmentsPast?.[1].id).toBe(exampleData?.[3]?.id) // 4 hours ago video
  })
  it('should return only appointments that should be shown in the future for upcoming', () => {
    const filteredAppointmentsFuture = filterAppointments(exampleData as AppointmentData[]) // default false for 2nd param
    expect(filteredAppointmentsFuture).toBeDefined()
    expect(filteredAppointmentsFuture).toHaveLength(2)
    expect(filteredAppointmentsFuture?.[0].id).toBe(exampleData?.[0]?.id) // 2 days in future
    expect(filteredAppointmentsFuture?.[1].id).toBe(exampleData?.[2]?.id) // 1 hour ago video
  })
})
