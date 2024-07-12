import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import VATextInput from './VATextInput'

context('VATextInput', () => {
  const onChangeSpy = jest.fn()

  const initializeTestInstance = (isRequiredField = false, error = '') => {
    render(
      <VATextInput
        inputType={'email'}
        onChange={onChangeSpy}
        labelKey={'contactInformation.emailAddress'}
        value={''}
        helperTextKey={'back.a11yHint'}
        isRequiredField={isRequiredField}
        testID={'InputTest'}
        isTextArea={false}
        error={error}
      />,
    )
  }

  describe('When input type is email', () => {
    beforeEach(() => {
      initializeTestInstance()
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
      initializeTestInstance(false, 'ERROR')
    })
    it('should display Error text', () => {
      expect(screen.getByText('ERROR')).toBeTruthy()
    })
  })

  describe('when it is a required field', () => {
    beforeEach(() => {
      initializeTestInstance(true)
    })
    it('should include "(Required)" in the label', () => {
      expect(screen.getByText(/(Required)/)).toBeTruthy()
    })
  })
})
