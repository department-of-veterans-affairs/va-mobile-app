import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import _ from 'lodash'

import { BackButton, Box, SaveButton, VAPicker, VAPickerProps, VASelector, VASelectorProps, VATextInput, VATextInputProps } from '../index'
import { BackButtonLabelConstants } from '../../constants/backButtonLabels'
import { useTheme, useTranslation } from 'utils/hooks'

export enum FieldType {
  Selector = 'Selector',
  Picker = 'Picker',
  TextInput = 'TextInput',
}

export type FormFieldType = {
  fieldType: FieldType
  fieldProps: VASelectorProps | VATextInputProps | VAPickerProps
  checkBoxErrorMessage?: string
  uID?: number
}

type FormWrapperProps = {
  fieldsList: Array<FormFieldType>
  onSave: () => void
  saveDisabled: boolean
  goBack: () => void
  validationFunction: () => void
}

const FormWrapper: FC<FormWrapperProps> = ({ fieldsList, onSave, saveDisabled, goBack, validationFunction }) => {
  const theme = useTheme()
  const t = useTranslation()
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

  useEffect(() => {
    if (!fieldsList[0].uID) {
      fieldsList = fieldsList.map((obj, index) => ({ ...obj, uID: index }))
    }
  })

  const initialErrorsObject = () => {
    const indexesList = Array.from(new Array(fieldsList.length), (x, i) => i)

    const errorsObject: { [key: number]: string } = {}
    _.forEach(indexesList, (index) => {
      errorsObject[index] = ''
    })

    return errorsObject
  }

  const [errors, setErrors] = useState(initialErrorsObject())

  const getAllRequiredFieldsNotFilled = (): Array<FormFieldType> => {
    return fieldsList.filter((el) => {
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

  const setErrorsOnFormSaveFailure = (requiredFieldsNotFilled: Array<FormFieldType>): void => {
    const uIDs = _.map(fieldsList, (el) => el.uID)

    const updatedErrors: { [key: number]: string } = {}
    _.forEach(requiredFieldsNotFilled, (field) => {
      const indexOfField = uIDs.indexOf(field.uID)

      let label = t('isRequired', { label: t(field.fieldProps.labelKey || '') })
      if (field.checkBoxErrorMessage && field.fieldType === FieldType.Selector) {
        label = field.checkBoxErrorMessage
      }
      updatedErrors[indexOfField] = label
    })

    setErrors({ ...errors, ...updatedErrors })
  }

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

  const setFormError = (errorMessage: string | undefined, index: number, checkBoxErrorMessage?: string) => {
    if (typeof errorMessage !== 'undefined') {
      setErrors({ ...errors, [index]: errorMessage })
      return
    }

    if (checkBoxErrorMessage) {
      setErrors({ ...errors, [index]: checkBoxErrorMessage })
    }
  }

  const getFormComponent = (field: FormFieldType, index: number): ReactElement => {
    const { fieldType, fieldProps, checkBoxErrorMessage } = field

    switch (fieldType) {
      case FieldType.Picker:
        return <VAPicker {...(fieldProps as VAPickerProps)} setError={(errorMessage: string) => setFormError(errorMessage, index)} error={errors[index]} />
      case FieldType.TextInput:
        return <VATextInput {...(fieldProps as VATextInputProps)} setError={(errorMessage: string) => setFormError(errorMessage, index)} error={errors[index]} />
      case FieldType.Selector:
        return (
          <VASelector {...(fieldProps as VASelectorProps)} setError={(errorMessage?: string) => setFormError(errorMessage, index, checkBoxErrorMessage)} error={errors[index]} />
        )
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
