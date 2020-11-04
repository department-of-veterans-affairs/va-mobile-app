import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import {TouchableWithoutFeedback} from 'react-native'

import { context, renderWithProviders, findByTestID} from 'testUtils'
import CheckBox from './CheckBox'
import Mock = jest.Mock

context('CheckBox', () => {
  let component: any
  let testInstance: ReactTestInstance
  let selected: boolean
  let setSelected: Mock

  const initializeTestInstance = (selectedValue: boolean, disabled?: boolean): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => selected = updatedSelected)

    act(() => {
      component = renderWithProviders(<CheckBox label={'I live on a United States military base outside of the United States.'} selected={selected} disabled={disabled}onSelectionChange={setSelected}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the checkbox area is clicked', () => {
    it('should call setSelected', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(setSelected).toBeCalled()
      expect(selected).toEqual(true)
    })
  })

  describe('when selected is true', () => {
    it('should display the filled checkbox icon', async () => {
      initializeTestInstance(true)
      const filledCheckBox = findByTestID(testInstance, 'FilledCheckBox')

      expect(filledCheckBox).toBeTruthy()
      expect(filledCheckBox.props.fill).toEqual('checkboxEnabledPrimary')
      expect(filledCheckBox.props.stroke).toEqual('checkboxEnabledPrimary')
    })
  })

  describe('when selected is false', () => {
    it('should display the empty checkbox icon', async () => {
      const emptyCheckBox = findByTestID(testInstance, 'EmptyCheckBox')

      expect(emptyCheckBox).toBeTruthy()
      expect(emptyCheckBox.props.fill).toEqual('checkboxDisabledContrast')
      expect(emptyCheckBox.props.stroke).toEqual('checkboxDisabled')
    })
  })

  describe('when disabled is true and checkbox area is clicked', () => {
    it('should not call setSelected', async () => {
      initializeTestInstance(false, true)

      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(setSelected).not.toBeCalled()
      expect(selected).toEqual(false)
    })
  })
})
