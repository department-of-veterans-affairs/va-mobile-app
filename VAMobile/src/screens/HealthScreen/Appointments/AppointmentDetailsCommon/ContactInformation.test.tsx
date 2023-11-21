import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import ContactInformation from './ContactInformation'
import { AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types/AppointmentData'

context('ContactInformation', () => {
  let props: any
  const initializeTestInstance = (): void => {
    props = {
      patientEmail: 'test@test.com',
      patientPhoneNumber: '145-141-2523',
      bestTimeToCall: ['Noon'],
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
    }

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
