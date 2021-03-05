import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'

import { BackButton, Box, SaveButton, VAPicker, VAPickerProps, VASelector, VASelectorProps, VATextInput, VATextInputProps } from '../index'
import { BackButtonLabelConstants } from '../../constants/backButtonLabels'
import { useTheme } from 'utils/hooks'

/** enum to determine field input type */
export enum FieldType {
  Selector = 'Selector',
  Picker = 'Picker',
  TextInput = 'TextInput',
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
  /** validation function called to determine if items are disabled/enabled, and any other validation */
  validationFunction: () => void
}

const FormWrapper: FC<FormWrapperProps> = ({ fieldsList, onSave, saveDisabled, goBack, validationFunction }) => {
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

  useEffect(() => {
    validationFunction()
  }, [validationFunction])

  // Creates the initial empty error messages object of indexes to empty strings
  // When there is an error for a form field the error will be set to its corresponding index from the fieldsList
  const initialErrorsObject = () => {
    // creates a list of indexes based on the fieldsList length, i.e. if fieldsList has 3 elements
    // this will return [0, 1, 2]
    const indexesList = Array.from(new Array(fieldsList.length), (x, i) => i)

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
          return textInputProps.value === '' && textInputProps.isRequiredField
        case FieldType.Picker:
          const pickerProps = el.fieldProps as VAPickerProps
          return pickerProps.selectedValue === '' && pickerProps.isRequiredField
        case FieldType.Selector:
          const checkboxProps = el.fieldProps as VASelectorProps
          return !checkboxProps.selected && checkboxProps.isRequiredField
      }
    })
  }

  // Iterates over all required form fields that are not filled and updates the error messages for these fields
  const setErrorsOnFormSaveFailure = (requiredFieldsNotFilled: Array<FormFieldTypeWithUId>): void => {
    const updatedErrors: { [key: number]: string } = {}
    _.forEach(requiredFieldsNotFilled, (field) => {
      updatedErrors[field.index] = field.fieldErrorMessage || ''
    })

    setErrors({ ...errors, ...updatedErrors })
  }

  // on click of save, it checks if all required fields are filled and that there are no current error messages
  // if true, calls onSave callback, otherwise calls setErrorsOnFormSaveFailure to update the error messages for
  // the required fields that are not filled
  const onFormSave = (): void => {
    const errorsContainsAMessage = _.values(errors).some((message) => message !== '')
    const requiredFieldsNotFilled = getAllRequiredFieldsNotFilled()

    if (requiredFieldsNotFilled.length === 0) {
      if (!errorsContainsAMessage) {
        onSave()
      }
    } else {
      setErrorsOnFormSaveFailure(requiredFieldsNotFilled)
    }
  }

  // sets the field error in the errors object based on its index, if its an empty string it sets it to the empty string
  // otherwise, it sets it to the fieldErrorMessage if it exists
  const setFormError = (errorMessage: string | undefined, index: number, fieldErrorMessage: string | undefined) => {
    if (errorMessage === '') {
      setErrors({ ...errors, [index]: errorMessage })
      return
    }

    if (fieldErrorMessage) {
      setErrors({ ...errors, [index]: fieldErrorMessage })
    }
  }

  // returns the corresponding component based on the fields fieldType
  const getFormComponent = (field: FormFieldType, index: number): ReactElement => {
    const { fieldType, fieldProps, fieldErrorMessage } = field

    switch (fieldType) {
      case FieldType.Picker:
        return <VAPicker {...(fieldProps as VAPickerProps)} setError={(errorMessage?: string) => setFormError(errorMessage, index, fieldErrorMessage)} error={errors[index]} />
      case FieldType.TextInput:
        return (
          <VATextInput {...(fieldProps as VATextInputProps)} setError={(errorMessage?: string) => setFormError(errorMessage, index, fieldErrorMessage)} error={errors[index]} />
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
