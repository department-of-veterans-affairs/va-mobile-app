import _ from 'underscore'

import * as api from '../api'
import {context, realStore, when} from 'testUtils'
import {getAppointment, getAppointmentsInDateRange, TimeFrameType} from './appointments'
import {AppointmentsList} from "../api";

const bookedAppointmentsList: AppointmentsList = [
  {
    type: 'appointment',
    id: '1',
    attributes: {
      appointmentType: 'COMMUNITY_CARE',
      status: 'BOOKED',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '2',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE',
      status: 'BOOKED',
      startDateUtc: '2022-03-06T19:53:14.000+00:00',
      startDateLocal: '2022-03-06T18:53:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: 'R.',
        lastName: 'Brown',
      },
    },
  },
  {
    type: 'appointment',
    id: '3',
    attributes: {
      appointmentType: 'VA',
      status: 'BOOKED',
      startDateUtc: '2021-02-10T17:15:14.000+00:00',
      startDateLocal: '2021-02-10T16:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '4',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_GFE',
      status: 'BOOKED',
      startDateUtc: '2021-04-22T20:15:14.000+00:00',
      startDateLocal: '2021-04-22T19:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '5',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_ATLAS',
      status: 'BOOKED',
      startDateUtc: '2021-04-30T20:15:14.000+00:00',
      startDateLocal: '2021-04-30T19:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '654321',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '6',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_HOME',
      status: 'BOOKED',
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: 'https://www.va.gov/health-care/schedule-view-va-appointments/',
        code: '654321',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
]

const canceledAppointmentList: AppointmentsList = [
  {
    type: 'appointment',
    id: '7',
    attributes: {
      appointmentType: 'COMMUNITY_CARE',
      status: 'CANCELLED',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '8',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE',
      status: 'CANCELLED',
      startDateUtc: '2022-03-06T19:53:14.000+00:00',
      startDateLocal: '2022-03-06T18:53:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: 'R.',
        lastName: 'Brown',
      },
    },
  },
  {
    type: 'appointment',
    id: '9',
    attributes: {
      appointmentType: 'VA',
      status: 'CANCELLED',
      startDateUtc: '2021-02-10T17:15:14.000+00:00',
      startDateLocal: '2021-02-10T16:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '10',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_GFE',
      status: 'CANCELLED',
      startDateUtc: '2021-04-22T20:15:14.000+00:00',
      startDateLocal: '2021-04-22T19:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '11',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_ATLAS',
      status: 'CANCELLED',
      startDateUtc: '2021-04-30T20:15:14.000+00:00',
      startDateLocal: '2021-04-30T19:15:14.000-01:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '654321',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
  {
    type: 'appointment',
    id: '12',
    attributes: {
      appointmentType: 'VA_VIDEO_CONNECT_HOME',
      status: 'CANCELLED',
      startDateUtc: '2021-08-11T20:15:14.000+00:00',
      startDateLocal: '2021-08-11T19:15:14.000-01:00',
      minutesDuration: 150,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
        url: '',
        code: '654321',
      },
      practitioner: {
        prefix: 'Dr.',
        firstName: 'Larry',
        middleName: '',
        lastName: 'TestDoctor',
      },
    },
  },
]

context('appointments', () => {
  describe('getAppointmentsInDateRange', () => {
    it('should dispatch the correct actions', async () => {
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      const mockAppointments = [...bookedAppointmentsList, ...canceledAppointmentList]

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate})
          .mockResolvedValue({ data: mockAppointments})

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.appointmentsList).toEqual(mockAppointments)
      expect(appointments.pastAppointmentsByYear).toBeTruthy()
      expect(appointments.error).toBeFalsy()
    })

    it('should return error if it fails', async () => {
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      const error = new Error('Backend error')

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate})
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.error).toEqual(error)
    })
  })

  describe('getAppointment', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getAppointment('1'))

      const actions = store.getActions()

      const action = _.find(actions, { type: 'APPOINTMENTS_GET_APPOINTMENT' })
      expect(action).toBeTruthy()

      const { appointments } = store.getState()
      expect(appointments.error).toBeFalsy()
    })
  })
})
