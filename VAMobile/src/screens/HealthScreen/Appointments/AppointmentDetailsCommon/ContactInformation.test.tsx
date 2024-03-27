import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppointmentAttributes, AppointmentStatusConstants, AppointmentTypeConstants } from 'api/types'
import { context, render } from 'testUtils'

import ContactInformation from './ContactInformation'

context('ContactInformation', () => {
  const initializeTestInstance = (): void => {
    const props = {
      patientEmail: 'test@test.com',
      patientPhoneNumber: '145-141-2523',
      bestTimeToCall: ['Noon'],
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
    } as AppointmentAttributes

    render(<ContactInformation attributes={props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText('Your contact details')).toBeTruthy()
    expect(screen.getByText('Email: test@test.com')).toBeTruthy()
    expect(screen.getByText('Phone Number: 145-141-2523')).toBeTruthy()
    expect(screen.getByText('Call: Noon')).toBeTruthy()
  })
})
