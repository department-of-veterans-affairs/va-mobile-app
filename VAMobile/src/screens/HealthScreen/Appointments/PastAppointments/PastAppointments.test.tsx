import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, mockStore, render } from 'testUtils'

import PastAppointments from './PastAppointments'
import {} from 'store/slices'
import { AppointmentsGroupedByYear, AppointmentStatus, AppointmentStatusConstants } from 'store/api/types'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import NoAppointments from '../NoAppointments/NoAppointments'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getAppointmentsInDateRange, ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import VAModalPicker from 'components/FormWrapper/FormFields/Picker/VAModalPicker'
import { defaultAppoinment, defaultAppointmentAttributes } from 'utils/tests/appointments'
import { bookedAppointmentsList } from 'store/slices/appointmentsSlice.test'
import { RenderAPI, waitFor } from '@testing-library/react-native'
import waitForClickable from 'webdriverio/build/commands/element/waitForClickable'

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
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let appointmentData = (status: AppointmentStatus = AppointmentStatusConstants.BOOKED): AppointmentsGroupedByYear => {
    return {
      '2020': {
        '3': [
          {
            ...defaultAppoinment,
            attributes: {
              ...defaultAppointmentAttributes,
              status,
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

    component = render(<PastAppointments {...props} />, {
      preloadedState: {
        ...InitialState,
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

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance(appointmentData())
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(undefined, true)
      await waitFor(() => {
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when a appointment is clicked', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        const allPressables = testInstance.findAllByType(Pressable)
        allPressables[allPressables.length - 3].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the first line of the appointment item as the text "Canceled"', async () => {
      await waitFor(() => {
        initializeTestInstance(appointmentData(AppointmentStatusConstants.CANCELLED))
        expect(testInstance.findAllByType(TextView)[12].props.children).toEqual('CANCELED')
      })
    })
  })

  describe('when there are no appointments', () => {
    it('should render NoAppointments', async () => {
      await waitFor(() => {
        initializeTestInstance()
        expect(testInstance.findByType(NoAppointments)).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      await waitFor(() => {
        initializeTestInstance(undefined, undefined, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })

  describe('when the dropdown value is updated', () => {
    describe('when the platform is android', () => {
      it('should call getAppointmentsInDateRange', async () => {
        await waitFor(() => {
          testInstance.findByType(VAModalPicker).props.onSelectionChange('5 months to 3 months')

          expect(getAppointmentsInDateRange).toHaveBeenCalled()
        })
      })
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
