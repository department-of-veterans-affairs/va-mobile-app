import 'react-native'
import React from 'react'
import {TextInput} from 'react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, renderWithProviders } from 'testUtils'
import VATextInput, {VATextInputTypes} from './VATextInput'
import {Box, TextView} from '../../index'

context('VATextInput', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onChangeSpy: Mock

  const initializeTestInstance = (inputType = 'email' as VATextInputTypes, value = '', placeHolderKey = 'common:field', helperTextKey = '', error = '', isRequiredField = false, testID = '', labelKey = 'profile:personalInformation.emailAddress') => {
    onChangeSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(<VATextInput
                                        inputType={inputType}
                                        onChange={onChangeSpy}
                                        labelKey={labelKey}
                                        value={value}
                                        placeholderKey={placeHolderKey}
                                        helperTextKey={helperTextKey}
                                        isRequiredField={isRequiredField}
                                        testID={testID}
                                        error={error} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onChange', async () => {
    testInstance.findByType(VATextInput).props.onChange()
    expect(onChangeSpy).toBeCalled()
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

  describe('when there is a value', () => {
    it('should set the a11yValue to "Filled - value"', async () => {
      initializeTestInstance('email', 'the text value')
      expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Filled - the text value' })
    })
  })

  describe('when there is no value but there is a placeholder key', () => {
    it('should set the a11yValue to "Empty - {{ placeHolder }} placeholder"', async () => {
      expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Empty - Field placeholder' })
    })
  })

  describe('when there is no value or placeHolderKey', () => {
    it('should set the a11yValue to "Empty"', async () => {
      initializeTestInstance('email', '', '')
      expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Empty' })
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      initializeTestInstance('email', '', '', 'common:back.a11yHint')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Navigates to the previous page')
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      initializeTestInstance('email', '', '', '', 'ERROR')
      const allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews[allTextViews.length - 1].props.children).toEqual('ERROR')
    })

    it('should set the border color to error and make the border thicker', async () => {
      initializeTestInstance('email', '', '', '', 'ERROR')
      expect(testInstance.findAllByType(Box)[2].props.borderColor).toEqual('error')
      expect(testInstance.findAllByType(Box)[2].props.borderWidth).toEqual(2)
    })
  })

  describe('when isRequiredField is true', () => {
    it('should display (*Required)', async () => {
      initializeTestInstance('email', '', '', '', '', true)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('(*Required)')
    })
  })

  describe('accessibilityLabel', () => {
    describe('when testID exists', () => {
      it('should start the overall accessibilityLabel with the props one', async () => {
        initializeTestInstance('email', 'label', '', '', '', false, 'my ID')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('my ID text input')
      })
    })

    describe('when testID does not exist but label key does', () => {
      it('should start the overall accessibilityLabel with the labelKey translated', async () => {
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Email address text input')
      })
    })

    describe('when testID and label key do not exist', () => {
      it('should start the overall accessibilityLabel with the word text input', async () => {
        initializeTestInstance('email', '', '', '', '', false, '', '')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('text input')
      })
    })

    describe('when isRequiredField is true', () => {
      it('should have the word required in the accessibilityLabel', async () => {
        initializeTestInstance('email', '', '', '', '', true, '', 'common:field')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field text input required')
      })
    })

    describe('when the helperTextKey exists', () => {
      it('should have the helperTextKey in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', 'common:back.a11yHint', '', false, '', 'common:field')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field text input Navigates to the previous page')
      })
    })

    describe('when the error exists', () => {
      it('should have the error text in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', '', 'this is required', false, '', 'common:field')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field text input this is required error')
      })
    })
  })
})
