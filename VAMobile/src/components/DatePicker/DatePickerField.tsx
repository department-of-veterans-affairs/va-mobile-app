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
  return date.toISO() || ''
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
  onDateChange,
  onPress,
}) => {
  const theme = useTheme()

  const datePickerStyle = {
    height: 340,
  }

  const dateLabelStyle = {
    backgroundColor: theme.colors.background.main,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.background.main,
  }

  return (
    <>
      <Box
        p={theme.dimensions.smallMarginBetween}
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <TextView>{label}</TextView>
        <Pressable style={dateLabelStyle} accessibilityRole="button" onPress={onPress}>
          <TextView
            color={isInvalid ? 'error' : 'link'}
            textDecoration={isInvalid ? 'line-through' : 'none'}
            textDecorationColor={'error'}>
            {date.toFormat('MMMM dd, yyyy')}
          </TextView>
        </Pressable>
      </Box>
      {open ? (
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
