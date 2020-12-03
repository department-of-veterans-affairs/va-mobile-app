import 'react-native'
import React from 'react'
import {Pressable} from 'react-native'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import PastAppointments from './PastAppointments'
import {InitialState} from 'store/reducers'

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
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      appointments: {
        loading: false,
        appointmentsByYear: {
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
      }
    })

    act(() => {
      component = renderWithProviders(<PastAppointments {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when a appointment is clicked', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
