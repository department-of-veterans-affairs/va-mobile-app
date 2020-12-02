import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import AppointmentTypeAndDate from './AppointmentTypeAndDate'

context('AppointmentTypeAndDate', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps({
      appointmentType: 'VA',
      startTime: '2021-02-06T19:53:14.000+00:00',
      timeZone: 'America/Los_Angeles'
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<AppointmentTypeAndDate {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
