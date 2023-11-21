import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, waitFor } from 'testUtils'
import { PickerItem } from './VAModalPicker'
import VAModalPicker from './VAModalPicker'
import { InitialState } from 'store/slices'
import { RenderAPI, fireEvent, screen } from '@testing-library/react-native'

context('VAModalPicker', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let selected: string
  let pickerOptions: Array<PickerItem>
  let doneButton: any
  let cancelButton: any

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
        fireEvent.press(component.getByTestId('Java'))
      })

      await waitFor(() => {
        fireEvent.press(doneButton)
      })

      expect(selected).toEqual('java')
    })

    it('should not update selected to the value of that option and select cancel', async () => {
      await waitFor(() => {
        fireEvent.press(component.getByTestId('Java'))

        fireEvent.press(cancelButton)

        expect(selected).not.toEqual('java')
      })
    })
  })

  describe('when labelKey exists', () => {
    it('should render a textview for the label', async () => {
      expect(component.getByTestId('Number picker')).toBeTruthy()
      expect(screen.getAllByText('Number').length).toBeGreaterThan(0)
    })
  })

  describe('when there is helper text', () => {
    it('should display it', async () => {
      await initializeTestInstance('js', 'label', 'back.a11yHint')
      expect(screen.getByText('Navigates to the previous page')).toBeTruthy()
      expect(testInstance.findByProps({ children: 'Navigates to the previous page' })).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should display it', async () => {
      await initializeTestInstance('email', 'label', '', 'ERROR')
      expect(screen.getByText('ERROR')).toBeTruthy()
      expect(testInstance.findByProps({ children: 'ERROR' })).toBeTruthy()
    })
  })

  describe('when isRequiredField is true', () => {
    it('should display (Required)', async () => {
      await initializeTestInstance('email', 'label', '', '', true)
      expect(screen.getByText(['label', ' ', '(Required)'].join(" "))).toBeTruthy()
    })
  })
})
