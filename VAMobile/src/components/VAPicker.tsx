import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'

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
  testID = 'default-picker',
}) => {
  const theme = useTheme()
  const t = useTranslation()

  const wrapperProps: BoxProps = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    minHeight: 44,
    borderBottomColor: 'primary',
    borderBottomWidth: 1,
  }

  const pickerProps: PickerSelectProps = {
    style: {
      inputAndroid: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary },
      inputIOS: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary },
      placeholder: { color: theme.colors.text.placeholder },
    },
    value: selectedValue,
    onValueChange: (value: string): void => {
      if (value !== selectedValue) {
        onSelectionChange(value)
      }
    },
    items: pickerOptions,
    onUpArrow: onUpArrow,
    onDownArrow: onDownArrow,
    placeholder: {
      label: placeholderKey ? t(placeholderKey) : t('selectAnItem'),
    },
    disabled,
  }

  const labelProps: TextViewProps = {
    width: 110,
    pl: theme.dimensions.marginBetween,
    color: disabled ? 'placeholder' : 'primary',
  }

  return (
    <Box {...wrapperProps} {...testIdProps(testID)}>
      {labelKey && <TextView {...labelProps}>{t(labelKey)}</TextView>}
      <Box flex={1} pl={theme.dimensions.marginBetween}>
        <RNPickerSelect {...pickerProps} key={selectedValue} />
      </Box>
    </Box>
  )
}

export default VAPicker
