import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { act, ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import VASelector, { SelectorType } from './VASelector'
import { TextView } from '../../index'
import Mock = jest.Mock

context('VASelector', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let selected: boolean
  let setSelected: Mock
  let errorMessage: string
  let setErrorMessage: Mock

  const initializeTestInstance = (selectedValue: boolean, disabled?: boolean, error?: string, selectorType = SelectorType.Checkbox): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))

    errorMessage = error || ''
    setErrorMessage = jest.fn((value?: string) => {
      if (value) {
        errorMessage = value
      } else {
        errorMessage = 'This is the default error message'
      }
    })

    component = render(
      <VASelector
        labelKey={'profile:editAddress.address'}
        selected={selected}
        disabled={disabled}
        onSelectionChange={setSelected}
        error={errorMessage}
        setError={setErrorMessage}
        selectorType={selectorType}
      />,
    )

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the checkbox area is clicked', () => {
    it('should call setSelected', async () => {
      await waitFor(() => {
        testInstance.findByType(TouchableWithoutFeedback).props.onPress()
        expect(setSelected).toBeCalled()
        expect(selected).toEqual(true)
      })
    })
  })

  describe('when selected is true', () => {
    it('should display the filled checkbox icon', async () => {
      initializeTestInstance(true)
      const filledCheckBox = findByTestID(testInstance, 'CheckBoxFilled')

      expect(filledCheckBox).toBeTruthy()
      expect(filledCheckBox.props.fill).toEqual('checkboxEnabledPrimary')
    })
  })

  describe('when selected is false', () => {
    it('should display the empty checkbox icon', async () => {
      const emptyCheckBox = findByTestID(testInstance, 'CheckBoxEmpty')

      expect(emptyCheckBox).toBeTruthy()
      expect(emptyCheckBox.props.fill).toEqual('checkboxDisabledContrast')
      expect(emptyCheckBox.props.stroke).toEqual('checkboxDisabled')
    })
  })

  describe('when disabled is true and checkbox area is clicked', () => {
    it('should not call setSelected', async () => {
      initializeTestInstance(false, true)
      await waitFor(() => {
        testInstance.findByType(TouchableWithoutFeedback).props.onPress()
        expect(setSelected).not.toBeCalled()
        expect(selected).toEqual(false)
      })
    })
  })

  describe('when disabled is true and the selector type is radio', () => {
    it('should display the RadioEmpty icon', async () => {
      initializeTestInstance(false, true, '', SelectorType.Radio)
      const radioDisabled = findByTestID(testInstance, 'RadioEmpty')
      expect(radioDisabled).toBeTruthy()
    })
  })

  describe('when there is an error and the selector type is checkbox', () => {
    it('should display the CheckBoxError and the error message', async () => {
      initializeTestInstance(false, false, 'ERROR MESSAGE')

      const checkBoxError = findByTestID(testInstance, 'CheckBoxError')
      expect(checkBoxError).toBeTruthy()

      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 2].props.children).toEqual('ERROR MESSAGE')
    })
  })
})
