import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { BackgroundVariant, BorderColorVariant, Box, BoxProps, TextView, TextViewProps } from 'components'
import DatePickerField from 'components/DatePicker/DatePickerField'
import { DateChangeEvent } from 'components/DatePicker/RNDatePicker'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

export type DatePickerRange = {
  startDate: DateTime
  endDate: DateTime
}

export type DatePickerProps = {
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** Initial date range set on the date picker  */
  initialDateRange: DatePickerRange
  /** Optional DateTime object that represents the minimum selectable date on each date picker */
  minimumDate?: DateTime
  /** Optional DateTime object that represents the maximum selectable date on each date picker */
  maximumDate?: DateTime
  /** Callback when the apply button is pressed */
  onApply: (selectedDateRange: DatePickerRange, isValid: boolean) => void
  /** Callback when the reset button is pressed */
  onReset: () => void
}

const renderDatePickerLabelSection = (labelKey: string, t: TFunction, onReset: () => void): ReactElement => {
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

const DatePicker: FC<DatePickerProps> = ({
  labelKey,
  initialDateRange,
  minimumDate,
  maximumDate,
  onApply,
  onReset,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [selectedDateRange, setSelectedDateRange] = useState<DatePickerRange>({
    startDate: initialDateRange.startDate.startOf('day'),
    endDate: initialDateRange.endDate.endOf('day'),
  })
  const [fromFieldOpen, setFromFieldOpen] = useState(false)
  const [toFieldOpen, setToFieldOpen] = useState(false)
  const [toFieldInvalid, setToFieldInvalid] = useState(false)

  const validateDateRange = (dateRange: DatePickerRange) => {
    if (dateRange.startDate > dateRange.endDate) {
      setToFieldInvalid(true)
      logAnalyticsEvent(Events.vama_appt_invalid_range)
    } else {
      setToFieldInvalid(false)
    }
  }

  useEffect(() => {
    setSelectedDateRange(initialDateRange)
    validateDateRange(initialDateRange)
    setFromFieldOpen(false)
    setToFieldOpen(false)
  }, [initialDateRange])

  const handleDateChange = (e: DateChangeEvent, fieldName: string) => {
    const { date } = e.nativeEvent
    const newDate =
      fieldName === 'startDate'
        ? DateTime.fromISO(date).toLocal().startOf('day')
        : DateTime.fromISO(date).toLocal().endOf('day')

    const newDateRange = {
      ...selectedDateRange,
      [fieldName]: newDate,
    }

    setSelectedDateRange(newDateRange)
    validateDateRange(newDateRange)
  }

  const handleApply = () => {
    onApply(selectedDateRange, !toFieldInvalid)
    setFromFieldOpen(false)
    setToFieldOpen(false)
  }

  const handleReset = () => {
    onReset()
    setFromFieldOpen(false)
    setToFieldOpen(false)
    setToFieldInvalid(false)
  }

  const datePickerContainerProps: BoxProps = {
    backgroundColor: theme.mode === 'light' ? 'list' : ('#2c2c2e' as BackgroundVariant),
    px: theme.dimensions.smallMarginBetween,
    borderColor: 'primary',
    borderStyle: 'solid',
    borderRadius: 6,
  }

  return (
    <Box mx={theme.dimensions.gutter}>
      {labelKey && renderDatePickerLabelSection(labelKey, t, handleReset)}
      <Box {...datePickerContainerProps}>
        <DatePickerField
          open={fromFieldOpen}
          label={t('datePicker.from')}
          date={selectedDateRange.startDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={(e) => handleDateChange(e, 'startDate')}
          onPress={() => {
            setFromFieldOpen((prevFieldOpen) => !prevFieldOpen)
            setToFieldOpen(false)
          }}
          testID="datePickerFromFieldTestId"
        />
        <Box
          my={theme.dimensions.smallMarginBetween}
          borderBottomWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.aboutYou as BorderColorVariant}
        />
        <DatePickerField
          open={toFieldOpen}
          isInvalid={toFieldInvalid}
          label={t('datePicker.to')}
          a11yErrorLabel={t('datePicker.to.invalid')}
          date={selectedDateRange.endDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onDateChange={(e) => handleDateChange(e, 'endDate')}
          onPress={() => {
            setToFieldOpen((prevFieldOpen) => !prevFieldOpen)
            setFromFieldOpen(false)
          }}
          testID="datePickerToFieldTestId"
        />
      </Box>
      <Box pt={theme.dimensions.standardMarginBetween}>
        <Button onPress={handleApply} label={t('apply')} buttonType={ButtonVariants.Primary} />
      </Box>
    </Box>
  )
}

export default DatePicker
