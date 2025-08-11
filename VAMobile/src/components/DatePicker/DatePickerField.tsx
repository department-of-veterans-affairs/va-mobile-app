import React, { FC, useState } from 'react'
import { Pressable } from 'react-native'

import { DateTime } from 'luxon'

import { Box, TextView } from 'components'
import RNDatePicker, { DateChangeEvent } from 'components/DatePicker/RNDatePicker'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'

const getNativePickerDate = (date: DateTime) => {
  // iOS fails to parse date with fractional seconds
  if (isIOS()) return date.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")
  return date.toISO() || ''
}

export type DatePickerFieldProps = {
  /** Label text for the date picker field */
  label: string
  /** Selected date value */
  date: DateTime
  /** Optional DateTime object that represents the minimum selectable date on the date picker */
  minimumDate?: DateTime
  /** Optional DateTime object that represents the maximum selectable date on the date picker */
  maximumDate?: DateTime
  /** Callback called when a new date is selected */
  onDateChange?: (e: DateChangeEvent) => void
}
const DatePickerField: FC<DatePickerFieldProps> = ({ label, date, minimumDate, maximumDate, onDateChange }) => {
  const [showCal, setShowCal] = useState(false)
  const theme = useTheme()

  const datePickerStyle = {
    height: 350,
  }

  return (
    <>
      <Box py={theme.dimensions.standardMarginBetween} flex={1} flexDirection="row" justifyContent="space-between">
        <TextView>{label}</TextView>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setShowCal((prevShowCal) => !prevShowCal)
          }}>
          <TextView color={'link'}>{date.toFormat('MMMM dd, yyyy')}</TextView>
        </Pressable>
      </Box>
      {showCal ? (
        <Box flex={1}>
          <RNDatePicker
            style={datePickerStyle}
            date={getNativePickerDate(date)}
            minimumDate={minimumDate ? getNativePickerDate(minimumDate) : undefined}
            maximumDate={maximumDate ? getNativePickerDate(maximumDate) : undefined}
            onDateChange={onDateChange}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default DatePickerField
