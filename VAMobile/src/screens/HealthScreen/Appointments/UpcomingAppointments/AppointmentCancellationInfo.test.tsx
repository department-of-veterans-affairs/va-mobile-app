import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, render, RenderAPI, waitFor } from 'testUtils'
import { act } from 'react-test-renderer'

import { AppointmentData, AppointmentPhone, AppointmentStatus, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { defaultAppoinment, defaultAppointmentAttributes, defaultAppointmentLocation } from 'utils/tests/appointments'
import { ClickForActionLink, TextView, VAButton } from 'components'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'

context('AppointmentCancellationInfo', () => {
  let component: RenderAPI
  let testInstance: any

  let appointmentPhoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '',
  }

  let appointmentLocationName = 'VA Long Beach Healthcare System'

  const initializeTestInstance = (appointmentType: AppointmentType, status: AppointmentStatus, phoneData?: AppointmentPhone, isCovidVaccine = false): void => {
    const mockAppointment: AppointmentData = {
      ...defaultAppoinment,
      attributes: {
        ...defaultAppointmentAttributes,
        appointmentType,
        status,
        isCovidVaccine,
        location: {
          ...defaultAppointmentLocation,
          name: appointmentLocationName,
          phone: phoneData,
        },
        cancelId: '12',
      },
    }

    component = render(<AppointmentCancellationInfo appointment={mockAppointment} />)

    testInstance = component.UNSAFE_root
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        "Call your VA health facility. You can't cancel V\ufeffA Video Connect at an ATLAS location appointments online.",
      )
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        "Call your VA health facility. You can't cancel V\ufeffA Video Connect at a VA location appointments online.",
      )
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        "Call your VA health facility. You can't cancel V\ufeffA Video Connect using a VA device appointments online.",
      )
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual("Call your VA health facility. You can't cancel V\ufeffA Video Connect at home appointments online.")
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual("Call your community care provider. You can't cancel community care appointments online.")
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
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        "If you want to reschedule this appointment, you'll need to first cancel this one and then create a new appointment.",
      )
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
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Do you need to cancel?')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual("Call your community care provider. You can't cancel community care appointments online.")
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the find VA locations link', async () => {
      expect(testInstance.findByType(ClickForActionLink).props.displayedText).toEqual('Find your VA location')
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    beforeEach(() => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', appointmentPhoneData, true)
    })
    it('should display the correct cancellation title', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('To cancel this appointment, call your VA  medical center')
    })
    it('should display the correct cancellation body', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        "COVID-19 appointments can't be canceled online. Please call the VA facility to cancel your appointment.",
      )
    })
    it('should display the correct location name', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(appointmentLocationName)
    })
    it('should display the correct phone number', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('123-' + appointmentPhoneData.number)
    })
  })
})
