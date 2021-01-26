import { AppointmentsList } from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { setCommonError, setTryAgainAction } from './errors'

const bookedAppointmentsList: AppointmentsList = [
  {
    type: 'appointment',
    id: '1',
    attributes: {
      appointmentType: 'COMMUNITY_CARE',
      status: 'BOOKED',
      startTime: '2021-02-06T19:53:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2022-03-06T19:53:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-02-10T17:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-04-22T20:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-04-30T20:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-08-11T20:15:14.000+00:00',
      minutesDuration: 150,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-02-06T19:53:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2022-03-06T19:53:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-02-10T17:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-04-22T20:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-04-30T20:15:14.000+00:00',
      minutesDuration: 60,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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
      startTime: '2021-08-11T20:15:14.000+00:00',
      minutesDuration: 150,
      comment: 'Please arrive 20 minutes before the start of your appointment',
      timeZone: 'America/Los_Angeles',
      healthcareService: 'Blind Rehabilitation Center',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          line1: '5901 East 7th Street',
          line2: 'Building 166',
          line3: '',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          number: '123-456-7890',
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

export enum TimeFrameType {
  PAST,
  UPCOMING,
}

const dispatchStartGetAppointmentsInDateRange = (): ReduxAction => {
  return {
    type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {},
  }
}

const dispatchFinishGetAppointmentsInDateRange = (appointmentsList?: AppointmentsList, timeFrame?: TimeFrameType, error?: Error): ReduxAction => {
  return {
    type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE',
    payload: {
      appointmentsList,
      error,
      timeFrame,
    },
  }
}

/**
 * Redux action to get all appointments in the given date range
 */
export const getAppointmentsInDateRange = (startDate: string, endDate: string, timeFrame: TimeFrameType): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    await dispatch(setTryAgainAction(() => dispatch(getAppointmentsInDateRange(startDate, endDate, timeFrame))))
    dispatch(dispatchStartGetAppointmentsInDateRange())

    try {
      // const appointmentsList = await api.get<AppointmentsList>('/v0/appointments', {startDate, endDate} as Params)
      console.log('Parameters: ', startDate, endDate, timeFrame)
      // TODO: use endpoint when available
      const appointmentsList = [...bookedAppointmentsList, ...canceledAppointmentList]

      dispatch(dispatchFinishGetAppointmentsInDateRange(appointmentsList, timeFrame))
      // TODO: uncomment below when endpoint is available
      // await dispatch(clearErrors())
    } catch (error) {
      dispatch(dispatchFinishGetAppointmentsInDateRange(undefined, undefined, error))
      await dispatch(setCommonError(error))
    }
  }
}

const dispatchGetAppointment = (appointmentID: string): ReduxAction => {
  return {
    type: 'APPOINTMENTS_GET_APPOINTMENT',
    payload: {
      appointmentID,
    },
  }
}

/**
 * Redux action to get a single appointment
 */
export const getAppointment = (appointmentID: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchGetAppointment(appointmentID))
  }
}
