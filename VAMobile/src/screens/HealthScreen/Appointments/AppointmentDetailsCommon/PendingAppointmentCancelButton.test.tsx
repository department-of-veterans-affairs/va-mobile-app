import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { AppointmentStatusConstants } from 'api/types'
import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import PendingAppointmentCancelButton from './PendingAppointmentCancelButton'

const mockAlertSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('PendingAppointmentCancelButton', () => {
  const initializeTestInstance = (): void => {
    const props = {
      ...defaultAppointmentAttributes,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
    }
    render(<PendingAppointmentCancelButton attributes={props} goBack={jest.fn()} cancelAppointment={jest.fn()} />)
  }

  it('initializes correctly and should call the useDestructive hook', () => {
    initializeTestInstance()
    expect(screen.getByRole('button', { name: 'Cancel request' })).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Cancel request' }))
    expect(mockAlertSpy).toHaveBeenCalled()
  })
})
