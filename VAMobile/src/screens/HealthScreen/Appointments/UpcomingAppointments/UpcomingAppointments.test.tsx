import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import UpcomingAppointments from './UpcomingAppointments'
import { initialAppointmentsState } from 'store/slices'
import { AppointmentsGroupedByYear, AppointmentStatusConstants } from 'store/api/types'
import { defaultAppoinment } from 'utils/tests/appointments'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    getAppointmentsInDateRange: jest.fn(() => {
      return {
        type: '',
        payload: {},
      }
    }),
  }
})

jest.mock('store/api', () => {
  let api = jest.requireActual('store/api')

  return {
    ...api,
  }
})

context('UpcomingAppointments', () => {
  let navigateToSpy: jest.Mock
  let appointmentsByYearData: AppointmentsGroupedByYear = {
    '2020': {
      '3': [{ ...defaultAppoinment }],
    },
  }

  const initializeTestInstance = (currentPageUpcomingAppointmentsByYear?: AppointmentsGroupedByYear, loading: boolean = false) => {
    const props = mockNavProps()
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)

    render(<UpcomingAppointments {...props} />, {
      preloadedState: {
        appointments: {
          ...initialAppointmentsState,
          loading,
          loadingAppointmentCancellation: false,
          upcomingVaServiceError: false,
          upcomingCcServiceError: false,
          pastVaServiceError: false,
          pastCcServiceError: false,
          currentPageAppointmentsByYear: {
            pastFiveToThreeMonths: {},
            pastEightToSixMonths: {},
            pastElevenToNineMonths: {},
            pastAllCurrentYear: {},
            pastAllLastYear: {},
            pastThreeMonths: {},
            upcoming: currentPageUpcomingAppointmentsByYear || {},
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
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(appointmentsByYearData)
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance({}, true)
      expect(screen.getByText('Loading your appointments...')).toBeTruthy()
    })
  })

  describe('when there is no data', () => {
    it('should show the no appointments screen', () => {
      initializeTestInstance({})
      expect(screen.getByText('You don’t have any appointments')).toBeTruthy()
    })
  })

  describe('on appointment press', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByTestId('Confirmed Saturday, February 6, 2021 11:53 AM PST VA Long Beach Healthcare System In-person'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('UpcomingAppointmentDetails', { appointmentID: '1' })
      expect(navigateToSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the first line of the appointment item as the text "Canceled"', () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentsByYearData)
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "CANCELLED"', () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = AppointmentStatusConstants.CANCELLED
      appointmentsByYearData['2020']['3'][0].attributes.isPending = true
      initializeTestInstance(appointmentsByYearData)
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "Pending"', () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = AppointmentStatusConstants.SUBMITTED
      appointmentsByYearData['2020']['3'][0].attributes.isPending = true
      initializeTestInstance(appointmentsByYearData)
      expect(screen.getByText('Pending')).toBeTruthy()
    })
  })
})
