import {
  AppointmentAddress,
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentPhone,
  AppointmentPractitioner,
  AppointmentStatusConstants,
  AppointmentTypeConstants,
} from 'store/api/types'

export const defaultAppointmentAddress: AppointmentAddress = {
  street: '5901 East 7th Street',
  city: 'Long Beach',
  state: 'CA',
  zipCode: '90822',
}

export const defaultAppointmentPhone: AppointmentPhone = {
  areaCode: '123',
  number: '456-7890',
  extension: '',
}

export const defaultAppointmentLocation: AppointmentLocation = {
  name: 'VA Long Beach Healthcare System',
  address: defaultAppointmentAddress,
  phone: defaultAppointmentPhone,
  url: '',
  code: '123 code',
}

export const defaultAppointmentPractitioner: AppointmentPractitioner = {
  prefix: 'Dr.',
  firstName: 'Larry',
  middleName: '',
  lastName: 'TestDoctor',
}

export const defaultAppointmentAttributes: AppointmentAttributes = {
  appointmentType: AppointmentTypeConstants.VA,
  status: AppointmentStatusConstants.BOOKED,
  statusDetail: null,
  startDateUtc: '2021-02-06T19:53:14.000+00:00',
  startDateLocal: '2021-02-06T18:53:14.000-01:00',
  minutesDuration: 60,
  comment: 'Please arrive 20 minutes before the start of your appointment',
  timeZone: 'America/Los_Angeles',
  healthcareService: 'Blind Rehabilitation Center',
  location: defaultAppointmentLocation,
  practitioner: defaultAppointmentPractitioner,
  phoneOnly: false,
  reason: null,
  covidVaccination: false,
}

export const defaultAppoinment: AppointmentData = {
  type: 'appointment',
  id: '1',
  attributes: defaultAppointmentAttributes,
}
