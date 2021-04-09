import { AccessibilityProps, KeyboardTypeOptions, Pressable, TextInput, TextInputProps } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC, ReactElement, RefObject, useEffect, useRef, useState } from 'react'

import { AccessibilityState, StoreState } from 'store/reducers'
import { Box, BoxProps, ValidationFunctionItems } from '../../index'
import { focusTextInputRef } from 'utils/common'
import {
  generateA11yValue,
  generateInputTestID,
  getInputBorderColor,
  getInputWrapperProps,
  renderInputError,
  renderInputLabelSection,
  updateInputErrorMessage,
} from './formFieldUtils'
import { isIOS } from 'utils/platform'
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
  inputRef?: RefObject<TextInput>
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error?: string) => void
  /** if this exists updates input styles to error state */
  error?: string
  /** optional list of validation functions to check against */
  validationList?: Array<ValidationFunctionItems>
  /** optional boolean that when true displays a text area rather than a single line text input */
  isTextArea?: boolean
}

/**
 * Text input with a label
 */
const VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {
  const {
    inputType,
    value,
    placeholderKey,
    labelKey,
    onChange,
    maxLength,
    onEndEditing,
    inputRef,
    testID,
    isRequiredField,
    helperTextKey,
    setError,
    error,
    validationList,
    isTextArea,
  } = props
  const { isVoiceOverTalkBackRunning } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)
  const t = useTranslation()
  const theme = useTheme()
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef<TextInput>(null)

  useEffect(() => {
    updateInputErrorMessage(isFocused, isRequiredField, error, setError, value, focusUpdated, setFocusUpdated, validationList)
  }, [isFocused, labelKey, value, error, setError, isRequiredField, t, focusUpdated, validationList])

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

      // if there was an error, remove when the user starts typing
      if (newVal.length > 0 && setError && error !== '') {
        setError('')
      }
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

  const textAreaWrapperProps: BoxProps = {
    backgroundColor: 'textBox',
    height: theme.dimensions.textAreaHeight,
    borderColor: getInputBorderColor(error, isFocused),
    borderWidth: isFocused || !!error ? theme.dimensions.focusedInputBorderWidth : theme.dimensions.borderWidth,
  }

  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:textInput')

  const renderTextInput = (): ReactElement => {
    const textAreaProps = isTextArea ? { multiline: true } : {}
    const wrapperProps = isTextArea ? textAreaWrapperProps : getInputWrapperProps(theme, error, isFocused)

    let textInputBox = (
      <Box {...wrapperProps} pl={theme.dimensions.condensedMarginBetween}>
        <Box width="100%">
          <TextInput {...inputProps} {...textAreaProps} ref={inputRef || ref} accessibilityRole={'none'} accessible={false} />
        </Box>
      </Box>
    )

    // If the input is a text area, we update to focus on click of the text area so that if the user clicks anywhere in the text area, the focus will update
    if (isTextArea) {
      textInputBox = <Pressable onPress={() => focusTextInputRef(inputRef || ref)}>{textInputBox}</Pressable>
    }

    const content = (
      <Box>
        {labelKey && renderInputLabelSection(error, false, isRequiredField, labelKey, t, helperTextKey, theme)}
        {textInputBox}
        {!!error && renderInputError(theme, error)}
      </Box>
    )

    const parentProps: AccessibilityProps = {
      accessibilityValue: { text: generateA11yValue(value, placeholderKey, isFocused, t) },
    }

    // If voiceOver is running on an ios device, we update to focus on tap of the whole object (including the label) so that on double tap it is still editable
    if (isVoiceOverTalkBackRunning && isIOS()) {
      return (
        <Pressable {...testIdProps(resultingTestID)} {...parentProps} onPress={() => focusTextInputRef(inputRef || ref)}>
          {content}
        </Pressable>
      )
    }

    return (
      <Box {...testIdProps(resultingTestID)} {...parentProps} accessible={true}>
        {content}
      </Box>
    )
  }

  return renderTextInput()
}

export default VATextInput
