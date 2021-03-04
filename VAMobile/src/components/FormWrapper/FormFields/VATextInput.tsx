import { KeyboardTypeOptions, TextInput, TextInputProps } from 'react-native'
import React, { FC, useEffect, useState } from 'react'

import { Box } from '../../index'
import { generateInputTestID, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from './formFieldUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type VATextInputTypes = 'none' | 'email' | 'phone'

export type VATextInputProps = {
  /** Type of the input. Will determine the keyboard used */
  inputType: VATextInputTypes
  /** Initial value of the input. If blank it will show the placeholder */
  value?: string
  /** Optional placeholder i18n key displayed if there is no value */
  placeholderKey?: string
  /** i18n key for the label */
  labelKey?: string
  /** Handle the change in input value */
  onChange: (val: string) => void
  /** Maximum length of the input */
  maxLength?: number
  /** Handle input once the user is done typing */
  onEndEditing?: () => void
  /** optional testID for the overall component */
  testID?: string
  /** optional ref value */
  inputRef?: React.Ref<TextInput>
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error: string) => void
  /** if this exists updates input styles to error state */
  error?: string
}

/**
 * Text input with a label
 */
const VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {
  const { inputType, value, placeholderKey, labelKey, onChange, maxLength, onEndEditing, inputRef, testID, isRequiredField, helperTextKey, setError, error } = props
  const t = useTranslation()
  const theme = useTheme()
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    updateInputErrorMessage(isFocused, isRequiredField, error, setError, value, focusUpdated, labelKey, setFocusUpdated, t)
  }, [isFocused, labelKey, value, error, setError, isRequiredField, t, focusUpdated])

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
      // TODO #16792, 'default' to avoid Voice Control crash
      // keyboardType = 'number-pad'
      break
    }
  }

  const onBlur = (): void => {
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const inputProps: TextInputProps = {
    value: value,
    placeholder: placeholderKey ? t(placeholderKey) : '',
    textContentType,
    keyboardType,
    maxLength,
    placeholderTextColor: theme.colors.text.placeholder,
    onChangeText: (newVal) => {
      onChange(newVal)
    },
    onEndEditing,
    style: {
      fontSize: theme.fontSizes.MobileBody.fontSize,
      fontFamily: theme.fontFace.regular,
      marginRight: theme.dimensions.textInputMargin,
    },
    onFocus: () => setIsFocused(true),
    onBlur,
  }

  const getA11yValue = (): string => {
    if (value) {
      return value
    }

    if (placeholderKey) {
      return `${t(placeholderKey)} ${t('textInput.placeHolder.A11yValue')}`
    }

    return t('common:noTextInInput')
  }

  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:textInput')

  return (
    <Box {...testIdProps(resultingTestID)} accessibilityValue={{ text: getA11yValue() }} accessible={true}>
      {labelKey && renderInputLabelSection(error, false, isRequiredField, labelKey, t, helperTextKey, theme)}
      <Box {...getInputWrapperProps(theme, error, isFocused)} pl={theme.dimensions.condensedMarginBetween}>
        <Box width="100%">
          <TextInput {...inputProps} ref={inputRef} />
        </Box>
      </Box>
      {!!error && renderInputError(theme, error)}
    </Box>
  )
}

export default VATextInput
