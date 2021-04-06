import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders, mockStore } from 'testUtils'
import SecureMessaging from './SecureMessaging'
import {updateSecureMessagingTab} from 'store/actions'
import {TouchableOpacity} from 'react-native'

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

  const initializeTestInstance = () => {
    props = mockNavProps()

    store = mockStore()

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

  describe('on click of a segmented control tab', () => {
    it('should call updateSecureMessagingTab', async () => {
      testInstance.findAllByType(TouchableOpacity)[0].props.onPress()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
