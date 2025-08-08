import React, { FC, useState } from 'react'
import { Pressable } from 'react-native'

import { Box, TextView } from 'components'
import RNDatePicker, { DateChangeEvent } from 'components/DatePicker/RNDatePicker'
import { getFormattedDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

export type DatePickerFieldProps = {
  /** Label text for the date picker field */
  label: string
  /** Selected date value */
  date: string
  /** Callback called when a new date is selected */
  onDateChange: (e: DateChangeEvent) => void
}
const DatePickerField: FC<DatePickerFieldProps> = ({ label, date, onDateChange }) => {
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
          <TextView color={'link'}>{getFormattedDate(date, 'MMMM dd, yyyy')}</TextView>
        </Pressable>
      </Box>
      {showCal ? (
        <Box flex={1}>
          <RNDatePicker style={datePickerStyle} date={date} onDateChange={onDateChange} />
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default DatePickerField
