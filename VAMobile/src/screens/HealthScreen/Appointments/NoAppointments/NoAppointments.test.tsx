import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import NoAppointments from './NoAppointments'
import { InitialState } from 'store/reducers'

context('AppointmentsScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  beforeEach(() => {
    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<NoAppointments subText="You don't have any appointments in this range"/>, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
