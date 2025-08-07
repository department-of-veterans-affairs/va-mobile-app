import React, { FC, useState } from 'react'
import { Pressable } from 'react-native'

import { DateTime } from 'luxon'

import { Box, TextView } from 'components'
import RNDatePicker from 'components/DatePicker/RNDatePicker'
import { getFormattedDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

export type DatePickerFieldProps = {
  /** label */
  label: string
  /** selected date value */
  date: DateTime
}
const DatePickerField: FC<DatePickerFieldProps> = ({ label, date }) => {
  const [showCal, setShowCal] = useState(false)
  const theme = useTheme()

  const datePickerStyle = {
    height: 330,
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
          <TextView color={'link'}>{getFormattedDate(date.toISO(), 'MMMM dd, yyyy')}</TextView>
        </Pressable>
      </Box>
      {showCal ? (
        <Box flex={1}>
          <RNDatePicker style={datePickerStyle} />
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}

export default DatePickerField
