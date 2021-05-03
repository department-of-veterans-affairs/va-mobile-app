import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import FormWrapper, {FieldType, FormFieldType} from './FormWrapper'
import { VAModalPicker } from 'components'
import TextView from '../TextView'
import VATextInput from './FormFields/VATextInput'
import VASelector, {VASelectorProps} from './FormFields/VASelector'
import Mock = jest.Mock

context('FormWrapper', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onSaveSpy: any
  let setOnSaveClicked: Mock
  let onSaveClicked: boolean

  let formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: () => {},
        value: '12345',
        isRequiredField: true,
        helperTextKey: 'profile:editDirectDeposit.routingNumberHelperText',
      },
      fieldErrorMessage: 'first error message'
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.accountType',
        selectedValue: 'one',
        onSelectionChange: () => {},
        pickerOptions: [],
        isRequiredField: true,
      },
      fieldErrorMessage: 'second error message'
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.confirm',
        selected: false,
        onSelectionChange: () => {},
        disabled: false,
        isRequiredField: true,
      },
      fieldErrorMessage: 'third error message'
    },
  ]

  const initializeTestInstance = (fieldsList = formFieldsList, resetErrors = false, onSaveClickedInitialVal = false) => {
    onSaveSpy = jest.fn()
    onSaveClicked = onSaveClickedInitialVal

    setOnSaveClicked = jest.fn((value: boolean) => {
      onSaveClicked = value
    })

    act(() => {
      component = renderWithProviders(<FormWrapper fieldsList={fieldsList} onSave={onSaveSpy} setFormContainsError={() => {}} resetErrors={resetErrors} setOnSaveClicked={setOnSaveClicked} onSaveClicked={onSaveClicked} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the picker calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VAModalPicker).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('second error message')
    })
  })

  describe('when the textinput calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[0]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VATextInput).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('first error message')
    })
  })

  describe('when the checkbox calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VASelector).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('third error message')
    })
  })

  describe('when the picker calls setError with no parameter', () => {
    it('should set the error to the field error message', async () => {
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VAModalPicker).props.setError()
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).toEqual('second error message')
    })
  })

  describe('when the textinput calls setError with no parameter', () => {
    it('should set the error to the field error message', async () => {
      let shortenedFieldsList = formFieldsList[0]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VATextInput).props.setError()
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).toEqual('first error message')
    })
  })

  describe('when the checkbox calls setError with no parameter', () => {
    it('should set the error to the field error message', async () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VASelector).props.setError()
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).toEqual('third error message')
    })
  })

  describe('when resetErrors is true', () => {
    it('should clear the errors object', async () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VASelector).props.setError()
      let textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).toEqual('third error message')

      initializeTestInstance([shortenedFieldsList], true)
      textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).toEqual('I confirm that this information is correct')
    })
  })

  describe('when onSaveClicked is true', () => {
    describe('when there are no required fields not filled', () => {
      describe('when validation functions pass', () => {
        it('should call onSave', async () => {
          let updatedList = formFieldsList
          let props = updatedList[2].fieldProps as VASelectorProps
          props.selected = true
          updatedList[2].validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {return false}
            }
          ]

          initializeTestInstance(updatedList, false, true)
          expect(onSaveSpy).toHaveBeenCalled()
        })
      })

      describe('when validation function fails', () => {
        it('should not call onSave and update the error message', async () => {
          let updatedList = formFieldsList
          let props = updatedList[2].fieldProps as VASelectorProps
          props.selected = true
          updatedList[2].validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {return true}
            }
          ]
          initializeTestInstance(updatedList, false, true)
          expect(onSaveSpy).not.toHaveBeenCalled()
          const textViews = testInstance.findAllByType(TextView)

          expect(textViews[textViews.length - 1].props.children).toEqual('ERROR')
        })
      })
    })

    describe('when there are required fields to be filled', () => {
      it('should update the error messages for those fields', async () => {
        let updatedList: Array<FormFieldType<unknown>> = [
          {
            fieldType: FieldType.TextInput,
            fieldProps: {
              labelKey: 'profile:editDirectDeposit.routingNumber',
              inputType: 'phone',
              onChange: () => {},
              value: '',
              isRequiredField: true,
              helperTextKey: 'profile:editDirectDeposit.routingNumberHelperText',
            },
            fieldErrorMessage: 'first error message'
          },
          {
            fieldType: FieldType.Picker,
            fieldProps: {
              labelKey: 'profile:editDirectDeposit.accountType',
              selectedValue: '',
              onSelectionChange: () => {},
              pickerOptions: [],
              isRequiredField: true,
            },
            fieldErrorMessage: 'second error message'
          },
          {
            fieldType: FieldType.Selector,
            fieldProps: {
              labelKey: 'profile:editDirectDeposit.confirm',
              selected: false,
              onSelectionChange: () => {},
              disabled: false,
              isRequiredField: true,
            },
            fieldErrorMessage: 'third error message'
          },
        ]

        initializeTestInstance(updatedList, false, true)
        expect(onSaveSpy).not.toHaveBeenCalled()
        const textViews = testInstance.findAllByType(TextView)
        expect(textViews[textViews.length - 1].props.children).toEqual('third error message')
      })
    })
  })
})
