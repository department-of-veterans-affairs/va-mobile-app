import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import ContactInformation from './ContactInformation'
import { TextView } from 'components'
import { AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types/AppointmentData'

context('ContactInformation', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (): void => {
    props = {
      patientEmail: 'test@test.com',
      patientPhoneNumber: '145-141-2523',
      bestTimeToCall: ['Noon'],
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
      appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
    }

    component = render(<ContactInformation attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should show email, phone number, and best time to call', async () => {
    expect(findByTypeWithSubstring(testInstance, TextView, 'test@test.com')).toBeTruthy()
    expect(findByTypeWithSubstring(testInstance, TextView, '145-141-2523')).toBeTruthy()
    expect(findByTypeWithSubstring(testInstance, TextView, 'Noon')).toBeTruthy()
  })
})
