import React, { FC } from 'react'

import { KeyboardTypeOptions, TextInput, TextInputProps } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'

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
}

/**
 * Text input with a label
 */
const VATextInput: FC<VATextInputProps> = (props: VATextInputProps) => {
  const { inputType, value, placeholderKey, labelKey, onChange, maxLength, onEndEditing, inputRef, testID = 'va-text-input' } = props
  const t = useTranslation()
  const theme = useTheme()

  const wrapperProps: BoxProps = {
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    px: theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    flexWrap: 'wrap',
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
      // TODO #16792, 'default' to avoid Voice Control crash
      // keyboardType = 'number-pad'
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
    style: {
      fontSize: theme.fontSizes.MobileBody.fontSize,
      fontFamily: theme.fontFace.regular,
    },
  }

  return (
    <Box {...wrapperProps} {...testIdProps(testID)}>
      {labelKey && (
        <TextView minWidth={theme.dimensions.inputAndPickerLabelWidth} mr={theme.dimensions.gutter}>
          {t(labelKey)}
        </TextView>
      )}
      <TextInput {...inputProps} ref={inputRef} />
    </Box>
  )
}

export default VATextInput
