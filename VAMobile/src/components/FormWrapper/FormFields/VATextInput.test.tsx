import 'react-native'
import React from 'react'
import { Pressable, TextInput } from 'react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import VATextInput, { VATextInputTypes } from './VATextInput'
import { Box, TextView } from '../../index'
import { isIOS } from 'utils/platform'

let mockIsIOS = jest.fn()
jest.mock('utils/platform', () => ({
  isIOS: jest.fn(() => mockIsIOS),
}))

context('VATextInput', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onChangeSpy: Mock
  let isIOSMock = isIOS as jest.Mock

  const initializeTestInstance = (
    inputType = 'email' as VATextInputTypes,
    value = '',
    helperTextKey = '',
    error = '',
    isRequiredField = false,
    testID = '',
    labelKey = 'profile:contactInformation.emailAddress',
    isTextArea = false,
  ) => {
    onChangeSpy = jest.fn(() => {})

    isIOSMock.mockReturnValue(false)

    component = render(
      <VATextInput
        inputType={inputType}
        onChange={onChangeSpy}
        labelKey={labelKey}
        value={value}
        helperTextKey={helperTextKey}
        isRequiredField={isRequiredField}
        testID={testID}
        isTextArea={isTextArea}
        error={error}
      />,
    )

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    await waitFor(() => {
      testInstance.findByType(VATextInput).props.onChange()
      expect(onChangeSpy).toBeCalled()
    })
  })

  describe('when isTextArea is true', () => {
    it('should add the text area props to the text input', async () => {
      initializeTestInstance('email', 'field', 'back.a11yHint', '', false, '', 'field', true)
      expect(testInstance.findByType(TextInput).props.multiline).toEqual(true)
    })
  })

  describe('when input type is email', () => {
    it('should set the textContentType to "emailAddress"', async () => {
      expect(testInstance.findByType(TextInput).props.textContentType).toEqual('emailAddress')
      expect(testInstance.findByType(TextInput).props.keyboardType).toEqual('email-address')
    })
  })

  describe('when input type is phone', () => {
    it('should set the textContentType to "telephoneNumber"', async () => {
      initializeTestInstance('phone')
      expect(testInstance.findByType(TextInput).props.textContentType).toEqual('telephoneNumber')
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      initializeTestInstance('email', '', 'back.a11yHint')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Navigates to the previous page')
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      initializeTestInstance('email', '', '', 'ERROR')
      const allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews[allTextViews.length - 1].props.children).toEqual('ERROR')
    })

    it('should set the border color to error and make the border thicker', async () => {
      initializeTestInstance('email', '', '', 'ERROR')
      expect(testInstance.findAllByType(Box)[4].props.borderColor).toEqual('error')
      expect(testInstance.findAllByType(Box)[4].props.borderWidth).toEqual(2)
    })
  })
})
