import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import { TextView } from 'components'
import AppointmentReason from './AppointmentReason'
import { AppointmentType } from 'store/api'
import { AppointmentTypeConstants, AppointmentStatusConstants } from 'store/api/types/AppointmentData'

context('AppointmentReason', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let reasonText = 'New Issue: 22.4.55'
<<<<<<< HEAD
  let messages = [
    {
      id: '9a48e8db6d70a38a016d72b354240002',
      type: 'messages',
      attributes: {
        messageText: 'Testing',
        messageDateTime: '11/11/2019 12:26:13',
        appointmentRequestId: '9a48e8db6d70a38a016d72b354240002',
        date: '2019-11-11T12:26:13.931+0000',
      },
    },
    {
      id: '9a48e8db6d70a38a016d72b354240002',
      type: 'messages',
      attributes: {
        messageText: 'Possible check up',
        messageDateTime: '11/11/2019 12:26:13',
        appointmentRequestId: '9a48e8db6d70a38a016d72b354240002',
        date: '2019-11-11T12:26:13.931+0000',
      },
    },
  ]

  const initializeTestInstance = (isPendingAppointment?: boolean, reason?: string, messages?: Array<AppointmentMessages>): void => {
=======

  const initializeTestInstance = (isPendingAppointment?: boolean, reason?: string): void => {
>>>>>>> b81ac0cf6f3ff532255eae425950e494af78a2af
    props = {
      attributes: {
        status: !!isPendingAppointment ? AppointmentStatusConstants.SUBMITTED : AppointmentStatusConstants.BOOKED,
        isPending: !!isPendingAppointment,
        reason: reason || null,
      },
<<<<<<< HEAD
      messages,
=======
>>>>>>> b81ac0cf6f3ff532255eae425950e494af78a2af
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
