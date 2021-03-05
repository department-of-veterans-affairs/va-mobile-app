import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import FormWrapper, {FieldType, FormFieldType} from './FormWrapper'
import {StackNavigationOptions} from '@react-navigation/stack/lib/typescript/src/types'
import VAPicker from './FormFields/VAPicker'
import TextView from '../TextView'
import VATextInput, {VATextInputProps} from './FormFields/VATextInput'
import VASelector, {VASelectorProps} from './FormFields/VASelector'

let navHeaderSpy: any
jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: (options: Partial<StackNavigationOptions>) => {
        navHeaderSpy = {
          back: options.headerLeft ? options.headerLeft({}) : undefined,
          save: options.headerRight ? options.headerRight({}) : undefined
        }
      },
    }),
  };
});

context('FormWrapper', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onSaveSpy: any

  let formFieldsList: Array<FormFieldType> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        labelKey: 'profile:editDirectDeposit.routingNumber',
        inputType: 'phone',
        onChange: () => {},
        placeholderKey: 'profile:editDirectDeposit.routingNumberPlaceHolder',
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
        placeholderKey: 'profile:editDirectDeposit.accountTypePlaceHolder',
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

  const initializeTestInstance = (fieldsList = formFieldsList, saveDisabled = false) => {
    onSaveSpy = jest.fn()

    act(() => {
      component = renderWithProviders(<FormWrapper fieldsList={fieldsList} onSave={onSaveSpy} saveDisabled={saveDisabled} goBack={() => {}} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it ('should set the save button disabled field based on the saveDisabledProp', async () => {
    initializeTestInstance(formFieldsList, false)
    expect(navHeaderSpy.save.props.disabled).toEqual(false)
    initializeTestInstance(formFieldsList, true)
    expect(navHeaderSpy.save.props.disabled).toEqual(true)
  })

  describe('when the picker calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VAPicker).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('')
    })
  })

  describe('when the textinput calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[0]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VATextInput).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('')
    })
  })

  describe('when the checkbox calls setError with an empty string', () => {
    it('should set the error to empty string', async () => {
      let shortenedFieldsList = formFieldsList[2]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VASelector).props.setError('')
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews[textViews.length - 1].props.children).not.toEqual('')
    })
  })

  describe('when the picker calls setError with no parameter', () => {
    it('should set the error to the field error message', async () => {
      let shortenedFieldsList = formFieldsList[1]
      initializeTestInstance([shortenedFieldsList])
      testInstance.findByType(VAPicker).props.setError()
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

  describe('on click of the save button', () => {
    describe('when there are no required fields not filled', () => {
      describe('when validation functions pass', () => {
        it('should call onSave', async () => {
          let updatedList = formFieldsList
          let props = updatedList[2].fieldProps as VASelectorProps
          props.selected = true
          updatedList[2].validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {return true}
            }
          ]
          initializeTestInstance(updatedList)
          navHeaderSpy.save.props.onSave()
          expect(onSaveSpy).toHaveBeenCalled()
        })
      })

      describe('when validation function fails', () => {
        it('should not call onSave and update the error message to th', async () => {
          let updatedList = formFieldsList
          let props = updatedList[2].fieldProps as VASelectorProps
          props.selected = true
          updatedList[2].validationList = [
            {
              validationFunctionErrorMessage: 'ERROR',
              validationFunction: () => {return false}
            }
          ]
          initializeTestInstance(updatedList)
          navHeaderSpy.save.props.onSave()
          expect(onSaveSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('when there are required fields to be filled', () => {
      it('should update the error messages for those fields', async () => {
        let updatedList: Array<FormFieldType> = [
          {
            fieldType: FieldType.TextInput,
            fieldProps: {
              labelKey: 'profile:editDirectDeposit.routingNumber',
              inputType: 'phone',
              onChange: () => {},
              placeholderKey: 'profile:editDirectDeposit.routingNumberPlaceHolder',
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
              placeholderKey: 'profile:editDirectDeposit.accountTypePlaceHolder',
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

        initializeTestInstance(updatedList)
        navHeaderSpy.save.props.onSave()

        expect(onSaveSpy).not.toHaveBeenCalled()
        const textViews = testInstance.findAllByType(TextView)
        expect(textViews[textViews.length - 1].props.children).toEqual('third error message')
      })
    })
  })
})
