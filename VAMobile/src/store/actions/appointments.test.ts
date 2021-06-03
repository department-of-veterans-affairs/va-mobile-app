import _ from 'underscore'

import * as api from '../api'
import {context, realStore, when} from 'testUtils'
import {
  getAppointment,
  getAppointmentsInDateRange,
  TimeFrameType,
  prefetchAppointments,
  AppointmentsDateRange
} from './appointments'
import { AppointmentsList, AppointmentsMetaPagination } from '../api'
import {
  groupAppointmentsByYear,
  initialAppointmentsState,
  InitialState,
  mapAppointmentsById
} from '../reducers'
import { DEFAULT_PAGE_SIZE } from 'constants/common'

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
      const mockMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: mockAppointments.length,
      } as AppointmentsMetaPagination
      const mockAppointmentsGetData = { data: mockAppointments, meta: { pagination: mockMetaPagination }}

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue(mockAppointmentsGetData)

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST_THREE_MONTHS, 1))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.pastCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(mockAppointments))
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(mockAppointments))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.upcomingCurrentPageAppointmentsByYear).toEqual({})
      expect(appointments.upcomingAppointmentsById).toEqual({})
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointments.pastThreeMonths).toEqual(mockAppointments)
      expect(appointments.loadedAppointmentsMetaPagination.pastThreeMonths).toEqual(mockMetaPagination)
      expect(appointments.upcomingPageMetaData).toEqual({
        currentPage: 1,
        perPage: 0,
        totalEntries: 0,
      })
      expect(appointments.pastPageMetaData).toEqual(mockMetaPagination)
    })

    it('should use loadedAppointments data when available', async () => {
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      const mockMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: bookedAppointmentsList.length,
      } as AppointmentsMetaPagination

      const store = realStore({
        ...InitialState,
        appointments: {
          ...initialAppointmentsState,
          loadedAppointments: {
            upcoming: bookedAppointmentsList,
            pastThreeMonths: [],
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
          loadedAppointmentsMetaPagination: {
            ...initialAppointmentsState.loadedAppointmentsMetaPagination,
            upcoming: mockMetaPagination
          },
          upcomingPageMetaData: mockMetaPagination
        }
      })
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.UPCOMING, 1))

      expect(api.get).not.toBeCalled()
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.upcomingCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(bookedAppointmentsList))
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointments.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.loadedAppointmentsMetaPagination.upcoming).toEqual(mockMetaPagination)
      expect(appointments.upcomingPageMetaData).toEqual(mockMetaPagination)
    })

    it('should set pastVaServiceError if VA service unavailable', async () => {
      const startDate = '2021-01-06T04:30:00.000+00:00'
      const endDate = '2021-01-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: [], meta: {
              errors: [
                {
                  status: '502',
                  source: "VA Service",
                  title: 'Backend Service Exception',
                  detail: ''
                }
              ]
            }})

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST_THREE_MONTHS, 1))
      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeTruthy()
      expect(appointments.pastCcServiceError).toBeFalsy()
    })

    it('should set pastCcServiceError if Community Care service is unavailable', async () => {
      const startDate = '2021-01-06T04:30:00.000+00:00'
      const endDate = '2021-01-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: [], meta: {
              errors: [
                {
                  status: '502',
                  source: "Community Care Service",
                  title: 'Backend Service Exception',
                  detail: ''
                }
              ]
            }})

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST_THREE_MONTHS, 1))
      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.pastCcServiceError).toBeTruthy()
    })

    it('should return error if it fails', async () => {
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      const error = new Error('Backend error')

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST_THREE_MONTHS, 1))

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
    it('should be able to get appointment from past', async () => {
      const store = realStore({
        appointments: {
          ...initialAppointmentsState,
          loading: false,
          loadingAppointmentCancellation: false,
          upcomingVaServiceError: false,
          upcomingCcServiceError: false,
          pastVaServiceError: false,
          pastCcServiceError: false,
          pastAppointmentsById: {
            '1': canceledAppointmentList[0]
          },
          loadedAppointments: {
            upcoming: [],
            pastThreeMonths: canceledAppointmentList,
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
        }

      })
      await store.dispatch(getAppointment('1'))

      const actions = store.getActions()

      const action = _.find(actions, { type: 'APPOINTMENTS_GET_APPOINTMENT' })
      expect(action).toBeTruthy()

      const { appointments } = store.getState()
      expect(appointments.appointment).toEqual(canceledAppointmentList[0])
      expect(appointments.error).toBeFalsy()
    })
  })

  it('should be able to get appointment from upcoming', async () => {
    const store = realStore({
      appointments: {
        ...initialAppointmentsState,
        loading: false,
        loadingAppointmentCancellation: false,
        upcomingVaServiceError: false,
        upcomingCcServiceError: false,
        pastVaServiceError: false,
        pastCcServiceError: false,
        upcomingAppointmentsById: {
          '1': bookedAppointmentsList[0]
        },
        loadedAppointments: {
          upcoming: bookedAppointmentsList,
          pastThreeMonths: [],
          pastFiveToThreeMonths: [],
          pastEightToSixMonths: [],
          pastElevenToNineMonths: [],
          pastAllCurrentYear: [],
          pastAllLastYear: [],
        },
      }

    })
    await store.dispatch(getAppointment('1'))

    const actions = store.getActions()

    const action = _.find(actions, { type: 'APPOINTMENTS_GET_APPOINTMENT' })
    expect(action).toBeTruthy()

    const { appointments } = store.getState()
    expect(appointments.appointment).toEqual(bookedAppointmentsList[0])
    expect(appointments.error).toBeFalsy()
  })

  describe('prefetchAppointments', () => {
    it('should prefetch upcoming and past appointments', async () => {
      const upcomingStartDate = '2021-08-06T04:30:00.000+00:00'
      const upcomingEndDate = '2021-08-06T05:30:00.000+00:00'
      const mockUpcomingMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: bookedAppointmentsList.length,
      } as AppointmentsMetaPagination
      const mockBookedAppointmentsGetData = { data: bookedAppointmentsList, meta: { pagination: mockUpcomingMetaPagination } }

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue(mockBookedAppointmentsGetData)

      const pastStartDate = '2020-01-06T04:30:00.000+00:00'
      const pastEndDate = '2020-01-06T05:30:00.000+00:00'
      const mockPastMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: canceledAppointmentList.length,
      } as AppointmentsMetaPagination
      const mockCancelAppointmentsGetData = { data: canceledAppointmentList, meta: { pagination: mockPastMetaPagination}}


      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue(mockCancelAppointmentsGetData)

      const upcomingRange: AppointmentsDateRange = {
        startDate: upcomingStartDate,
        endDate: upcomingEndDate,
      }
      const pastRange: AppointmentsDateRange = {
        startDate: pastStartDate,
        endDate: pastEndDate,
      }

      const store = realStore()
      await store.dispatch(prefetchAppointments(upcomingRange, pastRange))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_PREFETCH_APPOINTMENTS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.pastCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(canceledAppointmentList))
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(canceledAppointmentList))
      expect(appointments.upcomingCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(bookedAppointmentsList))
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointments.pastThreeMonths).toEqual(canceledAppointmentList)
      expect(appointments.loadedAppointmentsMetaPagination.pastThreeMonths).toEqual(mockPastMetaPagination)
      expect(appointments.pastPageMetaData).toEqual(mockPastMetaPagination)
      expect(appointments.loadedAppointments.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.loadedAppointmentsMetaPagination.upcoming).toEqual(mockUpcomingMetaPagination)
      expect(appointments.upcomingPageMetaData).toEqual(mockUpcomingMetaPagination)
    })

    it('should use loadedAppointments data when available', async () => {
      const upcomingStartDate = '2021-08-06T04:30:00.000+00:00'
      const upcomingEndDate = '2021-08-06T05:30:00.000+00:00'
      const mockUpcomingMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: bookedAppointmentsList.length,
      } as AppointmentsMetaPagination

      const pastStartDate = '2020-01-06T04:30:00.000+00:00'
      const pastEndDate = '2020-01-06T05:30:00.000+00:00'
      const mockPastMetaPagination = {
        currentPage: 1,
        perPage: 10,
        totalEntries: canceledAppointmentList.length,
      } as AppointmentsMetaPagination

      const upcomingRange: AppointmentsDateRange = {
        startDate: upcomingStartDate,
        endDate: upcomingEndDate,
      }
      const pastRange: AppointmentsDateRange = {
        startDate: pastStartDate,
        endDate: pastEndDate,
      }


      const store = realStore({
        ...InitialState,
        appointments: {
          ...initialAppointmentsState,
          loadedAppointments: {
            upcoming: bookedAppointmentsList,
            pastThreeMonths: canceledAppointmentList,
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
          loadedAppointmentsMetaPagination: {
            ...initialAppointmentsState.loadedAppointmentsMetaPagination,
            upcoming: mockUpcomingMetaPagination,
            pastThreeMonths: mockPastMetaPagination
          },
          upcomingPageMetaData: mockUpcomingMetaPagination,
          pastPageMetaData: mockPastMetaPagination
        }
      })

      await store.dispatch(prefetchAppointments(upcomingRange, pastRange))

      expect(api.get).not.toBeCalled()
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_PREFETCH_APPOINTMENTS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.pastCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(canceledAppointmentList))
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(canceledAppointmentList))
      expect(appointments.upcomingCurrentPageAppointmentsByYear).toEqual(groupAppointmentsByYear(bookedAppointmentsList))
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointments.pastThreeMonths).toEqual(canceledAppointmentList)
      expect(appointments.loadedAppointmentsMetaPagination.pastThreeMonths).toEqual(mockPastMetaPagination)
      expect(appointments.pastPageMetaData).toEqual(mockPastMetaPagination)
      expect(appointments.loadedAppointments.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.loadedAppointmentsMetaPagination.upcoming).toEqual(mockUpcomingMetaPagination)
      expect(appointments.upcomingPageMetaData).toEqual(mockUpcomingMetaPagination)
    })

    it('should set upcomingVaServiceError if VA service unavailable', async () => {
      const upcomingStartDate = '2019-08-06T04:30:00.000+00:00'
      const upcomingEndDate = '2019-08-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: [], meta: {
              errors: [
                {
                  status: '502',
                  source: "VA Service",
                  title: 'Backend Service Exception',
                  detail: ''
                }
              ]
            }})

      const pastStartDate = '2019-01-06T04:30:00.000+00:00'
      const pastEndDate = '20219-01-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: []})

      const upcomingRange: AppointmentsDateRange = {
        startDate: upcomingStartDate,
        endDate: upcomingEndDate,
      }
      const pastRange: AppointmentsDateRange = {
        startDate: pastStartDate,
        endDate: pastEndDate,
      }

      const store = realStore()
      await store.dispatch(prefetchAppointments(upcomingRange, pastRange))

      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeTruthy()
      expect(appointments.upcomingCcServiceError).toBeFalsy()
    })

    it('should set upcomingCcServiceError if Community Care service is unavailable', async () => {
      const upcomingStartDate = '2021-12-06T04:30:00.000+00:00'
      const upcomingEndDate = '2021-12-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: [], meta: {
              errors: [
                {
                  status: '502',
                  source: "Community Care Service",
                  title: 'Backend Service Exception',
                  detail: ''
                }
              ]
            }})

      const pastStartDate = '2020-11-06T04:30:00.000+00:00'
      const pastEndDate = '2020-11-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
          .mockResolvedValue({ data: []})

      const upcomingRange: AppointmentsDateRange = {
        startDate: upcomingStartDate,
        endDate: upcomingEndDate,
      }
      const pastRange: AppointmentsDateRange = {
        startDate: pastStartDate,
        endDate: pastEndDate,
      }

      const store = realStore()
      await store.dispatch(prefetchAppointments(upcomingRange, pastRange))

      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.upcomingCcServiceError).toBeTruthy()
    })
  })

  it('should return error if it fails', async () => {
    const upcomingStartDate = '2021-08-06T04:30:00.000+00:00'
    const upcomingEndDate = '2021-08-06T05:30:00.000+00:00'

    const pastStartDate = '2020-01-06T04:30:00.000+00:00'
    const pastEndDate = '2020-01-06T05:30:00.000+00:00'

    const upcomingRange: AppointmentsDateRange = {
      startDate: upcomingStartDate,
      endDate: upcomingEndDate,
    }
    const pastRange: AppointmentsDateRange = {
      startDate: pastStartDate,
      endDate: pastEndDate,
    }

    const error = new Error('Backend error')

    when(api.get as jest.Mock)
        .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, useCache: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1'})
        .mockRejectedValue(error)

    const store = realStore()
    await store.dispatch(prefetchAppointments(upcomingRange, pastRange))

    const actions = store.getActions()

    const startAction = _.find(actions, { type: 'APPOINTMENTS_START_PREFETCH_APPOINTMENTS' })
    expect(startAction).toBeTruthy()

    const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_PREFETCH_APPOINTMENTS' })
    expect(endAction).toBeTruthy()
    expect(endAction?.state.appointments.loading).toBe(false)

    const { appointments } = store.getState()
    expect(appointments.error).toEqual(error)
  })
})
