import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, waitFor } from 'testUtils'
import { PickerItem } from './VAModalPicker'
import VAModalPicker from './VAModalPicker'
import TextView from 'components/TextView'
import BaseListItem from 'components/BaseListItem'
import { InitialState } from 'store/slices'
import { RenderAPI } from '@testing-library/react-native'

context('VAModalPicker', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let selected: string
  let pickerOptions: Array<PickerItem>
  let doneButton: any
  let cancelButton: any
  let selectionButtons: any

  const initializeTestInstance = async (
    selectedValue: string,
    labelKey?: string,
    helperTextKey = '',
    error = '',
    isRequiredField = false,
    testID = '',
    isRunning = false,
  ): Promise<void> => {
    selected = selectedValue
    const setSelected = (updatedSelected: string) => {
      selected = updatedSelected
    }

    const props = {
      selectedValue: selectedValue,
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

    testInstance = component.UNSAFE_root

    await waitFor(() => {
      const showButton = testInstance.findByProps({ accessibilityRole: 'spinbutton' })
      showButton.props.onPress()
    })

    doneButton = testInstance.findByProps({ accessibilityLabel: 'Done' })
    cancelButton = testInstance.findByProps({ accessibilityLabel: 'Cancel' })
    selectionButtons = testInstance.findAllByType(BaseListItem)
  }

  beforeEach(async () => {
    pickerOptions = [
      { label: 'Java', value: 'java' },
      { label: 'JavaScript', value: 'js' },
      { label: 'JavaScript2', value: 'js2' },
      { label: 'JavaScript3', value: 'js3' },
    ]

    await initializeTestInstance('js', 'editPhoneNumber.number')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when an option is selected', () => {
    it('should update selected to the value of that option and select done', async () => {
      await waitFor(() => {
        selectionButtons[0].props.onPress()
      })

      await waitFor(() => {
        doneButton.props.onPress()
      })

      expect(selected).toEqual('java')
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
      expect(textViews[7].props.children).toEqual(['Number', ' ', ''])
      expect(textViews.length).toEqual(9)
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      await initializeTestInstance('js', 'label', 'back.a11yHint')
      expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Navigates to the previous page')
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      await initializeTestInstance('email', 'label', '', 'ERROR')
      const allTextViews = testInstance.findAllByType(TextView)
      expect(allTextViews[allTextViews.length - 2].props.children).toEqual('ERROR')
    })
  })

  describe('when isRequiredField is true', () => {
    it('should display (Required)', async () => {
      await initializeTestInstance('email', 'label', '', '', true)
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[7].props.children).toEqual(['label', ' ', '(Required)'])
      expect(textViews.length).toEqual(9)
    })
  })
})
