import { Button, TouchableOpacity } from 'react-native'
import { DateTime } from 'luxon'
import { TextView } from './index'
import { isIOS } from '../utils/platform'
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

// TODO: need to style componen: https://github.com/react-native-datetimepicker/datetimepicker/issues/20#issuecomment-545527682
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

  // each os has specific options for display
  const display = isIOS() ? 'inline' : 'calendar'

  // in iOS, selecting anything with the spinner triggers onChange, so it needs overriding with a button
  const hideIos = (): void => {
    setShow(false)
  }

  return (
    <Box>
      <Box {...wrapperProps}>
        <TouchableOpacity onPress={(): void => setShow(true)}>
          <TextView variant={'MobileBody'} color={textColor}>
            {value}
          </TextView>
        </TouchableOpacity>
      </Box>
      {show && (
        <Box>
          {isIOS() && (
            <Box flex={1} flexDirection={'row'} justifyContent={'flex-end'}>
              <Button title={'Done'} onPress={hideIos} />
            </Box>
          )}
          <RNDateTimePicker
            value={date}
            mode={'date'}
            display={display}
            onChange={(event: Event, selectedDate: Date | undefined): void => {
              setShow(isIOS())
              setValue(selectedDate ? DateTime.fromJSDate(selectedDate).toLocaleString() : defaultString)
              setDate(selectedDate ? selectedDate : new Date())
              onChange(event, selectedDate)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default VADatePicker
