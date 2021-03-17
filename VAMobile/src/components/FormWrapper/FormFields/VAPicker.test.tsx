import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import RNPickerSelect from 'react-native-picker-select'

import { context, renderWithProviders } from 'testUtils'
import VAPicker, {PickerItem} from './VAPicker'
import Mock = jest.Mock
import TextView from '../../TextView'
import {Box} from '../../index'

context('VAPicker', () => {
  let component: any
  let testInstance: ReactTestInstance
  let selected: string
  let setSelected: Mock
  let pickerOptions: Array<PickerItem>
  let onUpArrowSpy: Mock
  let onDownArrowSpy: Mock

  const initializeTestInstance = (selectedValue: string, labelKey?: string, placeholderKey = '', helperTextKey = '', error = '', isRequiredField = false, testID = ''): void => {
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
      onDownArrow: onDownArrowSpy,
      placeholderKey,
      helperTextKey,
      error,
      isRequiredField,
      testID
    }

    act(() => {
      component = renderWithProviders(<VAPicker {...props} />)
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

  describe('when labelKey does not exist', () => {
    it('should render no textview', async () => {
      initializeTestInstance('js')
      const textViewList = testInstance.findAllByType(TextView)
      expect(textViewList.length).toEqual(0)
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      initializeTestInstance('js', 'label', '', 'common:back.a11yHint')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Navigates to the previous page')
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      initializeTestInstance('email', 'label', '', '', 'ERROR')
      const allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews[allTextViews.length - 1].props.children).toEqual('ERROR')
    })

    it('should set the border color to error and make the border thicker', async () => {
      initializeTestInstance('email', 'label', '', '', 'ERROR')
      expect(testInstance.findAllByType(Box)[2].props.borderColor).toEqual('error')
      expect(testInstance.findAllByType(Box)[2].props.borderWidth).toEqual(2)
    })
  })

  describe('when isRequiredField is true', () => {
    it('should display (*Required)', async () => {
      initializeTestInstance('email', 'label', '', '', '', true)
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('(*Required)')
    })
  })

  describe('accessibilityValue', () => {
    describe('when the picker is focused', () => {
      describe('when there is a value', () => {
        it('should set the a11yValue to Editing: {{ text }}', async () => {
          initializeTestInstance('js2')
          testInstance.findByType(RNPickerSelect).props.onOpen()
          expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Editing: JavaScript2' })
        })
      })

      describe('when there is no value', () => {
        it('should set the a11yValue to Editing value', async () => {
          initializeTestInstance('')
          testInstance.findByType(RNPickerSelect).props.onOpen()
          expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Editing value' })
        })
      })
    })

    describe('when there is a value', () => {
      it('should set the a11yValue to the value with "Filled -"', async () => {
        initializeTestInstance('js2')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Filled - JavaScript2' })
      })
    })

    describe('when there is no value but there is a placeholder key', () => {
      it('should set the a11yValue to "Empty - {{ placeHolder }} placeholder', async () => {
        initializeTestInstance('', '', 'common:field')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Empty - Field placeholder' })
      })
    })

    describe('when there is no value or placeHolderKey', () => {
      it('should set the a11yValue to "Empty"', async () => {
        initializeTestInstance('', '', '')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityValue).toEqual({ text: 'Empty' })
      })
    })
  })

  describe('accessibilityLabel', () => {
    describe('when testID exists', () => {
      it('should start the overall accessibilityLabel with the props one', async () => {
        initializeTestInstance('email', 'label', '', '', '', false, 'my ID')
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('my ID picker')
      })
    })

    describe('when testID does not exist but label key does', () => {
      it('should start the overall accessibilityLabel with the labelKey translated', async () => {
        initializeTestInstance('email', 'common:done', '', '', '', false)
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Done picker')
      })
    })

    describe('when testID and label key do not exist', () => {
      it('should start the overall accessibilityLabel with the word picker', async () => {
        initializeTestInstance('email', '', '', '', '', false)
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('picker')
      })
    })

    describe('when isRequiredField is true', () => {
      it('should have the word required in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', '', '', true)
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field picker required')
      })
    })

    describe('when the helperTextKey exists', () => {
      it('should have the helperTextKey in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', 'common:back.a11yHint', '', false)
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field picker Navigates to the previous page')
      })
    })

    describe('when the error exists', () => {
      it('should have the error text in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', '', 'this is required', false)
        expect(testInstance.findAllByType(Box)[0].props.accessibilityLabel).toEqual('Field picker Error - this is required')
      })
    })
  })
})
