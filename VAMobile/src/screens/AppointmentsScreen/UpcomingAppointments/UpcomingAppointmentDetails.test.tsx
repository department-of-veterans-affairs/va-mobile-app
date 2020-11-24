import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import { InitialState } from 'store/reducers'
import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'

context('UpcomingAppointmentDetails', () => {
  let store: any
  let component: any
  let testInstance: any
  let props: any

  beforeEach(() => {
    store = mockStore({
      ...InitialState,
      appointments: {
        ...InitialState.appointments,
        appointment: {
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
        },
      }
    })

    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' }})

    act(() => {
      component = renderWithProviders(<UpcomingAppointmentDetails {...props}/>, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
