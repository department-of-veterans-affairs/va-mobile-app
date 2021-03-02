import React, { ReactElement } from 'react'

import { TFunction } from 'i18next'

import { BorderColorVariant, Box, BoxProps, TextView, TextViewProps } from '../../index'
import { VATheme } from '../../../styles/theme'

/**
 * Creates the label for the picker and text input components
 */
const generateInputLabel = (error: string | undefined, disabled: boolean | undefined, isRequiredField: boolean | undefined, labelKey: string, t: TFunction): ReactElement => {
  const variant = error ? 'MobileBodyBold' : 'MobileBody'

  const labelProps: TextViewProps = {
    color: disabled ? 'placeholder' : 'primary',
    variant,
  }

  const label = <TextView {...labelProps}>{t(labelKey)}</TextView>

  if (isRequiredField) {
    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {label}
        <TextView>&nbsp;</TextView>
        <TextView color="error" variant={variant}>
          {t('common:required')}
        </TextView>
      </Box>
    )
  }

  return label
}

/**
 * Renders the label section consisting of the label, potential required text, and potential helper text
 * for the picker and text input components
 */
export const renderInputLabelSection = (
  error: string | undefined,
  disabled: boolean | undefined,
  isRequiredField: boolean | undefined,
  labelKey: string,
  t: TFunction,
  helperTextKey: string | undefined,
  theme: VATheme,
): ReactElement => {
  return (
    <Box mb={theme.dimensions.pickerLabelMargin}>
      {generateInputLabel(error, disabled, isRequiredField, labelKey, t)}
      {!!helperTextKey && <TextView variant="TableFooterLabel">{t(helperTextKey)}</TextView>}
    </Box>
  )
}

/**
 * Returns the border color of the picker and text input components depending on if there is an error or
 * if the component is focused
 */
const getInputBorderColor = (error: string | undefined, isFocused: boolean): BorderColorVariant => {
  if (error) {
    return 'error'
  }

  if (isFocused) {
    return 'focusedPickerAndInput'
  }

  return 'pickerAndInput'
}

/**
 * Returns the box wrapper props for the picker and text input components
 */
export const getInputWrapperProps = (theme: VATheme, error: string | undefined, isFocused: boolean): BoxProps => {
  return {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    minHeight: theme.dimensions.touchableMinHeight,
    borderColor: getInputBorderColor(error, isFocused),
    borderWidth: isFocused || !!error ? theme.dimensions.focusedInputBorderWidth : theme.dimensions.borderWidth,
  }
}

/**
 * Returns an error message for the given error for the picker and text input components
 */
export const renderInputError = (theme: VATheme, error: string): ReactElement => {
  return (
    <TextView variant="MobileBodyBold" color="error" mt={theme.dimensions.pickerLabelMargin}>
      {error}
    </TextView>
  )
}

/**
 * Updates the error message for the picker and text input components. Sets an error message if the component
 * no longer has focus, the focus was updated, and the components value is undefined
 */
export const updateInputErrorMessage = (
  isFocused: boolean,
  isRequiredField: boolean | undefined,
  setError: ((value: string) => void) | undefined,
  value: string | undefined,
  focusUpdated: boolean,
  labelKey: string | undefined,
  setFocusUpdated: (value: boolean) => void,
  t: TFunction,
): void => {
  // first check if its not currently focused, if its a required field, and if there is a setError function
  if (!isFocused && isRequiredField && setError) {
    // if the selected value does not exist, keep checking. if it does exist, error should be updated to an empty string
    if (!value) {
      // update the error if the focus was just updated, and then set focusUpdated to false - this will cause the useEffect
      // to rerun, but it won't remove the error or reset it
      if (focusUpdated) {
        setError(t('isRequired', { label: t(labelKey || 'field') }))
        setFocusUpdated(false)
      }
    } else {
      setError('')
    }
  }
}

/**
 * Creates the testID for the picker and text input components
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
    resultingTestID += ` ${t('common:required.a11yLabel')}`
  }

  if (helperTextKey) {
    resultingTestID += ` ${t(helperTextKey)}`
  }

  if (error) {
    resultingTestID += ` ${error} ${t('common:error')}`
  }

  return resultingTestID
}
