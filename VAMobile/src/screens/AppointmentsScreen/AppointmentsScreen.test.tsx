import 'react-native'
import React from 'react'

import GestureRecognizer from 'react-native-swipe-gestures'
// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'
import {TouchableOpacity} from 'react-native'

import AppointmentsScreen from './AppointmentsScreen'
import { InitialState } from 'store/reducers'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

context('AppointmentsScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  beforeEach(() => {
    store = mockStore({
      ...InitialState
    })

    act(() => {
      component = renderWithProviders(<AppointmentsScreen/>, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the user swipes right', () => {
    it('should display the upcoming appointments', async () => {
      testInstance.findByType(GestureRecognizer).props.onSwipeRight()
      expect(testInstance.findAllByType(UpcomingAppointments).length).toEqual(1)
    })
  })

  describe('when the user swipes left', () => {
    it('should display the past appointments', async () => {
      testInstance.findByType(GestureRecognizer).props.onSwipeLeft()
      expect(testInstance.findAllByType(PastAppointments).length).toEqual(1)
    })
  })

  describe('when the user clicks the upcoming appointments segmented tab', () => {
    it('should display the upcoming appointments', async () => {
      testInstance.findAllByType(TouchableOpacity)[0].props.onPress()
      expect(testInstance.findAllByType(UpcomingAppointments).length).toEqual(1)
    })
  })

  describe('when the user clicks the past appointments segmented tab', () => {
    it('should display the past appointments', async () => {
      testInstance.findAllByType(TouchableOpacity)[1].props.onPress()
      expect(testInstance.findAllByType(PastAppointments).length).toEqual(1)
    })
  })
})
