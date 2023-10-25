import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import { AppointmentData, AppointmentPhone, AppointmentStatus, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { defaultAppoinment, defaultAppointmentAttributes, defaultAppointmentLocation } from 'utils/tests/appointments'
import AppointmentCancellationInfo from './AppointmentCancellationInfo'

context('AppointmentCancellationInfo', () => {
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

    render(<AppointmentCancellationInfo appointment={mockAppointment} />)
  }

  describe('when the appointment type is VA video connect atlas', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your VA health facility. You can't cancel V\ufeffA Video Connect at an ATLAS location appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })

  describe('when the appointment type is VA video connect onsite', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your VA health facility. You can't cancel V\ufeffA Video Connect at a VA location appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })

  describe('when the appointment type is VA video connect GFE', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your VA health facility. You can't cancel V\ufeffA Video Connect using a VA device appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })

  describe('when the appointment type is VA video connect home', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your VA health facility. You can't cancel V\ufeffA Video Connect at home appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })

  describe('when the appointment type is community care', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your community care provider. You can't cancel community care appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })

  describe('when the appointment type is VA', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA, 'BOOKED', appointmentPhoneData)
      expect(screen.getByText('Cancel this appointment')).toBeTruthy()
      expect(screen.getByText("If you want to reschedule this appointment, you'll need to first cancel this one and then create a new appointment.")).toBeTruthy()
      expect(screen.getByText("Cancel appointment")).toBeTruthy()
    })
  })

  describe('when the appointment type is community care and the phone number is undefined', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', undefined)
      expect(screen.getByText('Do you need to cancel?')).toBeTruthy()
      expect(screen.getByText("Call your community care provider. You can't cancel community care appointments online.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('Find your VA location')).toBeTruthy()
    })
  })

  describe('when the appointment type is covid vaccine', () => {
    it('should display the correct cancellation details', async () => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, 'BOOKED', appointmentPhoneData, true)
      expect(screen.getByText('To cancel this appointment, call your VA  medical center')).toBeTruthy()
      expect(screen.getByText("COVID-19 appointments can't be canceled online. Please call the VA facility to cancel your appointment.")).toBeTruthy()
      expect(screen.getByText(appointmentLocationName)).toBeTruthy()
      expect(screen.getByText('123-' + appointmentPhoneData.number)).toBeTruthy()
    })
  })
})
