import React from 'react'
import { context, render, screen } from 'testUtils'
import FormWrapper, { FieldType, FormFieldType } from './FormWrapper'
import { VAModalPicker } from 'components'
import VATextInput from './FormFields/VATextInput'
import VASelector, { VASelectorProps } from './FormFields/VASelector'
import Mock = jest.Mock

context('FormWrapper', () => {
  let onSaveSpy: any
  let setOnSaveClicked: Mock
  let onSaveClicked: boolean

  let formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: () => { },
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
        onSelectionChange: () => { },
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
        onSelectionChange: () => { },
        disabled: false,
        isRequiredField: true,
      },
      fieldErrorMessage: 'third error message',
    },
  ]

  const initializeTestInstance = (fieldsList = formFieldsList, resetErrors = false, onSaveClickedInitialVal = false) => {
    onSaveSpy = jest.fn()
    onSaveClicked = onSaveClickedInitialVal

    setOnSaveClicked = jest.fn((value: boolean) => {
      onSaveClicked = value
    })

    render(
      <FormWrapper
        fieldsList={fieldsList}
        onSave={onSaveSpy}
        setFormContainsError={() => { }}
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
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VAModalPicker).props.setError('')
      expect(screen.queryByText('second error message')).toBeFalsy()
    })
  })

  describe('when the textinput calls setError with an empty string', () => {
    it('should set the error to empty string', () => {
      let shortenedFieldsList = formFieldsList[0]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VATextInput).props.setError('')
      expect(screen.queryByText('first error message')).toBeFalsy()
    })
  })

  describe('when the checkbox calls setError with an empty string', () => {
    it('should set the error to empty string', () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VASelector).props.setError('')
      expect(screen.queryByText('third error message')).toBeFalsy()
    })
  })

  describe('when the picker calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VAModalPicker).props.setError()
      expect(screen.getByText('second error message')).toBeTruthy()
    })
  })

  describe('when the textinput calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      let shortenedFieldsList = formFieldsList[0]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VATextInput).props.setError()
      expect(screen.getByText('first error message')).toBeTruthy()
    })
  })

  describe('when the checkbox calls setError with no parameter', () => {
    it('should set the error to the field error message', () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VASelector).props.setError()
      expect(screen.getByText('third error message')).toBeTruthy()
    })
  })

  describe('when resetErrors is true', () => {
    it('should clear the errors object', () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      screen.UNSAFE_getByType(VASelector).props.setError()
      expect(screen.getByText('third error message')).toBeTruthy()

      initializeTestInstance([shortenedFieldsList], true)
      expect(screen.getByText('I confirm that this information is correct. (Required)')).toBeTruthy()
    })
  })

  describe('when onSaveClicked is true', () => {
    describe('when there are no required fields not filled', () => {
      describe('when validation functions pass', () => {
        it('should call onSave', () => {
          let updatedList = formFieldsList
          let props = updatedList[2].fieldProps as VASelectorProps
          props.selected = true
          updatedList[2].validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {
                return false
              },
            },
          ]

          initializeTestInstance(updatedList, false, true)
          expect(onSaveSpy).toHaveBeenCalled()
        })
      })

      // describe('when validation function fails', () => {
      //   it('should not call onSave and update the error message', async () => {
      //     let updatedList = formFieldsList
      //     let props = updatedList[2].fieldProps as VASelectorProps
      //     props.selected = true
      //     updatedList[2].validationList = [
      //       {
      //         validationFunctionErrorMessage: 'ERROR',
      //         validationFunction: () => {
      //           return true
      //         },
      //       },
      //     ]
      //     initializeTestInstance(updatedList, false, true)
      //     expect(onSaveSpy).not.toHaveBeenCalled()
      //     expect(screen.getByText('ERROR')).toBeTruthy()
      //   })
      // })
    })

    // describe('when there are required fields to be filled', () => {
    //   it('should update the error messages for those fields', async () => {
    //     let updatedList: Array<FormFieldType<unknown>> = [
    //       {
    //         fieldType: FieldType.TextInput,
    //         fieldProps: {
    //           labelKey: 'profile:editDirectDeposit.routingNumber',
    //           inputType: 'phone',
    //           onChange: () => {},
    //           value: '',
    //           isRequiredField: true,
    //         },
    //         fieldErrorMessage: 'first error message',
    //       },
    //       {
    //         fieldType: FieldType.Picker,
    //         fieldProps: {
    //           labelKey: 'profile:editDirectDeposit.accountType',
    //           selectedValue: '',
    //           onSelectionChange: () => {},
    //           pickerOptions: [],
    //           isRequiredField: true,
    //         },
    //         fieldErrorMessage: 'second error message',
    //       },
    //       {
    //         fieldType: FieldType.Selector,
    //         fieldProps: {
    //           labelKey: 'profile:editDirectDeposit.confirm',
    //           selected: false,
    //           onSelectionChange: () => {},
    //           disabled: false,
    //           isRequiredField: true,
    //         },
    //         fieldErrorMessage: 'third error message',
    //       },
    //     ]

    //     initializeTestInstance(updatedList, false, true)
    //     expect(onSaveSpy).not.toHaveBeenCalled()
    //     expect(screen.getByText('third error message')).toBeTruthy()
    //   })
    // })
  })
})

