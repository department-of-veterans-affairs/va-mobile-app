import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppointmentAttributes, AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import PreferredDateAndTime from './PreferredDateAndTime'

context('PreferredDateAndTime', () => {
  const initializeTestInstance = (): void => {
    const props = {
      ...defaultAppointmentAttributes,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
      proposedTimes: [
        {
          date: '10/01/2021',
          time: 'PM',
        },
        {
          date: '',
          time: 'AM',
        },
        {
          date: '11/03/2021',
          time: 'AM',
        },
      ],
    } as AppointmentAttributes

    render(<PreferredDateAndTime attributes={props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'Preferred date and time' })).toBeTruthy()
    expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
    expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()
  })
})
