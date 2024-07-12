import React from 'react'

import { VAModalPicker } from 'components'
import { context, render, screen } from 'testUtils'

import VASelector, { VASelectorProps } from './FormFields/VASelector'
import VATextInput from './FormFields/VATextInput'
import FormWrapper, { FieldType, FormFieldType } from './FormWrapper'

import Mock = jest.Mock

context('FormWrapper', () => {
  let onSaveSpy: () => void
  let setOnSaveClicked: Mock
  let onSaveClicked: boolean

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: () => {},
        value: '12345',
        isRequiredField: true,
      },
      fieldErrorMessage: 'first error message',
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'editDirectDeposit.accountType',
        selectedValue: 'one',
        onSelectionChange: () => {},
        pickerOptions: [],
        isRequiredField: true,
      },
      fieldErrorMessage: 'second error message',
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'editDirectDeposit.confirm',
        selected: false,
        onSelectionChange: () => {},
        disabled: false,
        isRequiredField: true,
      },
      fieldErrorMessage: 'third error message',
    },
  ]

  const selectorFieldList = formFieldsList.filter((field) => field.fieldType === FieldType.Selector)
  const pickerFieldList = formFieldsList.filter((field) => field.fieldType === FieldType.Picker)
  const textInputFieldList = formFieldsList.filter((field) => field.fieldType === FieldType.TextInput)

  const initializeTestInstance = (
    fieldsList = formFieldsList,
    resetErrors = false,
    onSaveClickedInitialVal = false,
  ) => {
    onSaveSpy = jest.fn()
    onSaveClicked = onSaveClickedInitialVal

    setOnSaveClicked = jest.fn((value: boolean) => {
      onSaveClicked = value
    })

    render(
      <FormWrapper
        fieldsList={fieldsList}
        onSave={onSaveSpy}
        setFormContainsError={() => {}}
        resetErrors={resetErrors}
        setOnSaveClicked={setOnSaveClicked}
        onSaveClicked={onSaveClicked}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when the picker calls setError with an empty string', () => {
    it('should set the error to empty string', () => {
      initializeTestInstance(pickerFieldList)
      screen.UNSAFE_getByType(VAModalPicker).props.setError('')
      expect(screen.queryByText('second error message')).toBeFalsy()
    })
  })

  describe('when the textinput calls setError with an empty string', () => {
    it('should set the error to empty string', () => {
      initializeTestInstance(textInputFieldList)
      screen.UNSAFE_getByType(VATextInput).props.setError('')
      expect(screen.queryByText('first error message')).toBeFalsy()
    })
  })

  describe('when the checkbox calls setError with an empty string', () => {
    it('should set the error to empty string', () => {
      initializeTestInstance(selectorFieldList)
      screen.UNSAFE_getByType(VASelector).props.setError('')
      expect(screen.queryByText('third error message')).toBeFalsy()
    })
  })

  describe('when the picker calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      initializeTestInstance(pickerFieldList)
      screen.UNSAFE_getByType(VAModalPicker).props.setError()
      expect(screen.getByText('second error message')).toBeTruthy()
    })
  })

  describe('when the textinput calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      initializeTestInstance(textInputFieldList)
      screen.UNSAFE_getByType(VATextInput).props.setError()
      expect(screen.getByText('first error message')).toBeTruthy()
    })
  })

  describe('when the checkbox calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      initializeTestInstance(selectorFieldList)
      screen.UNSAFE_getByType(VASelector).props.setError()
      expect(screen.getByText('third error message')).toBeTruthy()
    })
  })

  describe('when resetErrors is true', () => {
    it('should clear the errors object', () => {
      initializeTestInstance(selectorFieldList)
      screen.UNSAFE_getByType(VASelector).props.setError()
      expect(screen.getByText('third error message')).toBeTruthy()

      initializeTestInstance(selectorFieldList, true)
      expect(screen.getByText('I confirm that this information is correct. (Required)')).toBeTruthy()
    })
  })

  describe('when onSaveClicked is true', () => {
    describe('when there are no required fields not filled', () => {
      describe('when validation functions pass', () => {
        it('should call onSave', () => {
          const updatedSelectorListItem = selectorFieldList[0]
          const props = updatedSelectorListItem.fieldProps as VASelectorProps
          props.selected = true
          updatedSelectorListItem.validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {
                return false
              },
            },
          ]
          const updatedList = [...textInputFieldList, ...pickerFieldList, updatedSelectorListItem]

          initializeTestInstance(updatedList, false, true)
          expect(onSaveSpy).toHaveBeenCalled()
        })
      })
    })
  })
})
