import React, { FC } from 'react'
import { Pressable } from 'react-native'

import { DateTime } from 'luxon'

import { Box, TextView } from 'components'
import RNDatePicker, { DateChangeEvent } from 'components/DatePicker/RNDatePicker'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

const getNativePickerDate = (date: DateTime) => {
  // iOS fails to parse date with fractional seconds
  if (isIOS()) return date.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")
  return date.toFormat('yyyy-MM-dd')
}

export type DatePickerFieldProps = {
  /** Boolean to open or close the date picker's calendar view  */
  open: boolean
  /** Label text for the date picker field */
  label: string
  /** Selected date value */
  date: DateTime
  /** Optional DateTime object that represents the minimum selectable date on the date picker */
  minimumDate?: DateTime
  /** Optional DateTime object that represents the maximum selectable date on the date picker */
  maximumDate?: DateTime
  /** Boolean to display selected date as invalid */
  isInvalid?: boolean
  /** Additional message to be read by screen reader when the date field is invalid */
  a11yErrorLabel?: string
  /** Test ID for the Date Picker Field */
  testID?: string
  /** Callback called when a new date is selected */
  onDateChange?: (e: DateChangeEvent) => void
  /** Callback called when the field is pressed */
  onPress: () => void
}
const DatePickerField: FC<DatePickerFieldProps> = ({
  open,
  label,
  date,
  minimumDate,
  maximumDate,
  isInvalid,
  a11yErrorLabel,
  testID,
  onDateChange,
  onPress,
}) => {
  const theme = useTheme()

  const datePickerStyle = {
    height: isIOS() ? 340 : 500,
  }

  const dateLabelStyle = {
    backgroundColor: '#7878801F',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 6,
  }

  const formattedDateText = date.toFormat('MMMM dd, yyyy')
  const accessibilityLabel =
    isInvalid && a11yErrorLabel ? `${label} ${formattedDateText} ${a11yErrorLabel}` : `${label} ${formattedDateText}`

  return (
    <Box>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} testID={testID}>
        <Box
          p={theme.dimensions.smallMarginBetween}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <TextView>{label}</TextView>
          <Box style={dateLabelStyle}>
            <TextView
              color={isInvalid ? 'error' : 'link'}
              textDecoration={isInvalid ? 'line-through' : 'none'}
              textDecorationColor={'error'}>
              {formattedDateText}
            </TextView>
          </Box>
        </Box>
      </Pressable>
      {open ? (
        <Box py={theme.dimensions.smallMarginBetween}>
          <RNDatePicker
            style={datePickerStyle}
            date={getNativePickerDate(date)}
            minimumDate={minimumDate ? getNativePickerDate(minimumDate) : undefined}
            maximumDate={maximumDate ? getNativePickerDate(maximumDate) : undefined}
            onDateChange={onDateChange}
            testID={`${testID}-nativeCalendar`}
          />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default DatePickerField
