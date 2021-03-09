import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { Box, VAIcon, ValidationFunctionItems } from '../../index'
import { generateA11yValue, generateInputTestID, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from './formFieldUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'

/**
 * Signifies type of each item in list of {@link pickerOptions}
 */
export type PickerItem = {
  /** label is the text displayed to the user for the item */
  label: string
  /** value is the unique value of the item, used to update and keep track of the current label displayed */
  value: string
}

/**
 * Signifies props for the {@link VAPicker}
 */
export type VAPickerProps = {
  /** Currently selected item from list of options */
  selectedValue: string
  /** Called when the selected value is changed */
  onSelectionChange: (selectValue: string) => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<PickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional function run on click of up arrow in ios - should change the focus from the current input field to the one above it */
  onUpArrow?: () => void
  /** optional function run on click of down arrow in ios - should change the focus from the current input field to the one below it */
  onDownArrow?: () => void
  /** optional i18n ID for the placeholder */
  placeholderKey?: string
  /** optional boolean that disables the picker when set to true */
  disabled?: boolean
  /** optional testID for the overall component */
  testID?: string
  /** optional ref value */
  pickerRef?: React.Ref<RNPickerSelect>
  /** optional callback when the 'Done' button is pressed. IOS Only */
  onDonePress?: () => void
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error?: string) => void
  /** if this exists updated picker styles to error state */
  error?: string
  /** optional list of validation functions to check against */
  validationList?: Array<ValidationFunctionItems>
}

const VAPicker: FC<VAPickerProps> = ({
  selectedValue,
  onSelectionChange,
  pickerOptions,
  labelKey,
  onUpArrow,
  onDownArrow,
  placeholderKey,
  disabled,
  pickerRef,
  testID,
  onDonePress,
  isRequiredField,
  helperTextKey,
  setError,
  error,
  validationList,
}) => {
  const theme = useTheme()
  const t = useTranslation()
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    updateInputErrorMessage(isFocused, isRequiredField, error, setError, selectedValue, focusUpdated, setFocusUpdated, validationList)
  }, [isFocused, labelKey, selectedValue, error, setError, isRequiredField, t, focusUpdated, validationList])

  const onClose = (): void => {
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const fontSize = theme.fontSizes.MobileBody.fontSize
  const fontFamily = theme.fontFace.regular

  const pickerProps: PickerSelectProps = {
    style: {
      inputAndroid: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily },
      inputIOS: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily, marginLeft: theme.dimensions.condensedMarginBetween },
      placeholder: { color: theme.colors.text.placeholder },
      chevronUp: !onUpArrow ? { opacity: 0 } : {},
      chevronDown: !onDownArrow ? { opacity: 0 } : !onUpArrow ? { right: 0, position: 'absolute' } : {},
      iconContainer: { height: '100%', justifyContent: 'center', paddingRight: theme.dimensions.datePickerArrowsPaddingRight },
    },
    value: selectedValue,
    onValueChange: (value: string): void => {
      if (value !== selectedValue) {
        onSelectionChange(value)
      }
    },
    items: pickerOptions,
    onUpArrow,
    onDownArrow,
    onDonePress,
    onOpen: () => setIsFocused(true),
    onClose,
    placeholder: placeholderKey ? { label: t(placeholderKey) } : {},
    disabled,
    Icon: (): ReactNode => {
      return <VAIcon name="DatePickerArrows" fill="grayDark" />
    },
  }

  const currentlySelectedLabel = pickerOptions.find((el) => el.value === selectedValue)
  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:picker')

  return (
    <Box
      {...testIdProps(resultingTestID)}
      accessibilityValue={{ text: generateA11yValue(currentlySelectedLabel?.label, placeholderKey, t) }}
      accessibilityRole="spinbutton"
      accessible={true}>
      {labelKey && renderInputLabelSection(error, disabled, isRequiredField, labelKey, t, helperTextKey, theme)}
      <Box {...getInputWrapperProps(theme, error, isFocused)}>
        <Box width="100%">
          <RNPickerSelect {...pickerProps} ref={pickerRef} />
        </Box>
      </Box>
      {!!error && renderInputError(theme, error)}
    </Box>
  )
}

export default VAPicker
