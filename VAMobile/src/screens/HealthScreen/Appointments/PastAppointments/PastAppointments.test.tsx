import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import PastAppointments from './PastAppointments'
import {} from 'store/slices'
import { AppointmentsGroupedByYear, AppointmentStatus, AppointmentStatusConstants } from 'store/api/types'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getAppointmentsInDateRange, ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { defaultAppoinment, defaultAppointmentAttributes } from 'utils/tests/appointments'

const mockNavigationSpy = jest.fn()
const mockNavigateToSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy.mockReturnValue(mockNavigateToSpy)
    },
  }
})

jest.mock('../../../../utils/platform', () => {
  let actual = jest.requireActual('../../../../utils/platform')
  return {
    ...actual,
    isAndroid: jest.fn(() => {
      return true
    }),
  }
})

jest.mock('store/slices/', () => {
  let actual = jest.requireActual('store/slices')
  let appointment = jest.requireActual('../../../../utils/tests/appointments').defaultAppoinment
  return {
    ...actual,
    getAppointmentsInDateRange: jest.fn(() => {
      return {
        type: '',
        payload: {
          appointmentsList: [{ ...appointment }],
        },
      }
    }),
  }
})

jest.mock('../../../../store/api', () => {
  let api = jest.requireActual('../../../../store/api')

  return {
    ...api,
  }
})

context('PastAppointments', () => {
  let props: any
  let appointmentData = (status: AppointmentStatus = AppointmentStatusConstants.BOOKED, isPending = false): AppointmentsGroupedByYear => {
    return {
      '2020': {
        '3': [
          {
            ...defaultAppoinment,
            attributes: {
              ...defaultAppointmentAttributes,
              status,
              isPending,
            },
          },
        ],
      },
    }
  }

  const initializeTestInstance = (
    currentPagePastAppointmentsByYear: AppointmentsGroupedByYear = {},
    loading: boolean = false,
    errorsState: ErrorsState = initialErrorsState,
  ): void => {
    props = mockNavProps()

    render(<PastAppointments {...props} />, {
      preloadedState: {
        appointments: {
          ...InitialState.appointments,
          loading,
          loadingAppointmentCancellation: false,
          upcomingVaServiceError: false,
          upcomingCcServiceError: false,
          pastVaServiceError: false,
          pastCcServiceError: false,
          currentPageAppointmentsByYear: {
            upcoming: {},
            pastFiveToThreeMonths: {},
            pastEightToSixMonths: {},
            pastElevenToNineMonths: {},
            pastAllCurrentYear: {},
            pastAllLastYear: {},
            pastThreeMonths: currentPagePastAppointmentsByYear,
          },
          loadedAppointmentsByTimeFrame: {
            upcoming: [],
            pastThreeMonths: [],
            pastFiveToThreeMonths: [],
            pastEightToSixMonths: [],
            pastElevenToNineMonths: [],
            pastAllCurrentYear: [],
            pastAllLastYear: [],
          },
          paginationByTimeFrame: {
            upcoming: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },

            pastFiveToThreeMonths: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
            pastEightToSixMonths: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
            pastElevenToNineMonths: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
            pastAllCurrentYear: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
            pastAllLastYear: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
            pastThreeMonths: {
              currentPage: 2,
              totalEntries: 2,
              perPage: 1,
            },
          },
        },
        errors: errorsState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(appointmentData())
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Select a date range')).toBeTruthy()
    expect(screen.getAllByText('Past 3 months')).toBeTruthy()
    expect(screen.getByTestId('Confirmed Saturday, February 6, 2021 11:53 AM PST VA Long Beach Healthcare System In-person')).toBeTruthy()
    expect(screen.getByText('2 to 2 of 2')).toBeTruthy()
    expect(screen.getByTestId('previous-page')).toBeTruthy()
    expect(screen.getByTestId('next-page')).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(undefined, true)
      expect(screen.getByText('Loading your appointments...')).toBeTruthy()
    })
  })

  describe('when a appointment is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByTestId('Confirmed Saturday, February 6, 2021 11:53 AM PST VA Long Beach Healthcare System In-person'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PastAppointmentDetails', { appointmentID: '1' })
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the first line of the appointment item as the text "Canceled"', () => {
      initializeTestInstance(appointmentData(AppointmentStatusConstants.CANCELLED))
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "Canceled"', () => {
      initializeTestInstance(appointmentData(AppointmentStatusConstants.CANCELLED, true))
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "Pending"', () => {
      initializeTestInstance(appointmentData(AppointmentStatusConstants.SUBMITTED, true))
      expect(screen.getByText('Pending')).toBeTruthy()
    })
  })

  describe('when there are no appointments', () => {
    it('should render NoAppointments', () => {
      initializeTestInstance()
      expect(screen.getByText("You don’t have any appointments")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(undefined, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })

    it('should not render error component when the stores screenID does not match the components screenID', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(undefined, undefined, errorState)
      expect(screen.queryByText("The app can't be loaded.")).toBeFalsy()
    })
  })

  describe('when the dropdown value is updated', () => {
    it('should call getAppointmentsInDateRange', () => {
      fireEvent.press(screen.getByTestId('getDateRangeTestID picker'))
      fireEvent.press(screen.getByAccessibilityValue({
        "text": "2 of 6",
      }))
      fireEvent.press(screen.getByText('Done'))
      expect(getAppointmentsInDateRange).toHaveBeenCalled()
    })
  })
})
