import React, { FC, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { BorderColorVariant, Box, TextView, TextViewProps } from 'components'
import DatePickerField from 'components/DatePicker/DatePickerField'
import { DateChangeEvent } from 'components/DatePicker/RNDatePicker'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type DatePickerRange = {
  startDate: DateTime
  endDate: DateTime
}

export type DatePickerProps = {
  /** i18n key for the text label next the picker field */
  labelKey?: string
  initialDateRange?: DatePickerRange
  /** Optional DateTime object that represents the minimum selectable date on each date picker */
  minimumDate?: DateTime
  /** Optional DateTime object that represents the maximum selectable date on each date picker */
  maximumDate?: DateTime
  onApply: (dateRange: DatePickerRange) => void
}

export const renderInputLabelSection = (labelKey: string, t: TFunction, onReset: () => void): ReactElement => {
  const variant = 'MobileBody'
  const resetButtonTextProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }
  return (
    <Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" mb={8}>
        <TextView variant={variant}>{t(labelKey)}</TextView>
        <Pressable accessibilityRole="button" onPress={onReset}>
          <TextView {...resetButtonTextProps}>{t('reset')}</TextView>
        </Pressable>
      </Box>
    </Box>
  )
}

const initialDate = DateTime.local()

const DatePicker: FC<DatePickerProps> = ({ labelKey, initialDateRange, minimumDate, maximumDate, onApply }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [dateRange, setDateRange] = useState<DatePickerRange>(
    initialDateRange
      ? initialDateRange
      : {
          startDate: initialDate.minus({ months: 3 }),
          endDate: initialDate,
        },
  )

  const handleReset = () => {
    const currentDate = DateTime.local()
    setDateRange({
      startDate: currentDate.minus({ months: 3 }),
      endDate: currentDate,
    })
  }

  const handleDateChange = (e: DateChangeEvent, fieldName: string) => {
    const { date } = e.nativeEvent
    setDateRange((prevDateRange) => ({ ...prevDateRange, [fieldName]: DateTime.fromISO(date).toLocal() }))
  }

  const handleApply = () => {
    // TODO: Error Handling
    onApply(dateRange)
  }

  return (
    <Box mx={theme.dimensions.gutter}>
      {labelKey ? renderInputLabelSection(labelKey, t, handleReset) : <></>}
      <Box
        px={theme.dimensions.smallMarginBetween}
        borderRadius={6}
        backgroundColor={'list'}
        borderStyle="solid"
        borderColor="primary">
        <DatePickerField
          label="From"
          date={dateRange.startDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={(e) => handleDateChange(e, 'startDate')}
        />
        <Box
          my={theme.dimensions.smallMarginBetween}
          borderBottomWidth={1}
          borderColor={theme.colors.border.aboutYou as BorderColorVariant}
        />
        <DatePickerField
          label="To"
          date={dateRange.endDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={(e) => handleDateChange(e, 'endDate')}
        />
      </Box>
      <Box pt={theme.dimensions.standardMarginBetween}>
        <Button onPress={handleApply} label={t('apply')} buttonType={ButtonVariants.Primary} />
      </Box>
    </Box>
  )
}

export default DatePicker
