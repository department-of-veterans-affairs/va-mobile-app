import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import PastAppointments from './PastAppointments'
import { InitialState } from 'store/reducers'
import { AppointmentsGroupedByYear } from 'store/api/types'
import {LoadingComponent, TextView} from 'components'
import NoAppointments from '../NoAppointments/NoAppointments'

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
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

  const initializeTestInstance = (pastAppointmentsByYear: AppointmentsGroupedByYear, loading: boolean = false): void => {
    props = mockNavProps()

    store = mockStore({
      ...InitialState,
      appointments: {
        loading,
        pastAppointmentsByYear
      }
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
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the status is CANCELLED', () => {
    it('should render the last line of the appointment item as the text "Canceled"', async () => {
      appointmentData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentData)
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Canceled')
    })
  })

  describe('when there are no appointments', () => {
    it('should render NoAppointments', async () => {
      initializeTestInstance({})
      expect(testInstance.findByType(NoAppointments)).toBeTruthy()
    })
  })
})
