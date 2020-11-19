export const AppointmentTimeZoneConstants: {
  PacificHonolulu: AppointmentTimeZone
  AmericaAnchorage: AppointmentTimeZone
  AmericaLosAngeles: AppointmentTimeZone
  AmericaPhoenix: AppointmentTimeZone
  AmericaDenver: AppointmentTimeZone
  AmericaChicago: AppointmentTimeZone
  AmericaNewYork: AppointmentTimeZone
} = {
  PacificHonolulu: 'Pacific/Honolulu',
  AmericaAnchorage: 'America/Anchorage',
  AmericaLosAngeles: 'America/Los_Angeles',
  AmericaPhoenix: 'America/Phoenix',
  AmericaDenver: 'America/Denver',
  AmericaChicago: 'America/Chicago',
  AmericaNewYork: 'America/New_York',
}

export const AppointmentStatusConstants: {
  BOOKED: AppointmentStatus
  CANCELLED: AppointmentStatus
} = {
  BOOKED: 'BOOKED',
  CANCELLED: 'CANCELLED',
}

export const AppointmentTypeConstants: {
  COMMUNITY_CARE: AppointmentType
  VA: AppointmentType
  VA_VIDEO_CONNECT_ATLAS: AppointmentType
  VA_VIDEO_CONNECT_HOME: AppointmentType
  VA_VIDEO_CONNECT_ONSITE: AppointmentType
  VA_VIDEO_CONNECT_GFE: AppointmentType
} = {
  COMMUNITY_CARE: 'COMMUNITY_CARE',
  VA: 'VA',
  VA_VIDEO_CONNECT_ATLAS: 'VA_VIDEO_CONNECT_ATLAS',
  VA_VIDEO_CONNECT_HOME: 'VA_VIDEO_CONNECT_HOME',
  VA_VIDEO_CONNECT_ONSITE: 'VA_VIDEO_CONNECT_ONSITE',
  VA_VIDEO_CONNECT_GFE: 'VA_VIDEO_CONNECT_GFE',
}

export const AppointmentTypeToID = {
  [AppointmentTypeConstants.COMMUNITY_CARE]: '',
  [AppointmentTypeConstants.VA]: '',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS]: 'upcomingAppointments.connectAtAtlas',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME]: 'upcomingAppointments.connectAtHome',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE]: 'upcomingAppointments.connectOnsite',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE]: 'upcomingAppointments.connectGFE',
}

export type AppointmentPractitioner = {
  prefix: string
  firstName: string
  middleName: string
  lastName: string
}

export type AppointmentAddress = {
  line1: string
  line2?: string
  line3?: string
  city: string
  state: string // i.e. CA
  zipCode: string
}

export type AppointmentPhone = {
  number: string // i.e. 123-456-7890
  extension?: string
}

export type AppointmentLocation = {
  name: string
  address?: AppointmentAddress
  phone?: AppointmentPhone
  url?: string
  code?: string
}

export type AppointmentTimeZone = 'Pacific/Honolulu' | 'America/Anchorage' | 'America/Los_Angeles' | 'America/Phoenix' | 'America/Denver' | 'America/Chicago' | 'America/New_York'

export type AppointmentStatus = 'BOOKED' | 'CANCELLED'

export type AppointmentType = 'COMMUNITY_CARE' | 'VA' | 'VA_VIDEO_CONNECT_ATLAS' | 'VA_VIDEO_CONNECT_HOME' | 'VA_VIDEO_CONNECT_ONSITE' | 'VA_VIDEO_CONNECT_GFE'

export type AppointmentAttributes = {
  appointmentType: AppointmentType
  status: AppointmentStatus
  startTime: string
  minutesDuration: number
  comment: string
  timeZone: AppointmentTimeZone
  healthcareService: string
  location: AppointmentLocation
  practitioner?: AppointmentPractitioner
}

export type AppointmentData = {
  type: string
  id: string
  attributes: AppointmentAttributes
}

export type AppointmentsList = Array<AppointmentData>

export type AppointmentsGroupedByMonth = {
  [key: string]: AppointmentsList
}

export type AppointmentsGroupedByYear = {
  [key: string]: AppointmentsGroupedByMonth
}
