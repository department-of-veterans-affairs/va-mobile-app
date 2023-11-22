import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import AppointmentAlert from './AppointmentAlert'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentLocation, AppointmentStatus, AppointmentStatusConstants, AppointmentStatusDetailType, AppointmentStatusDetailTypeConsts } from 'store/api/types/AppointmentData'

context('AppointmentAlert', () => {
  let props: any

  const initializeTestInstance = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType = AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
    location?: AppointmentLocation,
  ): void => {
    props = {
      ...defaultAppointmentAttributes,
      status,
      statusDetail,
      location: location || defaultAppointmentAttributes.location,
    }
    render(<AppointmentAlert attributes={props} />)
  }

  it('should not show alert for booked appointments', () => {
    initializeTestInstance()
    expect(screen.queryByText('VA Long Beach Healthcare System canceled this appointment.')).toBeFalsy()
  })

  it('should not show alert for hidden appointments', () => {
    initializeTestInstance(AppointmentStatusConstants.HIDDEN)
    expect(screen.queryByText('VA Long Beach Healthcare System canceled this appointment.')).toBeFalsy()
  })

  describe('when an appointment is CANCELLED', () => {
    describe('when a facility cancels an appointment', () => {
      it('should display facility name', () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED)
        expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
      })

      it('should display "facility"', () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK, { name: '' })
        expect(screen.getByText('Facility canceled this appointment.')).toBeTruthy()
      })
    })

    describe('when you cancels an appointment', () => {
      it('should display "You"', () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT)
        expect(screen.getByText('You canceled this appointment.')).toBeTruthy()
      })
    })
  })

  describe('when an appointment is SUBMITTED', () => {
    it('should display facility name', () => {
      initializeTestInstance(AppointmentStatusConstants.SUBMITTED)
      expect(screen.getByText('The time and date of this appointment are still to be determined.')).toBeTruthy()
    })
  })
})
