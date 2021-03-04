import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import {
  AppointmentData,
  AppointmentPhone,
  AppointmentStatus,
  AppointmentType,
  AppointmentTypeConstants
} from 'store/api/types'
import { ClickForActionLink, TextView, VAButton } from 'components'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'

context('AppointmentCancellationInfo', () => {
  let component: any
  let testInstance: any

  let appointmentPhoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '',
  }

  let appointmentLocationName = 'VA Long Beach Healthcare System'

  const initializeTestInstance = (appointmentType: AppointmentType, status: AppointmentStatus, phoneData?: AppointmentPhone): void => {
    const mockAppointment: AppointmentData = {
      type: 'appointment',
      id: '1',
      attributes: {
        appointmentType,
        status,
        startDateUtc: '2021-02-06T19:53:14.000+00:00',
        startDateLocal: '2021-02-06T18:53:14.000-01:00',
        minutesDuration: 60,
        comment: 'Please arrive 20 minutes before the start of your appointment',
        timeZone: 'America/Los_Angeles',
        healthcareService: 'Blind Rehabilitation Center',
        location: {
          name: appointmentLocationName,
          address: {
            street: '5901 East 7th Street',
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
    }


    act(() => {
      component = renderWithProviders(<AppointmentCancellationInfo appointment={mockAppointment}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('VA', 'BOOKED', appointmentPhoneData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is VA video connect atlas', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your VA medical center')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Video Connect appointments can\'t be canceled online. Please call the VA facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })

  describe('when the appointment type is VA video connect onsite', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your VA medical center')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Video Connect appointments can\'t be canceled online. Please call the VA facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })

  describe('when the appointment type is VA video connect GFE', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your VA medical center')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Video Connect appointments can\'t be canceled online. Please call the VA facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })

  describe('when the appointment type is VA video connect home', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your VA medical center')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Video Connect appointments can\'t be canceled online. Please call the VA facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })

  describe('when the appointment type is community care', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your community care provider')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Community care appointments can\'t be canceled online. Please call the facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })

  describe('when the appointment type is VA', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.VA, 'BOOKED', appointmentPhoneData)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Cancel this appointment')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('If you want to reschedule this appointment, you\'ll need to first cancel this one and then create a new appointment.')
    })
    it('should display a VA button', async () => {
      expect(testInstance.findByType(VAButton)).toBeTruthy()
    })
  })

  describe('when the appointment type is community care and the phone number is undefined', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', undefined)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your community care provider')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Community care appointments can\'t be canceled online. Please call the facility to cancel your appointment')
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the find VA locations link', async () => {
      expect(testInstance.findByType(ClickForActionLink).props.displayedText).toEqual('Find your VA location')
    })
  })
})
