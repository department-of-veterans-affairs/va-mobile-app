import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC } from 'react'

import { testIdProps } from '../utils/accessibility'
import { useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import theme from 'styles/themes/standardTheme'

/**
 * Signifies type of each item in list of {@link pickerOptions}
 */
export type pickerItem = {
  /** label is the text displayed to the user for the item */
  label: string
  /** value is the unique value of the item, used to update and keep track of the current label displayed */
  value: string
}

/**
 * Signifies props for the {@link DefaultPicker}
 */
export type DefaultPickerProps = {
  /** Currently selected item from list of options */
  selectedValue: string
  /** Called when the selected value is changed */
  onSelectionChange: (selectValue: string) => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<pickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional function run on click of up arrow in ios - should change the focus from the current input field to the one above it */
  onUpArrow?: () => void
  /** optional function run on click of down arrow in ios - should change the focus from the current input field to the one below it */
  onDownArrow?: () => void
  /** optional testID for the overall component */
  testID?: string
}

const DefaultPicker: FC<DefaultPickerProps> = ({ selectedValue, onSelectionChange, pickerOptions, labelKey, onUpArrow, onDownArrow, testID = 'default-picker' }) => {
  const t = useTranslation()
  const wrapperProps: BoxProps = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    minHeight: 44,
  }

  const pickerProps: PickerSelectProps = {
    style: { inputAndroid: { color: theme.colors.text.secondary } },
    value: selectedValue,
    onValueChange: (value: string): void => onSelectionChange(value),
    items: pickerOptions,
    onUpArrow: onUpArrow,
    onDownArrow: onDownArrow,
  }

  return (
    <Box {...wrapperProps} {...testIdProps(testID)}>
      {labelKey && (
        <TextView width={110} pl={19}>
          {t(labelKey)}
        </TextView>
      )}
      <Box flex={1} pl={19}>
        <RNPickerSelect {...pickerProps} />
      </Box>
    </Box>
  )
}

export default DefaultPicker
