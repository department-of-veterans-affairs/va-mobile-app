import { DateTime } from 'luxon'
import { TextView } from './index'
import { TouchableOpacity } from 'react-native'
import Box, { BoxProps } from './Box'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { FC, useState } from 'react'
import theme from '../styles/themes/standardTheme'

export type VADatePickerProps = {
  /** What should the picker show if no value is selected? */
  defaultString: string
  /** function to run on date selected */
  onChange: (event: Event, selectedDate: Date | undefined) => void
}
const VADatePicker: FC<VADatePickerProps> = ({ defaultString, onChange }) => {
  const [value, setValue] = useState(defaultString)
  const [show, setShow] = useState(false)
  const [date, setDate] = useState(new Date())

  const textColor = value === defaultString ? 'placeholder' : 'primary'

  const wrapperProps: BoxProps = {
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    px: theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
  }
  return (
    <Box {...wrapperProps}>
      <TouchableOpacity onPress={() => setShow(true)}>
        <TextView variant={'MobileBody'} color={textColor}>
          {value}
        </TextView>
      </TouchableOpacity>
      {show && (
        <RNDateTimePicker
          value={date}
          mode={'date'}
          display={'calendar'}
          onChange={(event: Event, selectedDate: Date | undefined): void => {
            setShow(false)
            setValue(selectedDate ? DateTime.fromJSDate(selectedDate).toLocaleString() : defaultString)
            setDate(selectedDate ? selectedDate : new Date())
            onChange(event, selectedDate)
          }}
        />
      )}
    </Box>
  )
}

export default VADatePicker
