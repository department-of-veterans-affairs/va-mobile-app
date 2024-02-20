import React from 'react'

import { screen } from '@testing-library/react-native'

import {
  AppointmentLocation,
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentStatusDetailType,
  AppointmentStatusDetailTypeConsts,
} from 'store/api/types/AppointmentData'
import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import AppointmentAlert from './AppointmentAlert'

context('AppointmentAlert', () => {
  const initializeTestInstance = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType = AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
    phoneOnly: boolean = false,
    location?: AppointmentLocation,
  ): void => {
    const props = {
      ...defaultAppointmentAttributes,
      serviceCategoryName: 'COMPENSATION & PENSION',
      status,
      statusDetail,
      location: location || defaultAppointmentAttributes.location,
      phoneOnly: phoneOnly,
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

  it('should not show alert for canceled phone appointments', () => {
    initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK, true)
    expect(screen.queryByText('VA Long Beach Healthcare System canceled this appointment.')).toBeFalsy()
  })

  describe('when an appointment is CANCELLED', () => {
    describe('when a facility cancels an appointment', () => {
      it('should display facility name', () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED)
        expect(screen.getByText('VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
      })

      it('should display "facility"', () => {
        initializeTestInstance(
          AppointmentStatusConstants.CANCELLED,
          AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
          false,
          { name: '' },
        )
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
