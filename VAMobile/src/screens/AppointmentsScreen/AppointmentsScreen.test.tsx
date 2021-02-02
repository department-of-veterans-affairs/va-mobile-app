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
  ErrorsState,
  initialErrorsState
} from 'store/reducers'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ErrorComponent } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

context('AppointmentsScreen', () => {
  let store: any
  let component: any
  let testInstance: any

  const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState) => {
    const appointments: AppointmentsState = {
      ...initialAppointmentsState
    }

    store = mockStore({
      ...InitialState,
      appointments,
      errors: errorsState
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

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
