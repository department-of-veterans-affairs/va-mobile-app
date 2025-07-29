import React, { FC, ReactElement, RefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardTypeOptions, TextInput, TextInputProps } from 'react-native'

import { Box, BoxProps } from 'components'
import {
  getInputBorderColor,
  getInputBorderWidth,
  getInputWrapperProps,
  removeInputErrorMessage,
  renderInputError,
  renderInputLabelSection,
} from 'components/FormWrapper/FormFields/formFieldUtils'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

export type VATextInputTypes = 'none' | 'email' | 'phone'

export type VATextInputProps = {
  /** Type of the input. Will determine the keyboard used */
  inputType: VATextInputTypes
  /** Initial value of the input. If blank it will show the placeholder */
  value?: string
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
  inputRef?: RefObject<TextInput>
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error?: string) => void
  /** if this exists updates input styles to error state */
  error?: string
  /** optional boolean that when true displays a text area rather than a single line text input */
  isTextArea?: boolean
  /** optional boolean to set the cursor to the beginning of a string value */
  setInputCursorToBeginning?: boolean
  /** optional element rendered before text input */
  preAdornment?: ReactElement
  boldLabelKey?: boolean
}

/**
 * Text input with a label
 */
const VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {
  const {
    inputType,
    value,
    labelKey,
    onChange,
    maxLength,
    onEndEditing,
    testID,
    inputRef,
    isRequiredField,
    helperTextKey,
    setError,
    error,
    isTextArea,
    setInputCursorToBeginning,
    preAdornment,
    boldLabelKey,
  } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const startTextPositon = { start: 0, end: 0 }
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selection, setSelection] = useState<{ start: number; end?: number } | undefined>(
    setInputCursorToBeginning ? startTextPositon : undefined,
  )
  const ref = useRef<TextInput>(null)

  useEffect(() => {
    removeInputErrorMessage(isFocused, error, setError, focusUpdated, setFocusUpdated)
  }, [isFocused, error, setError, focusUpdated])

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
      keyboardType = isIOS() ? 'number-pad' : 'numeric'
      break
    }
  }

  const onBlur = (): void => {
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const onFocus = () => {
    setIsFocused(true)
    if (setInputCursorToBeginning) {
      setSelection(undefined)
    }
  }

  const inputBorderWidth = getInputBorderWidth(theme, error, isFocused)
  const textAreaHeight = 201

  const inputProps: TextInputProps = {
    value: value,
    textContentType,
    keyboardType,
    maxLength,
    disableFullscreenUI: true,
    placeholderTextColor: theme.colors.text.placeholder,
    textAlignVertical: isTextArea ? 'top' : undefined,
    onChangeText: (newVal) => {
      if ((newVal.length > 0 && keyboardType === 'number-pad') || keyboardType === 'numeric') {
        onChange(newVal.replace(/\D/g, ''))
      } else {
        onChange(newVal)
      }
    },
    onEndEditing,
    style: {
      fontSize: theme.fontSizes.MobileBody.fontSize,
      fontFamily: theme.fontFace.regular,
      paddingRight: 40,
      color: isFocused ? theme.colors.text.inputFocused : theme.colors.text.input,
      height: isTextArea ? textAreaHeight - inputBorderWidth * 2 : undefined,
      width: '100%',
    },
    onFocus,
    onBlur,
    selection,
    multiline: !!isTextArea,
    testID,
  }

  const textAreaWrapperProps: BoxProps = {
    backgroundColor: 'textBox',
    height: textAreaHeight,
    borderColor: getInputBorderColor(error, isFocused),
    borderWidth: inputBorderWidth,
    pl: 8,
  }

  const renderTextInput = (): ReactElement => {
    const wrapperProps = isTextArea ? textAreaWrapperProps : getInputWrapperProps(theme, error, isFocused)

    const textInputBox = (
      <Box display="flex" flexDirection="row" gap={theme.dimensions.smallMarginBetween} alignItems="center">
        {preAdornment}
        <Box flex={1} {...wrapperProps}>
          <TextInput testID={testID} {...inputProps} ref={inputRef || ref} />
        </Box>
      </Box>
    )

    const content = (
      <Box>
        {labelKey && renderInputLabelSection(error, isRequiredField, labelKey, t, helperTextKey, boldLabelKey)}
        {!!error && renderInputError(error)}
        {textInputBox}
      </Box>
    )

    return <Box>{content}</Box>
  }

  return renderTextInput()
}

export default VATextInput
