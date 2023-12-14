import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import AppointmentReason from './AppointmentReason'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'

context('AppointmentReason', () => {
  let props: any
  let reasonText = 'New Issue: 22.4.55'
  const initializeTestInstance = (phoneOnly: boolean = false, isPendingAppointment?: boolean, reason?: string): void => {
    props = {
      attributes: {
        status: !!isPendingAppointment ? AppointmentStatusConstants.SUBMITTED : AppointmentStatusConstants.BOOKED,
        isPending: !!isPendingAppointment,
        reason: reason || null,
        phoneOnly: phoneOnly,
      },
    }
    render(<AppointmentReason {...props} />)
  }

  describe('Confirmed/Canceled Confirm Appointments', () => {
    describe('when no reason is provided', () => {
      it('should not display any text', () => {
        initializeTestInstance(false, false)
        expect(screen.queryByRole('header', { name:'You shared these details about your concern' })).toBeFalsy()
      })
    })

    describe('when a reason is provided', () => {
      it('should display reason', () => {
        initializeTestInstance(false, false, reasonText)
        expect(screen.getByRole('header', { name: 'You shared these details about your concern' })).toBeTruthy()
        expect(screen.getByText(reasonText)).toBeTruthy()
      })
    })

    describe('when phone Appointment with no reason', () => {
      it('should display defaults', () => {
        initializeTestInstance(true, false, undefined)
        expect(screen.getByRole('header', { name: 'Details you shared with your provider' })).toBeTruthy()
        expect(screen.getByText('Reason: Not noted')).toBeTruthy()
      })
    })

    describe('when phone Appointment with reason', () => {
      it('should display reason', () => {
        initializeTestInstance(true, false, reasonText)
        expect(screen.getByRole('header', { name: 'Details you shared with your provider' })).toBeTruthy()
        expect(screen.getByText('Reason: New Issue: 22.4.55')).toBeTruthy()
      })
    })
  })
})
