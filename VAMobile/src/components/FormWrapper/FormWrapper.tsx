import React, { ReactElement, useCallback, useEffect, useState } from 'react'

import _ from 'lodash'

import {
  Box,
  FormAttachments,
  FormAttachmentsProps,
  RadioGroup,
  RadioGroupProps,
  VAModalPicker,
  VAModalPickerProps,
  VASelector,
  VASelectorProps,
  VATextInput,
  VATextInputProps,
} from '../index'
import { useTheme } from 'utils/hooks'

/** enum to determine field input type */
export enum FieldType {
  Selector = 'Selector',
  Picker = 'Picker',
  TextInput = 'TextInput',
  Radios = 'Radios',
  FormAttachmentsList = 'FormAttachmentsList',
}

/** contains function to compare against on save and on focus/blur, and its corresponding error message if the function fails */
export type ValidationFunctionItems = {
  /** function that returns true if the validation fails */
  validationFunction: () => boolean
  /** error message to display if the validation fails */
  validationFunctionErrorMessage: string
}

/** form field type that includes the index of the field in the list so that it can be used to find a specific field */
type FormFieldTypeWithUId<T> = Pick<FormFieldType<T>, 'fieldType' | 'fieldProps' | 'fieldErrorMessage'> & { index: number }

export type FormFieldType<T> = {
  /** enum to determine if the field is a picker, text input, or checkbox selector */
  fieldType: FieldType
  /** props to pass into form input component */
  fieldProps: VASelectorProps | VATextInputProps | VAModalPickerProps | RadioGroupProps<T> | FormAttachmentsProps
  /** optional error message to display if the field is required and it hasn't been filled */
  fieldErrorMessage?: string
  /** optional list of validation functions to check against */
  validationList?: Array<ValidationFunctionItems>
}

/**
 * Props for FormWrapper component
 */
type FormWrapperProps<T> = {
  /** list of form field objects to display */
  fieldsList: Array<FormFieldType<T>>
  /** callback called when onSaveClicked is true and there are no field errors */
  onSave: () => void
  /** boolean that when set to true calls the form validation and set field errors if they exist, otherwise it calls onSave */
  onSaveClicked: boolean
  /** callback that updates the onSaveClicked prop */
  setOnSaveClicked: (value: boolean) => void
  /** optional callback that sets to true if the form currently has an error */
  setFormContainsError?: (containsError: boolean) => void
  /** optional boolean that resets all field errors when set to true */
  resetErrors?: boolean
  /** optional callback to set the resetErrors prop. must be set when resetErrors is set. */
  setResetErrors?: (value: boolean) => void
}

