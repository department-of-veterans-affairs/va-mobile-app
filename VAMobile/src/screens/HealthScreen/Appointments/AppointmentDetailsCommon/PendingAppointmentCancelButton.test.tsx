import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import PendingAppointmentCancelButton from './PendingAppointmentCancelButton'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'

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
    render(<PendingAppointmentCancelButton attributes={props} />)
  }

  it('initializes correctly and should call the useDestructive hook', () => {
    initializeTestInstance()
    expect(screen.getByRole('button', { name: 'Cancel request' })).toBeTruthy()
    fireEvent.press(screen.getByRole('button', { name: 'Cancel request' }))
    expect(mockAlertSpy).toHaveBeenCalled()
  })
})
