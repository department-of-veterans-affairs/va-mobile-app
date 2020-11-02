import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import DefaultPicker, {pickerItem} from './DefaultPicker'
import Mock = jest.Mock
import TextView from './TextView'

context('DefaultPicker', () => {
  let component: any
  let testInstance: ReactTestInstance
  let selected: string
  let setSelected: Mock
  let pickerOptions: Array<pickerItem>
  let onUpArrowSpy: Mock
  let onDownArrowSpy: Mock

  const initializeTestInstance = (selectedValue: string, labelKey?: string): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => selected = updatedSelected)

    onUpArrowSpy = jest.fn()
    onDownArrowSpy = jest.fn()

    const props = {
      selectedValue: selected,
      onSelectionChange: setSelected,
      pickerOptions,
      labelKey,
      onUpArrow: onUpArrowSpy,
      onDownArrow: onDownArrowSpy
    }

    act(() => {
      component = renderWithProviders(<DefaultPicker {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    pickerOptions = [
      { label: 'Java', value: 'java' },
      { label: 'JavaScript', value: 'js' },
      { label: 'JavaScript2', value: 'js2' },
      { label: 'JavaScript3', value: 'js3' }
    ]

    initializeTestInstance('js', 'profile:editPhoneNumber.number')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when an option is selected', () => {
    it('should update selected to the value of that option', async() => {
      testInstance.findByProps({ items: pickerOptions }).props.onValueChange('java')
      expect(selected).toEqual('java')
    })
  })

  describe('when onUpArrow is called', () => {
    it('should call onUpArrowSpy', async () => {
      testInstance.findByProps({ items: pickerOptions }).props.onUpArrow()
      expect(onUpArrowSpy).toBeCalled()
    })
  })

  describe('when onUpArrow is called', () => {
    it('should call onUpArrowSpy', async () => {
      testInstance.findByProps({ items: pickerOptions }).props.onDownArrow()
      expect(onDownArrowSpy).toBeCalled()
    })
  })

  describe('when labelKey exists', () => {
    it('should render a textview for the label', async () => {
      const textViewList = testInstance.findAllByType(TextView)
      expect(textViewList.length).toEqual(1)
      expect(textViewList[0].props.children).toEqual('Number')
    })
  })

  describe('when labelKey exists', () => {
    it('should render no textview', async () => {
      initializeTestInstance('js')
      const textViewList = testInstance.findAllByType(TextView)
      expect(textViewList.length).toEqual(0)
    })
  })
})
