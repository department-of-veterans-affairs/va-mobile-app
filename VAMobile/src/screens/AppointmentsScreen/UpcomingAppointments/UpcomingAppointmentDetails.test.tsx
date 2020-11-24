import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import { InitialState } from 'store/reducers'
import UpcomingAppointmentDetails from './UpcomingAppointmentDetails'

context('UpcomingAppointmentDetails', () => {
  let store: any
  let component: any
  let testInstance: any
  let props: any

  beforeEach(() => {
    store = mockStore({
      ...InitialState
    })

    props = mockNavProps()

    act(() => {
      component = renderWithProviders(<UpcomingAppointmentDetails {...props}/>, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
