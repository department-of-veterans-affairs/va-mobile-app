import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import AppointmentTypeAndDate from './AppointmentTypeAndDate'
import { TextView } from 'components'

context('AppointmentTypeAndDate', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (isAppointmentCanceled: boolean): void => {
    props = mockNavProps({
      appointmentType: 'VA',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      timeZone: 'America/Los_Angeles',
      isAppointmentCanceled
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<AppointmentTypeAndDate {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when isAppointmentCanceled is true', () => {
    it('should render a TextView with the text "Canceled"', async () => {
      initializeTestInstance(true)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(4)
      expect(textViews[3].props.children).toEqual('Canceled')
    })
  })

  describe('when isAppointmentCanceled is false', () => {
    it('should only render 3 TextViews', async () => {
      expect(testInstance.findAllByType(TextView).length).toEqual(3)
    })
  })
})
