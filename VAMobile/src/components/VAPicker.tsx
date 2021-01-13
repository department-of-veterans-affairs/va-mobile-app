import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC, ReactNode } from 'react'

import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'
import VAIcon from './VAIcon'

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
  /** optional boolean that makes the picker have a full border and arrow icon */
  isDatePicker?: boolean
  /** optional ref value */
  pickerRef?: React.Ref<RNPickerSelect>
  /** optional callback when the 'Done' button is pressed */
  onDonePress?: () => void
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
  isDatePicker,
  pickerRef,
  testID = 'default-picker',
  onDonePress,
}) => {
  const theme = useTheme()
  const t = useTranslation()

  const wrapperProps: BoxProps = {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    minHeight: theme.dimensions.touchableMinHeight,
    borderBottomColor: 'primary',
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: isDatePicker ? 'primary' : undefined,
    borderWidth: isDatePicker ? theme.dimensions.borderWidth : undefined,
    flexWrap: 'wrap',
  }

  const fontSize = theme.fontSizes.MobileBody.fontSize
  const fontFamily = theme.fontFace.regular

  const pickerProps: PickerSelectProps = {
    style: {
      inputAndroid: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily },
      inputIOS: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily },
      placeholder: { color: theme.colors.text.placeholder },
      chevronUp: !onUpArrow ? { opacity: 0 } : {},
      chevronDown: !onDownArrow ? { opacity: 0 } : !onUpArrow ? { right: 0, position: 'absolute' } : {},
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
    onDonePress: onDonePress,
    placeholder: placeholderKey ? { label: t(placeholderKey) } : {},
    disabled,
    useNativeAndroidPickerStyle: false,
    Icon: isDatePicker
      ? (): ReactNode => {
          return (
            <Box pr={theme.dimensions.datePickerArrowsPaddingRight} pt={isIOS() ? theme.dimensions.textIconMargin : theme.dimensions.datePickerArrowsPaddingTopAndroid}>
              <VAIcon name="DatePickerArrows" fill="dark" />
            </Box>
          )
        }
      : undefined,
  }

  const labelProps: TextViewProps = {
    minWidth: theme.dimensions.inputAndPickerLabelWidth,
    mr: theme.dimensions.gutter,
    pl: theme.dimensions.marginBetween,
    color: disabled ? 'placeholder' : 'primary',
  }

  return (
    <Box {...wrapperProps} {...testIdProps(testID)}>
      {labelKey && <TextView {...labelProps}>{t(labelKey)}</TextView>}
      <Box pl={theme.dimensions.marginBetween}>
        <RNPickerSelect {...pickerProps} ref={pickerRef} />
      </Box>
    </Box>
  )
}

export default VAPicker
