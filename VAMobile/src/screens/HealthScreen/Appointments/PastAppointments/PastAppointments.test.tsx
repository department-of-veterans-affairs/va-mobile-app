import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import PastAppointments from './PastAppointments'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { AppointmentsGroupedByYear } from 'store/api/types'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import NoAppointments from '../NoAppointments/NoAppointments'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import {getAppointmentsInDateRange} from 'store/actions'
import RNPickerSelect from 'react-native-picker-select'
import VAModalPicker from "../../../../components/FormWrapper/FormFields/Picker/VAModalPicker";

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

jest.mock('../../../../utils/platform', () => {
  let actual = jest.requireActual('../../../../utils/platform')
  return {
    ...actual,
    isAndroid: jest.fn(() => {
      return true
    })
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    getAppointmentsInDateRange: jest.fn(() => {
      return {
        type: '',
        payload: {
          appointmentsList: [
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
          ]
        }
      }
    })
  }
})

context('PastAppointments', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let appointmentData: AppointmentsGroupedByYear = {
    '2020': {
      '3': [
        {
          type: 'appointment',
          id: '1',
          attributes: {
            appointmentType: 'VA',
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
              middleName: '',
              lastName: 'TestDoctor',
            },
          },
        }
      ]
    }
  }

  const initializeTestInstance = (pastAppointmentsByYear: AppointmentsGroupedByYear, loading: boolean = false, errorsState: ErrorsState = initialErrorsState): void => {
    props = mockNavProps()

    store = mockStore({
      ...InitialState,
      appointments: {
        loading,
        loadingAppointmentCancellation: false,
        upcomingVaServiceError: false,
        upcomingCcServiceError: false,
        pastVaServiceError: false,
        pastCcServiceError: false,
        pastAppointmentsByYear
      },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<PastAppointments {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(appointmentData)
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

  describe('when a appointment is clicked', () => {
    it('should call useRouteNavigation', async () => {
      const allPressables = testInstance.findAllByType(Pressable)
      allPressables[allPressables.length - 1].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the last line of the appointment item as the text "Canceled"', async () => {
      appointmentData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentData)
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual('Canceled')
    })
  })

  describe('when there are no appointments', () => {
    it('should render NoAppointments', async () => {
      initializeTestInstance({})
      expect(testInstance.findByType(NoAppointments)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance({}, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance({}, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })

  describe('when the dropdown value is updated', () => {
    describe('when the platform is android', () => {
      it('should call getAppointmentsInDateRange', async () => {
        testInstance.findByType(VAModalPicker).props.onSelectionChange('5 months to 3 months')
        expect(getAppointmentsInDateRange).toHaveBeenCalled()
      })
    })
  })
})
