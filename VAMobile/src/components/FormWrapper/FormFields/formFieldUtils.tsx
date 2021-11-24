import React, { ReactElement } from 'react'

import { TFunction } from 'i18next'

import { BorderColorVariant, Box, BoxProps, ColorVariant, TextView, TextViewProps, ValidationFunctionItems } from '../../index'
import { VATheme } from '../../../styles/theme'

/**
 * Creates the label for the picker and text input components
 */
const generateInputLabel = (error: string | undefined, disabled: boolean | undefined, isRequiredField: boolean | undefined, labelKey: string, t: TFunction): ReactElement => {
  const variant = error ? 'MobileBodyBold' : 'MobileBody'
  const color: ColorVariant = disabled ? 'placeholder' : 'primaryTitle'

  const labelProps: TextViewProps = {
    color,
    variant,
  }

  const label = <TextView {...labelProps}>{t(labelKey)}</TextView>

  if (isRequiredField) {
    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap">
        {label}
        <TextView>&nbsp;</TextView>
        <TextView color={'inputRequired'} variant={variant}>
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
    <Box>
      {generateInputLabel(error, disabled, isRequiredField, labelKey, t)}
      {!!helperTextKey && (
        <TextView mb={theme.dimensions.pickerLabelMargin} variant="HelperText">
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
    <TextView variant="MobileBodyBold" color="error" mb={theme.dimensions.errorLabelBottomMargin}>
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
  error: string | undefined,
  setError: ((value?: string) => void) | undefined,
  value: string | undefined,
  focusUpdated: boolean,
  setFocusUpdated: (value: boolean) => void,
  validationList: Array<ValidationFunctionItems> | undefined,
): void => {
  // only continue check if the focus was just updated
  if (focusUpdated) {
    setFocusUpdated(false)
    // first check if its not currently focused, if its a required field, and if there is a setError function
    if (!isFocused && isRequiredField && setError) {
      // if the selected value does not exist, set the error
      if (!value) {
        setError()
      } else if (validationList) {
        const result = validationList.filter((el) => {
          return el.validationFunction()
        })

        // if one of the validation functions failed show the first error message
        if (result.length > 0) {
          setError(result[0].validationFunctionErrorMessage)
        } else if (error !== '') {
          setError('')
        }
      } else if (error !== '') {
        setError('')
      }
    }
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
    resultingTestID += ` ${t('common:required.a11yLabel')}`
  }

  if (helperTextKey) {
    resultingTestID += ` ${t(helperTextKey)}`
  }

  if (error) {
    resultingTestID += ` ${t('common:error', { error })}`
  }

  return resultingTestID
}

/**
 * Returns the a11y value for the picker and text input components based on if the value
 */
export const generateA11yValue = (value: string | undefined, isFocused: boolean, t: TFunction): string => {
  if (isFocused) {
    if (value) {
      return t('common:editing', { text: value })
    } else {
      return t('common:editingNoValue')
    }
  }

  if (value) {
    return t('common:filled', { value })
  }

  return t('common:empty')
}
