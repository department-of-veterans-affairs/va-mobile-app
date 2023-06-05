import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import { TextView } from 'components'
import AppointmentReason from './AppointmentReason'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'

context('AppointmentReason', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let reasonText = 'New Issue: 22.4.55'

  const initializeTestInstance = (isPendingAppointment?: boolean, reason?: string): void => {
    props = {
      attributes: {
        status: !!isPendingAppointment ? AppointmentStatusConstants.SUBMITTED : AppointmentStatusConstants.BOOKED,
        isPending: !!isPendingAppointment,
        reason: reason || null,
      },
    }

    component = render(<AppointmentReason {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('Confirmed/Canceled Confirm Appointments', () => {
    describe('when no reason is provided', () => {
      it('should not display any text', async () => {
        initializeTestInstance(false)
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(0)
      })
    })

    describe('when a reason is provided', () => {
      it('should display reason', async () => {
        initializeTestInstance(false, reasonText)
        const texts = testInstance.findAllByType(TextView)
        expect(texts[0].props.children).toBe('You shared these details about your concern')
        expect(texts[1].props.children).toBe(reasonText)
      })
    })
  })
})
