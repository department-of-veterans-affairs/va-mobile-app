import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'
import { TouchableWithoutFeedback } from 'react-native'
import { updateSecureMessagingTab } from 'store/slices'
import SuccessfulSendScreen from './SuccessfulSendScreen'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('SuccessfulSendScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let navigate: jest.Mock
  let navHeaderSpy: any
  let navigateToSpy: any

  const initializeTestInstance = () => {
    navigate = jest.fn()
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)

    props = mockNavProps(
      undefined,
      {
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = { back: options.headerLeft ? options.headerLeft({}) : undefined }
        },
        navigate,
      },
      { params: {} },
    )

    component = render(<SuccessfulSendScreen {...props} />)

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(navigateToSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the go to inbox button', () => {
    it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
      testInstance.findByProps({ label: 'Go to Inbox' }).props.onPress()
      expect(navigate).toHaveBeenCalled()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })

  describe('on click of the back button', () => {
    it('should call navigate and updateSecureMessagingTab since it also routes to the inbox', async () => {
      navHeaderSpy.back.props.onPress()
      expect(navigate).toHaveBeenCalled()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
