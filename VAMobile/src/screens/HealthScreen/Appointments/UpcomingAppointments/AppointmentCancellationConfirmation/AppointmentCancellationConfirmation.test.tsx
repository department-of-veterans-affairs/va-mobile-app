import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import AppointmentCancellationConfirmation from './AppointmentCancellationConfirmation'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { ErrorComponent, VAButton } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import {cancelAppointment} from 'store/actions'

jest.mock('../../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../../store/actions')
  return {
    ...actual,
    cancelAppointment: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

context('AppointmentCancellationConfirmation', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any
  let goBackSpy = jest.fn()
  let navigateSpy = jest.fn()

  const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { appointmentID: 'testID', cancelID: 'cancelID' } })

    store = mockStore({
      ...InitialState,
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<AppointmentCancellationConfirmation {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the confirmation button', () => {
    it('should call cancelAppointment and navigation go back', () => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
      expect(goBackSpy).toHaveBeenCalled()
      expect(cancelAppointment).toHaveBeenCalledWith('cancelID', 'testID', 'APPOINTMENT_CANCELLATION_CONFIRMATION_SCREEN')
    })
  })

  describe('on click of the cancel button', () => {
    it('should call navigation go back', async () => {
      testInstance.findAllByType(VAButton)[1].props.onPress()
      expect(goBackSpy).toHaveBeenCalled()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
