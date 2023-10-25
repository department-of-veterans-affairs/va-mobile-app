import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import PreferredDateAndTime from './PreferredDateAndTime'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'

context('PreferredDateAndTime', () => {
  let props: any
  const initializeTestInstance = (): void => {
    props = {
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
    }

    render(<PreferredDateAndTime attributes={props} />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(screen.getByText('Preferred date and time')).toBeTruthy()
    expect(screen.getByText('10/01/2021 in the afternoon')).toBeTruthy()
    expect(screen.getByText('11/03/2021 in the morning')).toBeTruthy()
  })
})
