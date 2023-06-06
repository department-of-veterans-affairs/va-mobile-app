import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, render, RenderAPI, waitFor } from 'testUtils'

import NoAppointments from './NoAppointments'
import { InitialState } from 'store/slices'

context('NoAppointments', () => {
  let component: RenderAPI
  let testInstance: any

  beforeEach(async () => {
    await waitFor(() => {
      component = render(<NoAppointments subText="You don't have any appointments in this range" />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