/**A common component to wrap forms in that handles error states of each field*/
const FormWrapper = <T,>({ fieldsList, onSave, setFormContainsError, resetErrors, setResetErrors, onSaveClicked, setOnSaveClicked }: FormWrapperProps<T>): ReactElement => {
  const theme = useTheme()
  const [errors, setErrors] = useState<{ [key: number]: string }>({})

  const updateFormContainsErrors = useCallback(
    (value: boolean) => {
      setFormContainsError && setFormContainsError(value)
    },
    [setFormContainsError],
  )

  useEffect(() => {
    // if resetErrors is true, it clears the errors object
    if (resetErrors) {
      setErrors({})
      updateFormContainsErrors(false)
      setResetErrors && setResetErrors(false)
    }
  }, [resetErrors, setErrors, updateFormContainsErrors, setResetErrors])

  // when onSaveClicked is true, it checks if all required fields are filled and if the validation functions pass. if true,
  // calls onSave callback, otherwise calls setErrorsOnFormSaveFailure to update the error messages for the required
  // fields that are not filled / failing validation functions
  const onFormSave = useCallback(() => {
    // Adds the field "index", which is the index of the field in the fieldsList, to each item
    const getFieldListsWithIndexes = (): Array<FormFieldTypeWithUId<T>> => {
      return fieldsList.map((obj, index) => ({ ...obj, index }))
    }

    // Using the fieldsList with the index fields, this returns all fields that are required but are
    // empty or set to false (checkbox)
    const getAllRequiredFieldsNotFilled = (): Array<FormFieldTypeWithUId<T>> => {
      const fieldsListWithUIds = getFieldListsWithIndexes()

      return fieldsListWithUIds.filter((el) => {
        switch (el.fieldType) {
          case FieldType.TextInput:
            const textInputProps = el.fieldProps as VATextInputProps
            return !textInputProps.value && textInputProps.isRequiredField
          case FieldType.Picker:
            const pickerProps = el.fieldProps as VAModalPickerProps
            return !pickerProps.selectedValue && pickerProps.isRequiredField
          case FieldType.Selector:
            const checkboxProps = el.fieldProps as VASelectorProps
            return !checkboxProps.selected && checkboxProps.isRequiredField
          default:
            // default returns false because the radio group and form attachments will not have field errors
            return false
        }
      })
    }

    // Iterates over all required form fields that are not filled and updates the error messages for these fields
    const setErrorsOnFormSaveFailure = (requiredFieldsNotFilled: Array<FormFieldTypeWithUId<T>>, errorsFromValidationFunctions: { [key: number]: string }): void => {
      const updatedErrors: { [key: number]: string } = {}
      _.forEach(requiredFieldsNotFilled, (field) => {
        updatedErrors[field.index] = field.fieldErrorMessage || ''
      })

      const updatedErrorsObj = { ...errors, ...errorsFromValidationFunctions, ...updatedErrors }
      if (!_.isEqual(errors, updatedErrorsObj)) {
        setErrors(updatedErrorsObj)
      }
    }

    // Returns any errors to be set if a validation function failed
    const checkAgainstValidationFunctions = () => {
      const updatedErrors: { [key: number]: string } = {}

      _.forEach(fieldsList, (field, index) => {
        if (field.validationList) {
          const result = field.validationList.filter((el) => {
            return el.validationFunction()
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

    const requiredFieldsNotFilled = getAllRequiredFieldsNotFilled()
    const errorsFromValidationFunctions = checkAgainstValidationFunctions()

    if (requiredFieldsNotFilled.length === 0 && _.isEmpty(errorsFromValidationFunctions)) {
      if (!_.isEmpty(errors)) {
        setErrors({})
      }

      updateFormContainsErrors(false)
      onSave()
    } else {
      updateFormContainsErrors(true)
      setErrorsOnFormSaveFailure(requiredFieldsNotFilled, errorsFromValidationFunctions)
    }
  }, [onSave, updateFormContainsErrors, errors, fieldsList])

  useEffect(() => {
    if (onSaveClicked) {
      onFormSave()
      setOnSaveClicked(false)
    }
  }, [onSaveClicked, onFormSave, setOnSaveClicked])

  // sets the field error in the errors object based on its index, if its a string it sets it to the given errorMessage
  // otherwise, it sets it to the fieldErrorMessage if it exists
  const setFormError = (errorMessage: string | undefined, index: number, fieldErrorMessage: string | undefined): void => {
    if (typeof errorMessage === 'string') {
      const updatedErrors = { ...errors, [index]: errorMessage }
      setErrors(updatedErrors)
      const errorStillExists = _.values(updatedErrors).some((el) => el !== '')

      if (errorStillExists) {
        updateFormContainsErrors(true)
      } else {
        updateFormContainsErrors(false)
      }

      return
    }

    updateFormContainsErrors(true)

    if (fieldErrorMessage) {
      setErrors({ ...errors, [index]: fieldErrorMessage })
    }
  }

  // returns the corresponding component based on the fields fieldType
  const getFormComponent = (field: FormFieldType<T>, index: number): ReactElement => {
    const { fieldType, fieldProps, fieldErrorMessage, validationList } = field

    switch (fieldType) {
      case FieldType.Picker:
        return (
          <VAModalPicker
            {...(fieldProps as VAModalPickerProps)}
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
      case FieldType.Radios:
        return <RadioGroup {...(fieldProps as RadioGroupProps<T>)} />
      case FieldType.FormAttachmentsList:
        return <FormAttachments {...(fieldProps as FormAttachmentsProps)} />
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
