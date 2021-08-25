import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import { InitialState } from 'store/reducers'
import PastAppointmentDetails from './PastAppointmentDetails'
import { AppointmentType } from 'store/api/types'
import { Box, LoadingComponent, TextView } from 'components'
import { InteractionManager } from 'react-native'

context('PastAppointmentDetails', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  const runAfterTransition = (testToRun: () => void) => {
    InteractionManager.runAfterInteractions(() => {
      testToRun()
    })
  }

  const initializeTestInstance = (appointmentType: AppointmentType): void => {
    store = mockStore({
      ...InitialState,
      appointments: {
        ...InitialState.appointments,
        appointment: {
          type: 'appointment',
          id: '1',
          attributes: {
            appointmentType,
            status: 'BOOKED',
            startDateUtc: '2021-02-06T19:53:14.000+00:00',
            startDateLocal: '2021-02-06T18:53:14.000-01:00',
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
              code: '123 code',
            },
            practitioner: {
              prefix: 'Dr.',
              firstName: 'Larry',
              middleName: '',
              lastName: 'TestDoctor',
            },
          },
        },
      },
    })

    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' } })

    act(() => {
      component = renderWithProviders(<PastAppointmentDetails {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('VA')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_GFE or VA_VIDEO_CONNECT_HOME', () => {
    it('should render only 4 TextViews to display appointment type, date information, and the schedule text', async () => {
      initializeTestInstance('VA_VIDEO_CONNECT_GFE')
      let allTextViews: ReactTestInstance[]

      runAfterTransition(() => {
        allTextViews = testInstance.findAllByType(TextView)
        expect(allTextViews.length).toEqual(4)
        expect(allTextViews[0].props.children).toEqual('VA Video Connect using a VA device')
      })

      initializeTestInstance('VA_VIDEO_CONNECT_HOME')
      runAfterTransition(() => {
        allTextViews = testInstance.findAllByType(TextView)
        expect(allTextViews.length).toEqual(4)
        expect(allTextViews[0].props.children).toEqual('VA Video Connect at home')
      })
    })
  })

  describe('when the appointment type is VA_VIDEO_CONNECT_ONSITE', () => {
    describe('when the practitioner object exists', () => {
      it('should render a TextView with the practitioners full name', async () => {
        initializeTestInstance('VA_VIDEO_CONNECT_ONSITE')
        runAfterTransition(() => {
          expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Larry TestDoctor')
        })
      })
    })
  })

  describe('when navigating to past appointment details page', () => {
    it('should show loading component', async () => {
      expect(testInstance.findByType(TextView).props.children).toEqual("We're loading your appointment details")
    })
  })
})
