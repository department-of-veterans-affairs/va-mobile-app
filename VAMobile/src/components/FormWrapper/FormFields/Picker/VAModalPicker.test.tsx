import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'

import { context, mockStore, render, waitFor } from 'testUtils'
import { PickerItem } from './VAModalPicker'
import Mock = jest.Mock
import VAModalPicker from './VAModalPicker'
import TextView from 'components/TextView'
import BaseListItem from 'components/BaseListItem'
import { InitialState } from 'store/slices'
import { RenderAPI } from '@testing-library/react-native'

context('VAModalPicker', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let selected: string
  let setSelected: Mock
  let pickerOptions: Array<PickerItem>
  let doneButton: any
  let cancelButton: any
  let selectionButtons: any

  const initializeTestInstance = (selectedValue: string, labelKey?: string, helperTextKey = '', error = '', isRequiredField = false, testID = '', isRunning = false): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))

    const props = {
      selectedValue: selected,
      onSelectionChange: setSelected,
      pickerOptions,
      labelKey,
      helperTextKey,
      error,
      isRequiredField,
      testID,
    }

    component = render(<VAModalPicker {...props} />, {
      preloadedState: {
        accessibility: {
          ...InitialState.accessibility,
          isVoiceOverTalkBackRunning: isRunning,
        },
      },
    })

    testInstance = component.container

    doneButton = testInstance.findByProps({ accessibilityLabel: 'Done' })
    cancelButton = testInstance.findByProps({ accessibilityLabel: 'Cancel' })
    selectionButtons = testInstance.findAllByType(BaseListItem)
  }

  beforeEach(() => {
    pickerOptions = [
      { label: 'Java', value: 'java' },
      { label: 'JavaScript', value: 'js' },
      { label: 'JavaScript2', value: 'js2' },
      { label: 'JavaScript3', value: 'js3' },
    ]

    initializeTestInstance('js', 'profile:editPhoneNumber.number')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when an option is selected', () => {
    it('should update selected to the value of that option and select done', async () => {
      await waitFor(() => {
        selectionButtons[0].props.onPress()

        doneButton.props.onPress()

        expect(selected).toEqual('java')
      })
    })

    it('should not update selected to the value of that option and select cancel', async () => {
      await waitFor(() => {
        selectionButtons[0].props.onPress()

        cancelButton.props.onPress()

        expect(selected).not.toEqual('java')
      })
    })
  })

  describe('when labelKey exists', () => {
    it('should render a textview for the label', async () => {
      const textViews = testInstance.findAllByType(TextView)
      expect(testInstance.findByType(TextView).props.children).toEqual('Number')
      expect(textViews.length).toEqual(7)
    })
  })

  describe('when labelKey does not exist', () => {
    it('should render not render the label', async () => {
      initializeTestInstance('js')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(6)
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      initializeTestInstance('js', 'label', 'common:back.a11yHint')
      expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Navigates to the previous page')
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      initializeTestInstance('email', 'label', '', 'ERROR')
      const allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews[allTextViews.length - 2].props.children).toEqual('ERROR')
    })
  })

  describe('when isRequiredField is true', () => {
    it('should display (Required)', async () => {
      initializeTestInstance('email', 'label', '', '', true)
      expect(testInstance.findByType(TextView).props.children).toEqual('(Required)')
    })
  })

  describe('accessibilityLabel', () => {
    describe('when testID exists', () => {
      it('should start the overall accessibilityLabel with the props one', async () => {
        initializeTestInstance('email', 'label', '', '', false, 'my ID')
        expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('my ID picker')
      })
    })

    describe('when testID does not exist but label key does', () => {
      it('should start the overall accessibilityLabel with the labelKey translated', async () => {
        initializeTestInstance('email', 'common:done', '', '', false)
        expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('Done picker')
      })
    })

    describe('when testID and label key do not exist', () => {
      it('should start the overall accessibilityLabel with the word picker', async () => {
        initializeTestInstance('email', '', '', '', false)
        expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('picker')
      })
    })

    // describe('when isRequiredField is true', () => {
    it('should have the word required in the accessibilityLabel', async () => {
      initializeTestInstance('email', 'common:field', '', '', true)
      expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('Field picker required')
    })

    describe('when the helperTextKey exists', () => {
      it('should have the helperTextKey in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', 'common:back.a11yHint', '', false)
        expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('Field picker Navigates to the previous page')
      })
    })

    describe('when the error exists', () => {
      it('should have the error text in the accessibilityLabel', async () => {
        initializeTestInstance('email', 'common:field', '', 'this is required', false)
        expect(testInstance.findAllByType(Pressable)[6].props.accessibilityLabel).toEqual('Field picker Error - this is required')
      })
    })
  })
})
