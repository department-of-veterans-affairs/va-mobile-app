import React, { ReactElement } from 'react'

import { TFunction } from 'i18next'

import { BorderColorVariant, Box, BoxProps, TextView } from '../../index'
import { VATheme } from '../../../styles/theme'

/**
 * Renders the label section consisting of the label, potential required text, and potential helper text
 * for the picker and text input components
 */
export const renderInputLabelSection = (
  error: string | undefined,
  isRequiredField: boolean | undefined,
  labelKey: string,
  t: TFunction,
  helperTextKey: string | undefined,
): ReactElement => {
  const isHelperText = !!helperTextKey
  const variant = error ? 'MobileBodyBold' : 'MobileBody'
  return (
    <Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap" mb={isHelperText ? 0 : 8}>
        <TextView variant={variant}>
          {t(labelKey)} {isRequiredField ? t('required') : ''}
        </TextView>
      </Box>
      {isHelperText && (
        <TextView mb={8} variant="HelperText">
          {t(helperTextKey)}
        </TextView>
      )}
    </Box>
  )
}

/**
 * Returns the border color of the picker and text input components depending on if there is an error or
 * if the component is focused
 */
export const getInputBorderColor = (error: string | undefined, isFocused: boolean): BorderColorVariant => {
  if (error) {
    return 'error'
  }

  if (isFocused) {
    return 'focusedPickerAndInput'
  }

  return 'pickerAndInput'
}

/**
 * Returns the border width of the picker and text input components
 */
export const getInputBorderWidth = (theme: VATheme, error: string | undefined, isFocused: boolean): number => {
  return isFocused || !!error ? theme.dimensions.focusedInputBorderWidth : theme.dimensions.borderWidth
}

/**
 * Returns the box wrapper props for the picker and text input components
 */
export const getInputWrapperProps = (theme: VATheme, error: string | undefined, isFocused: boolean): BoxProps => {
  return {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isFocused || !!error ? 'textBox' : 'textBoxInactive',
    minHeight: theme.dimensions.touchableMinHeight,
    borderColor: getInputBorderColor(error, isFocused),
    borderWidth: getInputBorderWidth(theme, error, isFocused),
    px: 8,
  }
}

/**
 * Returns an error message for the given error for the picker and text input components
 */
export const renderInputError = (error: string): ReactElement => {
  return (
    <TextView variant="MobileBodyBold" color="error" mb={3}>
      {error}
    </TextView>
  )
}

/**
 * Clears errors on focus for VAModalPicker and VATextInput components
 */
export const removeInputErrorMessage = (
  isFocused: boolean,
  error: string | undefined,
  setError: ((value?: string) => void) | undefined,
  focusUpdated: boolean,
  setFocusUpdated: (value: boolean) => void,
): void => {
  if (isFocused && setError && error) {
    setError('')
  }
  if (focusUpdated) {
    setFocusUpdated(false)
  }
}

/**
 * Creates the testID for the picker and text input components
 *
 * When testID exists: id will start with 'testID t(testIDSuffixKey)'
 * When testID does not exist but labelKey does: id will start with 't(labelKey) t(testIDSuffixKey)'
 * When neither testID or labelKey exists: id will start with the t(testIDSuffixKey) (which is 'picker' or 'text input')
 * When isRequiredField is true: id will contain the word 'required' after the prefix
 * When helperTextKey exists: id will contain the translated helper text
 * When error exists: id will end with the error with the word 'error' at the end of it
 */
export const generateInputTestID = (
  testID: string | undefined,
  labelKey: string | undefined,
  isRequiredField: boolean | undefined,
  helperTextKey: string | undefined,
  error: string | undefined,
  t: TFunction,
  testIDSuffixKey: string,
): string => {
  let resultingTestID = ''

  if (testID) {
    resultingTestID += `${testID} ${t(testIDSuffixKey)}`
  } else if (labelKey) {
    resultingTestID += `${t(labelKey)} ${t(testIDSuffixKey)}`
  } else {
    resultingTestID += t(testIDSuffixKey)
  }

  if (isRequiredField) {
    resultingTestID += ` ${t('required.a11yLabel')}`
  }

  if (helperTextKey) {
    resultingTestID += ` ${t(helperTextKey)}`
  }

  if (error) {
    resultingTestID += ` ${t('error', { error })}`
  }

  return resultingTestID
}

/**
 * Returns the a11y value for the picker and text input components based on if the value
 */
export const generateA11yValue = (value: string | undefined, isFocused: boolean, t: TFunction): string => {
  if (isFocused) {
    if (value) {
      return t('editing', { text: value })
    } else {
      return t('editingNoValue')
    }
  }

  if (value) {
    return t('filled', { value })
  }

  return t('empty')
}
