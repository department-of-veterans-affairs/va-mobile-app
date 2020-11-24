import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import UpcomingAppointments, { NoAppointments } from './UpcomingAppointments'
import { InitialState } from 'store/reducers'
import { AppointmentsGroupedByYear } from "store/api/types";

context('UpcomingAppointments', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const appointmentsByYearData: AppointmentsGroupedByYear = {
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

  const initializeTestInstance = (appointmentsByYear?: AppointmentsGroupedByYear) => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      appointments: {
        loading: false,
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

  describe('when there is no data', () => {
    it('should show the no appointments screen', async () => {
      initializeTestInstance({})
      expect(testInstance.findByType(NoAppointments)).toBeTruthy()
    })
  })
})
