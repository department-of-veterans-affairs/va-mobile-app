import React from 'react'
import { context, render, screen, fireEvent } from 'testUtils'
import VAModalPicker from './VAModalPicker'
import { InitialState } from 'store/slices'

context('VAModalPicker', () => {
  let selected: string

  const initializeTestInstance = (
    selectedValue: string = 'js',
    labelKey: string = '',
    helperTextKey: string = '',
    isRequiredField: boolean = false,
    error: string = ''
  ) => {
    const props = {
      selectedValue,
      onSelectionChange: (updatedSelected: string) => {
        selected = updatedSelected
      },
      pickerOptions: [
        { label: 'Java', value: 'java' },
        { label: 'JavaScript', value: 'js' },
        { label: 'JavaScript2', value: 'js2' },
        { label: 'JavaScript3', value: 'js3' },
      ],
      labelKey,
      helperTextKey,
      error,
      isRequiredField,
      testID: ''
    }

    render(<VAModalPicker {...props} />, {
      preloadedState: {
        accessibility: {
          ...InitialState.accessibility,
          isVoiceOverTalkBackRunning: false,
        },
      },
    })

    fireEvent.press(screen.getByRole('spinbutton'))
  }

  describe('when an option is selected', () => {
    beforeEach(() => {
      initializeTestInstance('js')
    })

    it('should update selected to the value of that option and select done', () => {
      fireEvent.press(screen.getByRole('menuitem', { name: 'Java' }))

      fireEvent.press(screen.getByRole('button', { name: 'Done' }))

      expect(selected).toEqual('java')
    })

    it('should not update selected to the value of that option and select cancel', async () => {
      fireEvent.press(screen.getByRole('menuitem', { name: 'JavaScript2' }))

      fireEvent.press(screen.getByRole('button', { name: 'Cancel' }))

      expect(selected).not.toEqual('js2')
    })
  })

  describe('when labelKey and helper text exist', () => {

    beforeEach(() => {
      initializeTestInstance('js', 'Back', 'back.a11yHint')
    })

    it('should render a textview for the label if present', () => {
      expect(screen.getByRole('spinbutton', { name: 'Back picker Navigates to the previous page' })).toBeTruthy()
      expect(screen.getAllByText('Back', { exact: false }).length).toBeGreaterThan(0)
    })

    it('should display helper text', () => {
      expect(screen.getByText('Navigates to the previous page')).toBeTruthy()
    })
  })

  describe('when there is an error, or a field is required', () => {
    beforeEach(() => {
      initializeTestInstance('js', 'label', 'back.a11yHint', true, 'ERROR')
    })

    it('should display error text', () => {
      expect(screen.getByText('ERROR')).toBeTruthy()
    })

    it('should display (Required) on the label if option is required and label is provided', () => {
      expect(screen.getByText(/(Required)/)).toBeTruthy()
    })
  })
})
