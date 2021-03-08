import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'

import { BackButton, Box, SaveButton, VAPicker, VAPickerProps, VASelector, VASelectorProps, VATextInput, VATextInputProps } from '../index'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { useTheme } from 'utils/hooks'

/** enum to determine field input type */
export enum FieldType {
  Selector = 'Selector',
  Picker = 'Picker',
  TextInput = 'TextInput',
}

/** contains function to compare against on save and on focus/blur, and its corresponding error message if the function fails */
export type ValidationFunctionItems = {
  /** function that returns false if the validation fails */
  validationFunction: () => boolean
  /** error message to display if the validation fails */
  validationFunctionErrorMessage: string
}

/** form field type that includes the index of the field in the list so that it can be used to find a specific field */
type FormFieldTypeWithUId = Pick<FormFieldType, 'fieldType' | 'fieldProps' | 'fieldErrorMessage'> & { index: number }

export type FormFieldType = {
  /** enum to determine if the field is a picker, text input, or checkbox selector */
  fieldType: FieldType
  /** props to pass into form input component */
  fieldProps: VASelectorProps | VATextInputProps | VAPickerProps
  /** optional error message to display if the field is required and it hasn't been filled */
  fieldErrorMessage?: string
  /** optional list of validation functions to check against */
  validationList?: Array<ValidationFunctionItems>
}

/**
 * Props for FormWrapper component
 */
type FormWrapperProps = {
  /** list of form field objects to display */
  fieldsList: Array<FormFieldType>
  /** callback called on click of the save button in the header */
  onSave: () => void
  /** boolean to determine if the save button is disabled */
  saveDisabled: boolean
  /** callback to go back to the previous page */
  goBack: () => void
}

const FormWrapper: FC<FormWrapperProps> = ({ fieldsList, onSave, saveDisabled, goBack }) => {
  const theme = useTheme()
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={goBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onFormSave} disabled={saveDisabled} />,
    })
  })

  // Creates the initial empty error messages object of indexes to empty strings
  // When there is an error for a form field the error will be set to its corresponding index from the fieldsList
  const initialErrorsObject = () => {
    // creates a list of indexes based on the fieldsList length, i.e. if fieldsList has 3 elements
    // this will return [0, 1, 2]
    const indexesList = [...Array(fieldsList.length).keys()]

    // create map of numbers to empty strings, i.e. [0, 1, 2] => {0: '', 1: '', 2: ''}
    const errorsObject: { [key: number]: string } = {}
    _.forEach(indexesList, (index) => {
      errorsObject[index] = ''
    })

    return errorsObject
  }

  const [errors, setErrors] = useState(initialErrorsObject())

  // Adds the field "index", which is the index of the field in the fieldsList, to each item
  const getFieldListsWithIndexes = (): Array<FormFieldTypeWithUId> => {
    return fieldsList.map((obj, index) => ({ ...obj, index }))
  }

  // Using the fieldsList with the index fields, this returns all fields that are required but are
  // empty or set to false (checkbox)
  const getAllRequiredFieldsNotFilled = (): Array<FormFieldTypeWithUId> => {
    const fieldsListWithUIds = getFieldListsWithIndexes()

    return fieldsListWithUIds.filter((el) => {
      switch (el.fieldType) {
        case FieldType.TextInput:
          const textInputProps = el.fieldProps as VATextInputProps
          return !textInputProps.value && textInputProps.isRequiredField
        case FieldType.Picker:
          const pickerProps = el.fieldProps as VAPickerProps
          return !pickerProps.selectedValue && pickerProps.isRequiredField
        case FieldType.Selector:
          const checkboxProps = el.fieldProps as VASelectorProps
          return !checkboxProps.selected && checkboxProps.isRequiredField
      }
    })
  }

  // Iterates over all required form fields that are not filled and updates the error messages for these fields
  const setErrorsOnFormSaveFailure = (requiredFieldsNotFilled: Array<FormFieldTypeWithUId>, errorsFromValidationFunctions: { [key: number]: string }): void => {
    const updatedErrors: { [key: number]: string } = {}
    _.forEach(requiredFieldsNotFilled, (field) => {
      updatedErrors[field.index] = field.fieldErrorMessage || ''
    })

    setErrors({ ...errors, ...errorsFromValidationFunctions, ...updatedErrors })
  }

  // Returns any errors to be set if a validation function failed
  const checkAgainstValidationFunctions = () => {
    const updatedErrors: { [key: number]: string } = {}

    _.forEach(fieldsList, (field, index) => {
      if (field.validationList) {
        const result = field.validationList.filter((el) => {
          return !el.validationFunction()
        })

        // if there are items in the result that means that that validation function failed
        if (result.length > 0) {
          _.forEach(result, (item) => {
            updatedErrors[index] = item.validationFunctionErrorMessage
          })
        }
      }
    })

    return updatedErrors
  }

  // on click of save, it checks if all required fields are filled and if the validation functions pass. if true,
  // calls onSave callback, otherwise calls setErrorsOnFormSaveFailure to update the error messages for the required
  // fields that are not filled / failing validation functions
  const onFormSave = (): void => {
    setErrors(initialErrorsObject())

    const requiredFieldsNotFilled = getAllRequiredFieldsNotFilled()
    const errorsFromValidationFunctions = checkAgainstValidationFunctions()

    if (requiredFieldsNotFilled.length === 0 && _.isEmpty(errorsFromValidationFunctions)) {
      onSave()
    } else {
      setErrorsOnFormSaveFailure(requiredFieldsNotFilled, errorsFromValidationFunctions)
    }
  }

  // sets the field error in the errors object based on its index, if its a string it sets it to the given errorMessage
  // otherwise, it sets it to the fieldErrorMessage if it exists
  const setFormError = (errorMessage: string | undefined, index: number, fieldErrorMessage: string | undefined) => {
    if (typeof errorMessage === 'string') {
      setErrors({ ...errors, [index]: errorMessage })
      return
    }

    if (fieldErrorMessage) {
      setErrors({ ...errors, [index]: fieldErrorMessage })
    }
  }

  // returns the corresponding component based on the fields fieldType
  const getFormComponent = (field: FormFieldType, index: number): ReactElement => {
    const { fieldType, fieldProps, fieldErrorMessage, validationList } = field

    switch (fieldType) {
      case FieldType.Picker:
        return (
          <VAPicker
            {...(fieldProps as VAPickerProps)}
            validationList={validationList}
            setError={(errorMessage?: string) => setFormError(errorMessage, index, fieldErrorMessage)}
            error={errors[index]}
          />
        )
      case FieldType.TextInput:
        return (
          <VATextInput
            {...(fieldProps as VATextInputProps)}
            validationList={validationList}
            setError={(errorMessage?: string) => setFormError(errorMessage, index, fieldErrorMessage)}
            error={errors[index]}
          />
        )
      case FieldType.Selector:
        return <VASelector {...(fieldProps as VASelectorProps)} setError={(errorMessage?: string) => setFormError(errorMessage, index, fieldErrorMessage)} error={errors[index]} />
    }
  }

  const generateForm = (): ReactElement[] => {
    return _.map(fieldsList, (field, index) => {
      return (
        <Box mt={index === 0 ? 0 : theme.dimensions.formMarginBetween} key={index}>
          {getFormComponent(field, index)}
        </Box>
      )
    })
  }

  return <Box>{generateForm()}</Box>
}

export default FormWrapper
