import _ from 'underscore'

import * as api from '../api'
import {context, realStore, when} from 'testUtils'
import {
  getAppointment,
  getAppointmentsInDateRange,
  prefetchAppointments,
  AppointmentsDateRange
} from './appointments'
import { AppointmentsList, AppointmentsMetaPagination } from '../api'
import {
  groupAppointmentsByYear,
  initialAppointmentsState,
  initialPaginationState,
  InitialState,
  mapAppointmentsById
} from '../reducers'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { AppointmentTypeConstants, AppointmentStatusConstants, AppointmentStatusDetailTypeConsts } from 'store/api/types'
import { defaultAppoinment, defaultAppointmentPractitioner, defaultAppointmentAttributes, defaultAppointmentLocation } from 'utils/tests/appointments'

const bookedAppointmentsList: AppointmentsList = [
  {...defaultAppoinment},
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
        url: 'https://www.va.gov/health-care/schedule-view-va-appointments/',
        code: '654321',
      },
    },
  },
]

const canceledAppointmentList: AppointmentsList = [
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
          .calledWith('/v0/appointments', { startDate, endDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
          .mockResolvedValue(mockAppointmentsGetData)

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameTypeConstants.PAST_THREE_MONTHS, 1))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.currentPageAppointmentsByYear).toEqual(
        {
          upcoming: {},
          pastThreeMonths: groupAppointmentsByYear(mockAppointments),
          pastFiveToThreeMonths: {},
          pastEightToSixMonths: {},
          pastElevenToNineMonths: {},
          pastAllCurrentYear: {},
          pastAllLastYear: {},
        }
      )

      expect(appointments.paginationByTimeFrame).toEqual(
          {
            upcoming: initialPaginationState,
            pastThreeMonths: mockMetaPagination,
            pastFiveToThreeMonths: initialPaginationState,
            pastEightToSixMonths: initialPaginationState,
            pastElevenToNineMonths: initialPaginationState,
            pastAllCurrentYear: initialPaginationState,
            pastAllLastYear: initialPaginationState,
          }
      )
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(mockAppointments))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.upcomingAppointmentsById).toEqual({})
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointmentsByTimeFrame.pastThreeMonths).toEqual(mockAppointments)
      expect(appointments.paginationByTimeFrame.pastThreeMonths).toEqual(mockMetaPagination)
    })

    it('should use loadedAppointmentsByTimeFrame data when available', async () => {
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
          loadedAppointmentsByTimeFrame: {
            upcoming: bookedAppointmentsList,
            pastThreeMonths: [],
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
          paginationByTimeFrame: {
            ...initialAppointmentsState.paginationByTimeFrame,
            upcoming: mockMetaPagination
          },
        }
      })
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameTypeConstants.UPCOMING, 1))

      expect(api.get).not.toBeCalled()
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointmentsByTimeFrame.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.currentPageAppointmentsByYear).toEqual(
          {
            upcoming: groupAppointmentsByYear(bookedAppointmentsList),
            pastThreeMonths: {},
            pastFiveToThreeMonths: {},
            pastEightToSixMonths: {},
            pastElevenToNineMonths: {},
            pastAllCurrentYear: {},
            pastAllLastYear: {},
          }
      )
      expect(appointments.paginationByTimeFrame).toEqual(
          {
            upcoming: mockMetaPagination,
            pastThreeMonths: initialPaginationState,
            pastFiveToThreeMonths: initialPaginationState,
            pastEightToSixMonths: initialPaginationState,
            pastElevenToNineMonths: initialPaginationState,
            pastAllCurrentYear: initialPaginationState,
            pastAllLastYear: initialPaginationState,
          }
      )
    })

    it('should set pastVaServiceError if VA service unavailable', async () => {
      const startDate = '2021-01-06T04:30:00.000+00:00'
      const endDate = '2021-01-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
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
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameTypeConstants.PAST_THREE_MONTHS, 1))
      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeTruthy()
      expect(appointments.pastCcServiceError).toBeFalsy()
    })

    it('should set pastCcServiceError if Community Care service is unavailable', async () => {
      const startDate = '2021-01-06T04:30:00.000+00:00'
      const endDate = '2021-01-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
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
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameTypeConstants.PAST_THREE_MONTHS, 1))
      const { appointments } = store.getState()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.pastCcServiceError).toBeTruthy()
    })

    it('should return error if it fails', async () => {
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      const error = new Error('Backend error')

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate, endDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameTypeConstants.PAST_THREE_MONTHS, 1))

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
          loadedAppointmentsByTimeFrame: {
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
        loadedAppointmentsByTimeFrame: {
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
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: 'startDateUtc'})
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
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
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
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(canceledAppointmentList))
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointmentsByTimeFrame.pastThreeMonths).toEqual(canceledAppointmentList)
      expect(appointments.paginationByTimeFrame.pastThreeMonths).toEqual(mockPastMetaPagination)
      expect(appointments.loadedAppointmentsByTimeFrame.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.paginationByTimeFrame.upcoming).toEqual(mockUpcomingMetaPagination)
      expect(appointments.currentPageAppointmentsByYear).toEqual(
          {
            upcoming: groupAppointmentsByYear(bookedAppointmentsList),
            pastThreeMonths: groupAppointmentsByYear(canceledAppointmentList),
            pastFiveToThreeMonths: {},
            pastEightToSixMonths: {},
            pastElevenToNineMonths: {},
            pastAllCurrentYear: {},
            pastAllLastYear: {},
          }
      )
      expect(appointments.paginationByTimeFrame).toEqual(
          {
            upcoming: mockUpcomingMetaPagination,
            pastThreeMonths: mockPastMetaPagination,
            pastFiveToThreeMonths: initialPaginationState,
            pastEightToSixMonths: initialPaginationState,
            pastElevenToNineMonths: initialPaginationState,
            pastAllCurrentYear: initialPaginationState,
            pastAllLastYear: initialPaginationState,
          }
      )
    })

    it('should use loadedAppointmentsByTimeFrame data when available', async () => {
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
          loadedAppointmentsByTimeFrame: {
            upcoming: bookedAppointmentsList,
            pastThreeMonths: canceledAppointmentList,
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
          paginationByTimeFrame: {
            ...initialAppointmentsState.paginationByTimeFrame,
            upcoming: mockUpcomingMetaPagination,
            pastThreeMonths: mockPastMetaPagination
          },
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
      expect(appointments.pastAppointmentsById).toEqual(mapAppointmentsById(canceledAppointmentList))
      expect(appointments.upcomingAppointmentsById).toEqual(mapAppointmentsById(bookedAppointmentsList))
      expect(appointments.pastCcServiceError).toBeFalsy()
      expect(appointments.pastVaServiceError).toBeFalsy()
      expect(appointments.upcomingCcServiceError).toBeFalsy()
      expect(appointments.upcomingVaServiceError).toBeFalsy()
      expect(appointments.error).toBeFalsy()
      expect(appointments.loadedAppointmentsByTimeFrame.pastThreeMonths).toEqual(canceledAppointmentList)
      expect(appointments.paginationByTimeFrame.pastThreeMonths).toEqual(mockPastMetaPagination)
      expect(appointments.loadedAppointmentsByTimeFrame.upcoming).toEqual(bookedAppointmentsList)
      expect(appointments.paginationByTimeFrame.upcoming).toEqual(mockUpcomingMetaPagination)
      expect(appointments.currentPageAppointmentsByYear).toEqual(
          {
            upcoming: groupAppointmentsByYear(bookedAppointmentsList),
            pastThreeMonths: groupAppointmentsByYear(canceledAppointmentList),
            pastFiveToThreeMonths: {},
            pastEightToSixMonths: {},
            pastElevenToNineMonths: {},
            pastAllCurrentYear: {},
            pastAllLastYear: {},
          }
      )
      expect(appointments.paginationByTimeFrame).toEqual(
          {
            upcoming: mockUpcomingMetaPagination,
            pastThreeMonths: mockPastMetaPagination,
            pastFiveToThreeMonths: initialPaginationState,
            pastEightToSixMonths: initialPaginationState,
            pastElevenToNineMonths: initialPaginationState,
            pastAllCurrentYear: initialPaginationState,
            pastAllLastYear: initialPaginationState,
          }
      )
    })

    it('should set upcomingVaServiceError if VA service unavailable', async () => {
      const upcomingStartDate = '2019-08-06T04:30:00.000+00:00'
      const upcomingEndDate = '2019-08-06T05:30:00.000+00:00'

      when(api.get as jest.Mock)
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: 'startDateUtc'})
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
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
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
          .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: 'startDateUtc'})
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
          .calledWith('/v0/appointments', { startDate: pastStartDate, endDate: pastEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: '-startDateUtc'})
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
        .calledWith('/v0/appointments', { startDate: upcomingStartDate, endDate: upcomingEndDate, 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1', sort: 'startDateUtc'})
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
