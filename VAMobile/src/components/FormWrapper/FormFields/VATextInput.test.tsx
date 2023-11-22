import 'react-native'
import React from 'react'
import { context, render, screen, fireEvent } from 'testUtils'
import VATextInput from './VATextInput'

context('VATextInput', () => {
  let onChangeSpy = jest.fn()

  describe('When input type is email', () => {
    beforeEach(() => {
      render(<VATextInput
        inputType={'email'}
        onChange={onChangeSpy}
        labelKey={'contactInformation.emailAddress'}
        value={''}
        helperTextKey={'back.a11yHint'}
        isRequiredField={false}
        testID={'InputTest'}
        isTextArea={false}
        error={''}
      />)
    })
    it('should call onChange when text is entered', () => {
      fireEvent.changeText(screen.getByTestId('InputTest'), 'content')
      expect(onChangeSpy).toHaveBeenCalled()
    })

    it('should display a label if provided', () => {
      expect(screen.getByText('Email address')).toBeTruthy()
    })

    it('should display helper text if provided', () => {
      expect(screen.getByText('Navigates to the previous page')).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      render(<VATextInput
        inputType={'email'}
        onChange={onChangeSpy}
        labelKey={'contactInformation.emailAddress'}
        value={''}
        helperTextKey={'back.a11yHint'}
        isRequiredField={false}
        testID={'InputTest'}
        isTextArea={false}
        error={'ERROR'}
      />)
    })
    it('should display Error text', () => {
      expect(screen.getByText('ERROR')).toBeTruthy()
    })
  })

  describe('when it is a required field', () => {
    beforeEach(() => {
      render(<VATextInput
        inputType={'email'}
        onChange={onChangeSpy}
        labelKey={'contactInformation.emailAddress'}
        value={''}
        helperTextKey={'back.a11yHint'}
        isRequiredField={true}
        testID={'InputTest'}
        isTextArea={false}
        error={''}
      />)
    })
    it('should include "(Required)" in the label', () => {
      expect(screen.getByText('(Required)', { exact: false })).toBeTruthy()
    })
  })
})
