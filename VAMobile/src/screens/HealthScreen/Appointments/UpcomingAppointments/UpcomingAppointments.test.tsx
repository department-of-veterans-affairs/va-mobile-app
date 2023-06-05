import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'

import UpcomingAppointments from './UpcomingAppointments'
import NoAppointments from '../NoAppointments'
import { initialAppointmentsState, InitialState, getAppointmentsInDateRange } from 'store/slices'
import { AppointmentsGroupedByYear, AppointmentStatusConstants } from 'store/api/types'
import { LoadingComponent, TextView } from 'components'
import { defaultAppoinment, defaultAppointmentAttributes, defaultAppointmentLocation, defaultAppointmentAddress, defaultAppointmentPhone } from 'utils/tests/appointments'

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
  let component: RenderAPI
  let testInstance: ReactTestInstance
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

    component = render(<UpcomingAppointments {...props} />, {
      preloadedState: {
        ...InitialState,
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

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(appointmentsByYearData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance({}, true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when there is no data', () => {
    it('should show the no appointments screen', async () => {
      initializeTestInstance({})
      expect(testInstance.findByType(NoAppointments)).toBeTruthy()
    })
  })

  describe('on appointment press', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalledWith('UpcomingAppointmentDetails', { appointmentID: '1' })
      expect(navigateToSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the first line of the appointment item as the text "Canceled"', async () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentsByYearData)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Canceled')
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "CANCELLED"', async () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = AppointmentStatusConstants.CANCELLED
      appointmentsByYearData['2020']['3'][0].attributes.isPending = true
      initializeTestInstance(appointmentsByYearData)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Canceled')
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('should render the first line of the appointment item as the text "Pending"', async () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = AppointmentStatusConstants.SUBMITTED
      appointmentsByYearData['2020']['3'][0].attributes.isPending = true
      initializeTestInstance(appointmentsByYearData)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Pending')
    })
  })

  describe('pagination', () => {
    it('should call getAppointmentsInDateRange for previous arrow', async () => {
      findByTestID(testInstance, 'previous-page').props.onPress()
      // was 2 now 1
      expect(getAppointmentsInDateRange).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 1, expect.anything())
    })

    it('should call getAppointmentsInDateRange for next arrow', async () => {
      findByTestID(testInstance, 'next-page').props.onPress()
      // was 2 now 3
      expect(getAppointmentsInDateRange).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), 3, expect.anything())
    })
  })
})
