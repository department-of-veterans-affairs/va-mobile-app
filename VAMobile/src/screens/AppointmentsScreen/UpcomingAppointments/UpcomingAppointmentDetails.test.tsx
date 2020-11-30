import 'react-native'
import React from 'react'
import {TouchableOpacity} from 'react-native'

// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import _ from 'underscore'

import { InitialState } from 'store/reducers'
import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'
import {AppointmentPhone, AppointmentType} from 'store/api/types'
import {ClickForActionLink, TextView} from 'components'

context('UpcomingAppointmentDetails', () => {
  let store: any
  let component: any
  let testInstance: any
  let props: any

  let apptPhoneData = {
    number: '123-456-7890',
    extension: '',
  }

  const initializeTestInstance = (appointmentType: AppointmentType, phoneData?: AppointmentPhone): void => {
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
              phone: phoneData,
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
      }
    })

    props = mockNavProps(undefined, undefined, { params: { appointmentID: '1' }})

    act(() => {
      component = renderWithProviders(<UpcomingAppointmentDetails {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('VA', apptPhoneData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is atlas', () => {
    it('should display the appointment code', async () => {
      initializeTestInstance('VA_VIDEO_CONNECT_ATLAS', apptPhoneData)
      expect(testInstance.findAllByType(TextView)[10].props.children).toEqual('Appointment code: 123 code')
    })
  })

  describe('when the appointment type is at home', () => {
    beforeEach(() => {
      initializeTestInstance('VA_VIDEO_CONNECT_HOME', apptPhoneData)
    })
    it('should display the how to join your virtual session text', async () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('How to join your virtual session')
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('You can join VA Video Connect 30 minutes prior to the start time')
    })

    it('should display the join session button', async () => {
      const buttons = testInstance.findAllByType(TouchableOpacity)
      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.testID).toEqual('Join session')
    })
  })

  describe('when the appointment type is onsite', () => {
    beforeEach(() => {
      initializeTestInstance('VA_VIDEO_CONNECT_ONSITE', apptPhoneData)
    })

    it('should state that the video meeting must be joined from the listed location', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('You must join this video meeting from the VA location listed below.')
    })

    it('should display the provider', async () => {
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Larry TestDoctor')
    })
  })

  describe('when the appointment type is gfe', () => {
    beforeEach(() => {
      initializeTestInstance('VA_VIDEO_CONNECT_GFE', apptPhoneData)
    })

    it('should state that the video meeting must be joined using a VA device', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('You can join this video meeting using a device provided by VA.')
    })
  })

  describe('when the appointment type is community care', () => {
    beforeEach(() => {
      initializeTestInstance('COMMUNITY_CARE', apptPhoneData)
    })

    it('should display a special instructions section to display the comment field', async () => {
      expect(testInstance.findAllByType(TextView)[10].props.children).toEqual('Special instructions')
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Please arrive 20 minutes before the start of your appointment')
    })
  })

  describe('when the appointment type is va', () => {
    it('should display the name of the facility location', async () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Blind Rehabilitation Center')
    })
  })

  describe('when there is no phone data', () => {
    it('should not display any click to call link', async () => {
      initializeTestInstance('VA')
      const allClickForActionLinks = testInstance.findAllByType(ClickForActionLink)

      _.forEach(allClickForActionLinks, clickForActionLink => {
        expect(clickForActionLink.props.linkType).not.toEqual('call')
      })
    })
  })
})
