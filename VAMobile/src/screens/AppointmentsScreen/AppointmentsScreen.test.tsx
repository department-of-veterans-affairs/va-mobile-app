import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'
import {TouchableOpacity} from 'react-native'

import AppointmentsScreen from './AppointmentsScreen'
import {
  InitialState,
  AppointmentsState,
  initialAppointmentsState,
  initialErrorsState,
  ErrorsState
} from 'store/reducers'
import { CommonErrors } from 'constants/errors'
import { NetworkConnectionError } from 'components'

context('AppointmentsScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  const initializeTestInstance = (errorState: ErrorsState = initialErrorsState) => {
    const appointments: AppointmentsState = {
      ...initialAppointmentsState
    }

    store = mockStore({
      ...InitialState,
      appointments,
      errors: errorState
    })

    act(() => {
      component = renderWithProviders(<AppointmentsScreen/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the user clicks the upcoming appointments segmented tab', () => {
    it('should update the upcoming appointments to be selected', async () => {
      const upcomingButton = testInstance.findAllByType(TouchableOpacity)[0]
      upcomingButton.props.onPress()
      expect(upcomingButton.props.isSelected).toEqual(true)
    })
  })

  describe('when the user clicks the past appointments segmented tab', () => {
    it('should update the past appointnents tab to be selected', async () => {
      const pastButton = testInstance.findAllByType(TouchableOpacity)[1]
      pastButton.props.onPress()
      expect(pastButton.props.isSelected).toEqual(true)
    })
  })

  describe('when there was a generic error, ', () => {
    it('should render NoNetworkConnectionError component when the error is a network error', async () => {
      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        wasError: true
      }

      initializeTestInstance(errorState)

      expect(testInstance.findByType(NetworkConnectionError)).toBeTruthy()
    })
  })
})
