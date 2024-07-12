import {
  AppointmentAddress,
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentPhone,
  AppointmentPractitioner,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
  AppointmentTypeConstants,
  AppointmentsList,
} from 'api/types'

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
  serviceCategoryName: null,
  healthcareProvider: null,
  location: defaultAppointmentLocation,
  practitioner: defaultAppointmentPractitioner,
  phoneOnly: false,
  reason: null,
  isCovidVaccine: false,
  isPending: false,
  cancelId: '12',
  vetextId: '600;3210206',
}

export const defaultAppoinment: AppointmentData = {
  type: 'appointment',
  id: '1',
  attributes: defaultAppointmentAttributes,
}

export const bookedAppointmentsList: AppointmentsList = [
  { ...defaultAppoinment },
  {
    ...defaultAppoinment,
    id: '2',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      startDateUtc: '2022-03-06T19:53:14.000+00:00',
      startDateLocal: '2022-03-06T18:53:14.000-01:00',
      practitioner: {
        ...defaultAppointmentPractitioner,
        middleName: 'R.',
      },
    },
  },
  {
    ...defaultAppoinment,
    id: '3',
    attributes: {
      ...defaultAppointmentAttributes,
      startDateUtc: '2021-02-10T17:15:14.000+00:00',
      startDateLocal: '2021-02-10T16:15:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '4',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
      startDateUtc: '2021-04-22T20:15:14.000+00:00',
      startDateLocal: '2021-04-22T19:15:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '5',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
      startDateUtc: '2021-04-30T20:15:14.000+00:00',
      startDateLocal: '2021-04-30T19:15:14.000-01:00',
      location: {
        ...defaultAppointmentLocation,
        code: '654321',
      },
    },
  },
  {
    ...defaultAppoinment,
    id: '6',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
      location: {
        ...defaultAppointmentLocation,
        url: '',
        code: '654321',
      },
    },
  },
  {
    ...defaultAppoinment,
    id: '7',
    attributes: {
      ...defaultAppointmentAttributes,
      isCovidVaccine: true,
    },
  },
  {
    ...defaultAppoinment,
    id: '8',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
      status: AppointmentStatusConstants.BOOKED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      comment: 'Please arrive 20 minutes before the start of your appointment',
    },
  },
  {
    ...defaultAppoinment,
    id: '9',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
      status: AppointmentStatusConstants.BOOKED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      comment: 'Please arrive 20 minutes before the start of your appointment',
      location: {
        ...defaultAppointmentAttributes.location,
        phone: undefined,
      },
    },
  },
  {
    ...defaultAppoinment,
    id: '10',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
      location: {
        ...defaultAppointmentLocation,
        url: 'https://dev.care.va.gov',
        code: '654321',
      },
    },
  },
]

export const canceledAppointmentList: AppointmentsList = [
  {
    ...defaultAppoinment,
    id: '7',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '8',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2022-03-06T19:53:14.000+00:00',
      startDateLocal: '2022-03-06T18:53:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '9',
    attributes: {
      ...defaultAppointmentAttributes,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-02-10T17:15:14.000+00:00',
      startDateLocal: '2021-02-10T16:15:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '10',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-04-22T20:15:14.000+00:00',
      startDateLocal: '2021-04-22T19:15:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '11',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-04-30T20:15:14.000+00:00',
      startDateLocal: '2021-04-30T19:15:14.000-01:00',
    },
  },
  {
    ...defaultAppoinment,
    id: '12',
    attributes: {
      ...defaultAppointmentAttributes,
      appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
    },
  },
  {
    ...defaultAppoinment,
    id: '13',
    attributes: {
      ...defaultAppointmentAttributes,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.PATIENT,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
    },
  },
  {
    ...defaultAppoinment,
    id: '14',
    attributes: {
      ...defaultAppointmentAttributes,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.PATIENT_REBOOK,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
    },
  },
  {
    ...defaultAppoinment,
    id: '15',
    attributes: {
      ...defaultAppointmentAttributes,
      status: AppointmentStatusConstants.CANCELLED,
      statusDetail: AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
    },
  },
]
