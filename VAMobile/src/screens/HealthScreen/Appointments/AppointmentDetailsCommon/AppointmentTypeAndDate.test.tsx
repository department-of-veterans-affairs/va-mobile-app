import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import { AppointmentStatusDetailType, AppointmentStatus, AppointmentStatusConstants, AppointmentStatusDetailTypeConsts } from 'store/api/types'
import AppointmentTypeAndDate from './AppointmentTypeAndDate'

context('AppointmentTypeAndDate', () => {
  let props: any

  const initializeTestInstance = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType | null = null,
    isPending: boolean = false,
    serviceCategoryName: string | null = null,
    phoneOnly: boolean = false,
    isPastAppointment: boolean = false
  ): void => {
    props = {
      appointmentType: 'VA',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      timeZone: 'America/Los_Angeles',
      status,
      statusDetail,
      isPending,
      typeOfCare: 'typeOfCare',
      serviceCategoryName,
      phoneOnly: phoneOnly,
    }

    render(<AppointmentTypeAndDate attributes={props} isPastAppointment={isPastAppointment} />)
  }

  describe('when phoneAppointment and isPastAppointment is true', () => {
    it('should render past title and body and date of appointment', () => {
      initializeTestInstance(AppointmentStatusConstants.BOOKED, null, false, null, true, true)
      expect(screen.getByRole('header', { name: 'Past phone appointment' })).toBeTruthy()
      expect(screen.getByText('This appointment happened in the past.')).toBeTruthy()
      expect(screen.getByText('Saturday, February 6, 2021 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when phoneAppointment and isPending is true is true', () => {
    it('should render upcoming title and pending body and not display a date', () => {
      initializeTestInstance(AppointmentStatusConstants.SUBMITTED, null, true, null, true, false)
      expect(screen.getByRole('header', { name: 'Phone appointment' })).toBeTruthy()
      expect(screen.getByText('Pending request for typeOfCare appointment')).toBeTruthy()
      expect(screen.queryByText('Saturday, February 6, 2021 11:53 AM PST')).toBeFalsy()
    })
  })

  describe('when phoneAppointment', () => {
    it('should render upcoming title, body and date of appointment', () => {
      initializeTestInstance(AppointmentStatusConstants.BOOKED, null, false, null, true, false)
      expect(screen.getByRole('header', { name: 'Phone appointment' })).toBeTruthy()
      expect(screen.getByText('Your provider will call you.')).toBeTruthy()
      expect(screen.getByText('Saturday, February 6, 2021 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when phoneAppointment and it is canceled by you', () => {
    it('should render canceled title, body and date of appointment with the canceled by you text', () => {
      initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT, false, null, true, false)
      expect(screen.getByRole('header', { name: 'Canceled phone appointment' })).toBeTruthy()
      expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
      expect(screen.getByText('Saturday, February 6, 2021 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when phoneAppointment and it is canceled by clinic', () => {
    it('should render canceled title, body and date of appointment with the canceled by clinic text', () => {
      initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC, false, null, true, false)
      expect(screen.getByRole('header', { name: 'Canceled phone appointment' })).toBeTruthy()
      expect(screen.getByText('Facility canceled this appointment.')).toBeTruthy()
      expect(screen.getByText('Saturday, February 6, 2021 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when isAppointmentCanceled is true', () => {
    it('should render a TextView with the cancellation text', () => {
      initializeTestInstance(AppointmentStatusConstants.CANCELLED)
      expect(screen.getByText('VA appointment')).toBeTruthy()
      expect(screen.getByText('Canceled appointment for Saturday, February 6, 2021 at 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when isAppointmentCanceled is false', () => {
    it('should only render 2 TextViews', () => {
      initializeTestInstance()
      expect(screen.getByText('VA appointment')).toBeTruthy()
      expect(screen.getByText('Saturday, February 6, 2021 11:53 AM PST')).toBeTruthy()
    })
  })

  describe('when isPending is true and status is SUBMITTED', () => {
    it('should render TypeOfCare text', () => {
      initializeTestInstance(AppointmentStatusConstants.SUBMITTED, null, true)
      expect(screen.getByText('Pending request for typeOfCare appointment')).toBeTruthy()
    })
  })

  describe('when the serviceCategoryName is C&P', () => {
    it('should display the correct text', () => {
      initializeTestInstance(AppointmentStatusConstants.BOOKED, null, false, 'COMPENSATION & PENSION')
      expect(screen.getByText('Claim exam')).toBeTruthy()
      expect(screen.getByText("This appointment is for disability rating purposes only. It doesn't include treatment. If you have medical evidence to support your claim, bring copies to this appointment.")).toBeTruthy()
    })
  })
})
