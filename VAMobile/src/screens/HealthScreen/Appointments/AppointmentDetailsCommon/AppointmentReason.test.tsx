import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import AppointmentReason from './AppointmentReason'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'

context('AppointmentReason', () => {
  let props: any
  let reasonText = 'New Issue: 22.4.55'
  const initializeTestInstance = (isPendingAppointment?: boolean, reason?: string): void => {
    props = {
      attributes: {
        status: !!isPendingAppointment ? AppointmentStatusConstants.SUBMITTED : AppointmentStatusConstants.BOOKED,
        isPending: !!isPendingAppointment,
        reason: reason || null,
      },
    }
    render(<AppointmentReason {...props} />)
  }

  describe('Confirmed/Canceled Confirm Appointments', () => {
    describe('when no reason is provided', () => {
      it('should not display any text', () => {
        initializeTestInstance(false)
        expect(screen.queryByText('You shared these details about your concern')).toBeFalsy()
      })
    })

    describe('when a reason is provided', () => {
      it('should display reason', () => {
        initializeTestInstance(false, reasonText)
        expect(screen.getByText('You shared these details about your concern')).toBeTruthy()
        expect(screen.getByText(reasonText)).toBeTruthy()
      })
    })
  })
})
