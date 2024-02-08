import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import AppointmentReason from './AppointmentReason'

context('AppointmentReason', () => {
  const reasonText = 'New Issue: 22.4.55'
  const initializeTestInstance = (reason?: string): void => {
    const props = {
      ...defaultAppointmentAttributes,
      status: AppointmentStatusConstants.BOOKED,
      isPending: false,
      reason: reason || null,
      phoneOnly: true,
    }
    render(<AppointmentReason attributes={props} />)
  }

  describe('Confirmed/Canceled Confirm Appointments', () => {
    describe('when Appointment with no reason', () => {
      it('should display defaults', () => {
        initializeTestInstance(undefined)
        expect(screen.getByRole('header', { name: 'Details you shared with your provider' })).toBeTruthy()
        expect(screen.getByText('Reason: Not noted')).toBeTruthy()
      })
    })

    describe('when Appointment with reason', () => {
      it('should display reason', () => {
        initializeTestInstance(reasonText)
        expect(screen.getByRole('header', { name: 'Details you shared with your provider' })).toBeTruthy()
        expect(screen.getByText('Reason: New Issue: 22.4.55')).toBeTruthy()
      })
    })
  })
})
