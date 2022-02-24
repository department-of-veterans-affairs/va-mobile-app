import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import PreferredDateAndTime from './PreferredDateAndTime'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

context('PreferredDateAndTime', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (): void => {
    props ={
      ...defaultAppointmentAttributes
    }

    component = render(<PreferredDateAndTime attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
