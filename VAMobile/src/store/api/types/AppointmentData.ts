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
  [AppointmentTypeConstants.COMMUNITY_CARE]: 'upcomingAppointments.communityCare',
  [AppointmentTypeConstants.VA]: 'upcomingAppointments.vaAppointment',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS]: 'upcomingAppointments.connectAtAtlas',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME]: 'upcomingAppointments.connectAtHome',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE]: 'upcomingAppointments.connectOnsite',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE]: 'upcomingAppointments.connectGFE',
}

/* Mirrors AppointmentTypeToID but is the a11y friendly version where any VA is converted to V-A */
export const AppointmentTypeToA11yLabel = {
  [AppointmentTypeConstants.COMMUNITY_CARE]: 'upcomingAppointments.communityCare', // this one does not have 'VA' so it can be the plain text
  [AppointmentTypeConstants.VA]: 'upcomingAppointments.vaAppointment.a11yLabel',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS]: 'upcomingAppointments.connectAtAtlas.a11yLabel',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME]: 'upcomingAppointments.connectAtHome.a11yLabel',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE]: 'upcomingAppointments.connectOnsite.a11yLabel',
  [AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE]: 'upcomingAppointments.connectGFE.a11yLabel',
}

export type AppointmentPractitioner = {
  prefix: string
  firstName: string
  middleName: string
  lastName: string
}

export type AppointmentAddress = {
  street: string
  city: string
  state: string // i.e. CA
  zipCode: string
}

export type AppointmentPhone = {
  areaCode: string
  number: string // i.e. 123-456-7890
  extension?: string
}

export type AppointmentLocation = {
  name: string
  address?: AppointmentAddress
  lat?: number
  long?: number
  phone?: AppointmentPhone
  url?: string
  code?: string
}

export type AppointmentTimeZone = 'Pacific/Honolulu' | 'America/Anchorage' | 'America/Los_Angeles' | 'America/Phoenix' | 'America/Denver' | 'America/Chicago' | 'America/New_York'

export type AppointmentStatus = 'BOOKED' | 'CANCELLED'

export type AppointmentType = 'COMMUNITY_CARE' | 'VA' | 'VA_VIDEO_CONNECT_ATLAS' | 'VA_VIDEO_CONNECT_HOME' | 'VA_VIDEO_CONNECT_ONSITE' | 'VA_VIDEO_CONNECT_GFE'

export type AppointmentAttributes = {
  appointmentType: AppointmentType
  cancelId?: string
  status: AppointmentStatus
  minutesDuration: number
  comment: string
  timeZone: AppointmentTimeZone
  healthcareService: string
  location: AppointmentLocation
  practitioner?: AppointmentPractitioner
  facilityId?: string
  startDateLocal: string
  startDateUtc: string
}

export type AppointmentData = {
  type: string
  id: string
  attributes: AppointmentAttributes
}

export type AppointmentsErrorServiceTypes = 'VA Service' | 'Community Care Service'

export const AppointmentsErrorServiceTypesConstants: {
  VA: AppointmentsErrorServiceTypes
  COMMUNITY_CARE: AppointmentsErrorServiceTypes
} = {
  VA: 'VA Service',
  COMMUNITY_CARE: 'Community Care Service',
}

export type AppointmentsMetaError = {
  status?: string
  source?: AppointmentsErrorServiceTypes
  title?: string
  body?: string
}

/**
 * currentPage - use to tell us what page we are currently showing when paginating
 * perPage - the page size for each page
 * totalEntries - total number of items
 */
export type AppointmentsMetaPagination = {
  currentPage: number
  perPage: number
  totalEntries: number
}

export type AppointmentsGetDataMeta = {
  errors?: Array<AppointmentsMetaError>
  pagination?: AppointmentsMetaPagination
  // This property does not exist in api, used to track if the data(AppointmentsGetData) return was from an api call
  dataFromStore?: boolean
}

export type AppointmentsGetData = {
  data: AppointmentsList
  meta?: AppointmentsGetDataMeta
}

export type AppointmentsList = Array<AppointmentData>

export type AppointmentsMap = {
  [key: string]: AppointmentData
}

export type AppointmentsGroupedByMonth = {
  [key: string]: AppointmentsList
}

export type AppointmentsGroupedByYear = {
  [key: string]: AppointmentsGroupedByMonth
}

export type AppointmentCancellationStatusTypes = 'SUCCESS' | 'FAIL'

export const AppointmentCancellationStatusConstants: {
  SUCCESS: AppointmentCancellationStatusTypes
  FAIL: AppointmentCancellationStatusTypes
} = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}
