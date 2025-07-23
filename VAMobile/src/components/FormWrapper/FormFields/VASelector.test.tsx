import React from 'react'

import { SelectorType, VASelector } from 'components'
import { context, fireEvent, render, screen } from 'testUtils'

import Mock = jest.Mock

context('VASelector', () => {
  let selected: boolean
  let setSelected: Mock
  let errorMessage: string
  let setErrorMessage: Mock

  const initializeTestInstance = (
    selectedValue: boolean,
    disabled?: boolean,
    error?: string,
    selectorType = SelectorType.Checkbox,
  ): void => {
    selected = selectedValue
    setSelected = jest.fn((updatedSelected) => (selected = updatedSelected))

    errorMessage = error || ''
    setErrorMessage = jest.fn((value?: string) => {
      if (value) {
        errorMessage = value
      } else {
        errorMessage = 'This is the default error message'
      }
    })

    render(
      <VASelector
        testID="CheckBox"
        labelKey={'editAddress.address'}
        selected={selected}
        disabled={disabled}
        onSelectionChange={setSelected}
        error={errorMessage}
        setError={setErrorMessage}
        selectorType={selectorType}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  describe('when the checkbox area is clicked', () => {
    it('should call setSelected', () => {
      fireEvent.press(screen.getByRole('checkbox'))
      expect(setSelected).toBeCalled()
      expect(selected).toEqual(true)
    })
  })

  describe('when selected is true', () => {
    it('should display the filled checkbox and update accessibility state', () => {
      initializeTestInstance(true)
      expect(screen.getByRole('checkbox', { checked: true })).toBeTruthy()
    })
  })

  describe('when selected is false', () => {
    it('should display the empty checkbox', () => {
      expect(screen.getByRole('checkbox', { checked: false })).toBeTruthy()
    })
  })

  describe('when disabled is true and checkbox area is clicked', () => {
    it('should not call setSelected', () => {
      initializeTestInstance(false, true)
      fireEvent.press(screen.getByRole('checkbox'))
      expect(setSelected).not.toBeCalled()
      expect(selected).toEqual(false)
    })
  })

  describe('when disabled is true and the selector type is radio', () => {
    it('should display the RadioEmpty', () => {
      initializeTestInstance(false, true, '', SelectorType.Radio)
      expect(
        screen.getByRole('radio', {
          checked: false,
        }),
      ).toBeTruthy()
    })
  })

  describe('when there is an error and the selector type is checkbox', () => {
    it('should display the Error and the error message', () => {
      initializeTestInstance(false, false, 'ERROR MESSAGE')
      expect(screen.getByText('ERROR MESSAGE')).toBeTruthy()
    })
  })
})
