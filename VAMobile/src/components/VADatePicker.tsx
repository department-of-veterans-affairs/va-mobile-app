import { DateTime } from 'luxon'
import { TextView } from './index'
import { TouchableOpacity } from 'react-native'
import Box, { BoxProps } from './Box'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import React, { FC, useState } from 'react'
import theme from '../styles/themes/standardTheme'

/**
 * Props type for the VADatePicker
 */
export type VADatePickerProps = {
  /** What should the picker show if no value is selected? */
  defaultString: string
  /** function to run on date selected */
  onChange: (event: Event, selectedDate: Date | undefined) => void
}

// TODO: need to style component:
// TODO: tests
/**
 * Common component for selecting a date. (This can be updated to a date/time picker later if we need it)
 * @param defaultString - string that represents what the component should display if there is no value selected
 * @param onChange - function to run in the parent when selection changes
 */
const VADatePicker: FC<VADatePickerProps> = ({ defaultString, onChange }) => {
  // value is the display value in the text area. Is human readable
  const [value, setValue] = useState(defaultString)
  // boolean to show or hide the picker
  const [show, setShow] = useState(false)
  // date value that is used by the picker
  const [date, setDate] = useState(new Date())

  // this helps simulate the UI of a VATextInput
  const textColor = value === defaultString ? 'placeholder' : 'primary'

  // TODO: this is reused from VATexInput, should be globalized
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
      <TouchableOpacity onPress={(): void => setShow(true)}>
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
