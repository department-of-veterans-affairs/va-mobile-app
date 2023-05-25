import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { TouchableWithoutFeedback } from 'react-native'
import { updateSecureMessagingTab } from 'store/slices'
import ReplyTriageErrorScreen from './ReplyTriageErrorScreen'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
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

context('ReplyTriageErrorScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let navigate: jest.Mock
  let navigateTo: jest.Mock

  const initializeTestInstance = () => {
    navigate = jest.fn()
    navigateTo = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateTo)

    props = mockNavProps(
      undefined,
      {
        setOptions: navigate,
      },
      { params: {} },
    )

    component = render(<ReplyTriageErrorScreen {...props} />)

    testInstance = component.UNSAFE_root
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
      expect(navigateTo).toHaveBeenCalled()
    })
  })

  describe('on click of the go to inbox button', () => {
    it('should call useRouteNavigation and updateSecureMessagingTab', async () => {
      testInstance.findByProps({ label: 'Go to inbox' }).props.onPress()
      expect(navigate).toHaveBeenCalled()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
    })
  })
})
