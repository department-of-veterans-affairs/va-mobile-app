import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import UpcomingAppointments from './UpcomingAppointments'
import NoAppointments from '../NoAppointments'
import { initialAppointmentsState, InitialState } from 'store/reducers'
import { AppointmentsGroupedByYear } from 'store/api/types'
import { LoadingComponent, TextView } from 'components'
import { getAppointmentsInDateRange } from 'store/actions'
import { defaultAppoinment, defaultAppointmentAttributes, defaultAppointmentLocation, defaultAppointmentAddress, defaultAppointmentPhone } from 'utils/tests/appointments'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  let theme = jest.requireActual('../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
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

jest.mock('../../../../store/api', () => {
  let api = jest.requireActual('../../../../store/api')

  return {
    ...api,
  }
})

context('UpcomingAppointments', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  let appointmentsByYearData: AppointmentsGroupedByYear = {
    '2020': {
      '3': [{ ...defaultAppoinment }],
    },
  }

  const initializeTestInstance = (currentPageUpcomingAppointmentsByYear?: AppointmentsGroupedByYear, loading: boolean = false) => {
    const props = mockNavProps()

    store = mockStore({
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
          ...initialAppointmentsState.currentPageAppointmentsByYear,
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
          ...initialAppointmentsState.paginationByTimeFrame,
          upcoming: {
            currentPage: 2,
            totalEntries: 2,
            perPage: 1,
          },
        },
      },
    })

    act(() => {
      component = renderWithProviders(<UpcomingAppointments {...props} />, store)
    })

    testInstance = component.root
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
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the first line of the appointment item as the text "Canceled"', async () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentsByYearData)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('CANCELED')
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
