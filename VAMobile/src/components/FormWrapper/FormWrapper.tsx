import React, { FC, ReactElement, useState } from 'react'

import _ from 'lodash'

import { Box, VAPicker, VAPickerProps, VASelector, VASelectorProps, VATextInput, VATextInputProps } from '../index'
import { useTheme } from 'utils/hooks'

export enum FieldType {
  Selector = 'Selector',
  Picker = 'Picker',
  TextInput = 'TextInput',
}

type FormFieldType = {
  fieldType: FieldType
  fieldProps: VASelectorProps | VATextInputProps | VAPickerProps

  isFormValid: boolean
  setIsFormValid: boolean
}

type FormWrapperProps = {
  fieldsList: Array<FormFieldType>
}

const FormWrapper: FC<FormWrapperProps> = ({ fieldsList }) => {
  const theme = useTheme()

  const initialErrorsObject = () => {
    const indexesList = Array.from(new Array(fieldsList.length), (x, i) => i)

    const errorsObject: { [key: number]: string } = {}
    _.forEach(indexesList, (index) => {
      errorsObject[index] = ''
    })

    return errorsObject
  }

  const [errors, setErrors] = useState(initialErrorsObject())

  const setFormError = (value: string, index: number) => {
    setErrors({ ...errors, [index]: value })
  }

  const getFormComponent = (field: FormFieldType, index: number): ReactElement => {
    const { fieldType, fieldProps } = field

    switch (fieldType) {
      case FieldType.Picker:
        return <VAPicker {...(fieldProps as VAPickerProps)} />
      case FieldType.TextInput:
        return <VATextInput {...(fieldProps as VATextInputProps)} />
      case FieldType.Selector:
        return <VASelector {...(fieldProps as VASelectorProps)} />
    }
  }

  const generateForm = (): ReactElement[] => {
    return _.map(fieldsList, (field, index) => {
      return (
        <Box mt={index === 0 ? 0 : theme.dimensions.standardMarginBetween} key={index}>
          {getFormComponent(field, index)}
        </Box>
      )
    })
  }

  return <Box>{generateForm()}</Box>
}

export default FormWrapper
