import React, { FC } from 'react'
import styled from 'styled-components/native'

import { KeyboardTypeOptions, TextInputProps } from 'react-native'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'

type VATextInputTypes = 'none' | 'email' | 'phone'

type VATextInputProps = {
  /** Type of the input. Will determine the keyboard used */
  inputType: VATextInputTypes
  /** Initial value of the input. If blank it will show the placeholder */
  value?: string
  /** Optional placeholder i18n key displayed if there is no value */
  placeholderKey?: string
  /** i18n key for the label */
  labelKey: string
  /** Handle the change in input value */
  onChange: (val: string) => void
  /** Maximum length of the input */
  maxLength?: number
  /** Handle input once the user is done typing */
  onEndEditing?: () => void
}

const StyledTextInput = styled.TextInput`
  height: 100%;
  flex: 1;
`

/**
 * Text input with a label
 */
const VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {
  const { inputType, value, placeholderKey, labelKey, onChange, maxLength, onEndEditing } = props
  const t = useTranslation()
  const theme = useTheme()

  const wrapperProps: BoxProps = {
    width: '100%',
    minHeight: 44,
    px: 20,
    borderBottomWidth: 1,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
  }

  let textContentType: 'emailAddress' | 'telephoneNumber' | 'none' = 'none'
  let keyboardType: KeyboardTypeOptions = 'default'

  switch (inputType) {
    case 'email': {
      textContentType = 'emailAddress'
      keyboardType = 'email-address'
      break
    }
    case 'phone': {
      textContentType = 'telephoneNumber'
      keyboardType = 'number-pad'
      break
    }
  }

  let placeholder = ''

  if (placeholderKey) {
    placeholder = t(placeholderKey)
  }

  const inputProps: TextInputProps = {
    value: value,
    placeholder,
    textContentType,
    keyboardType,
    maxLength,
    placeholderTextColor: theme.colors.text.placeholder,
    onChangeText: (newVal) => {
      onChange(newVal)
    },
    onEndEditing,
  }

  return (
    <Box {...wrapperProps}>
      <TextView width={110} pr={10}>
        {t(labelKey)}
      </TextView>
      <StyledTextInput {...inputProps} />
    </Box>
  )
}

export default VATextInput
