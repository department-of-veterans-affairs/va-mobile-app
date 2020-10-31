import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC } from 'react'

import { useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import theme from 'styles/themes/standardTheme'

type pickerItem = {
  label: string
  value: string
}

export type DefaultPickerProps = {
  selectedValue: string
  onSelectionChange: (selectValue: string) => void
  labelKey: string
  pickerOptions: Array<pickerItem>
}

const DefaultPicker: FC<DefaultPickerProps> = ({ selectedValue, onSelectionChange, labelKey, pickerOptions }) => {
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
  }

  return (
    <Box {...wrapperProps}>
      <TextView width={110} pr={10} pl={16}>
        {t(labelKey)}
      </TextView>
      <Box flex={1}>
        <RNPickerSelect {...pickerProps} />
      </Box>
    </Box>
  )
}

export default DefaultPicker
