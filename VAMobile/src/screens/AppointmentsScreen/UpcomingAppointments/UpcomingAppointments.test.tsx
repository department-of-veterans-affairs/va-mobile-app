import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import UpcomingAppointments from './UpcomingAppointments'
import NoAppointments from '../NoAppointments'
import { InitialState } from 'store/reducers'
import { AppointmentsGroupedByYear } from "store/api/types";
import {LoadingComponent, TextView} from 'components'

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

context('UpcomingAppointments', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  let appointmentsByYearData: AppointmentsGroupedByYear = {
    '2020': {
      '3': [
        {
          type: 'appointment',
          id: '1',
          attributes: {
            appointmentType: 'VA',
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
        }
      ]
    }
  }

  const initializeTestInstance = (appointmentsByYear?: AppointmentsGroupedByYear, loading = false) => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      appointments: {
        loading,
        appointmentsByYear: appointmentsByYear
      }
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
    it('should render the last line of the appointment item as the text "Canceled"', async () => {
      appointmentsByYearData['2020']['3'][0].attributes.status = 'CANCELLED'
      initializeTestInstance(appointmentsByYearData)
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Canceled')
    })
  })
})
