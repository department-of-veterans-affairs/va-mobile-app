import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import VAModalPicker from './VAModalPicker'

context('VAModalPicker', () => {
  let selected: string

  const initializeTestInstance = (labelKey = '', helperTextKey = '', isRequiredField = false, error = '') => {
    const props = {
      selectedValue: 'js',
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
      testID: '',
    }

    render(<VAModalPicker {...props} />)

    fireEvent.press(screen.getByRole('button'))
  }

  describe('when an option is selected', () => {
    beforeEach(() => {
      initializeTestInstance()
    })

    it('should update selected to the value of that option and select done', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Java' }))

      fireEvent.press(screen.getByRole('button', { name: 'Done' }))

      expect(selected).toEqual('java')
    })

    it('should not update selected to the value of that option and select cancel', async () => {
      fireEvent.press(screen.getByRole('link', { name: 'JavaScript2' }))

      fireEvent.press(screen.getByRole('button', { name: 'Cancel' }))

      expect(selected).not.toEqual('js2')
    })
  })

  describe('when labelKey and helper text exist', () => {
    beforeEach(() => {
      initializeTestInstance('Back', 'back.a11yHint')
    })

    it('should render a textview for the label if present', () => {
      expect(screen.getByRole('button', { name: 'Back picker Navigates to the previous page' })).toBeTruthy()
      expect(screen.getAllByText(/Back/).length).toBeGreaterThan(0)
    })

    it('should display helper text', () => {
      expect(screen.getByText('Navigates to the previous page')).toBeTruthy()
    })
  })

  describe('when there is an error, or a field is required', () => {
    beforeEach(() => {
      initializeTestInstance('label', 'back.a11yHint', true, 'ERROR')
    })

    it('should display error text', () => {
      expect(screen.getByText('ERROR')).toBeTruthy()
    })

    it('should display (Required) on the label if option is required and label is provided', () => {
      expect(screen.getByText(/(Required)/)).toBeTruthy()
    })
  })
})
