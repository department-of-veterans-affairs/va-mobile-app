import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders, mockStore } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import {updateSecureMessagingTab} from 'store/actions'
import {TouchableOpacity} from 'react-native'
import {ErrorsState, initialErrorsState, InitialState} from 'store/reducers'
import {CommonErrorTypesConstants} from 'constants/errors'
import {ScreenIDTypesConstants} from 'store/api/types'
import {ErrorComponent} from 'components/CommonErrorComponents'

jest.mock('../../../store/actions', () => {
  let actual = jest.requireActual('../../../store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})


context('SecureMessaging', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps()

    store = mockStore({
      ...InitialState,
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<SecureMessaging {...props} />, store)
    })

    testInstance = component.root

  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when common error occurs', () => {
    it('should render the error component', async () => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
    })
  })

  describe('when loading messages error occurs', () => {
    it('should render the loading messages error component', async () => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID,
        errorType: CommonErrorTypesConstants.APP_LEVEL_ERROR_LOAD_MESSAGES,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(errorState)
      expect(testInstance.findAllByType(ErrorComponent).length).toEqual(1)
      expect(testInstance.findByProps({'phone':'877-327-0022'})).toBeTruthy()
    })
  })

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', async () => {
      testInstance.findAllByType(TouchableOpacity)[0].props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
