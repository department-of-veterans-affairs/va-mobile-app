import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { Box, RadioGroup, SelectorType, TextView, VAScrollView, VASelector } from 'components'
import { DateTime } from 'luxon'
import { HomeStackParamList } from '../HomeStackScreens'
import CustomCalendar, { CustomCalendarProps, DISABLED_WEEKDAYS } from './CustomCalendar'

type CalendarScreenProps = StackScreenProps<HomeStackParamList, 'CustomCalendar'>

import { PixelRatio, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * View for Calendar Spike
 *
 * Returns CalendarScreen component
 */
const CalendarScreen: FC<CalendarScreenProps> = ({}) => {
  const [disabledTypes, setDisabledTypes] = useState<string>('request')
  const [satDisabled, setSatDisabled] = useState(false)

  // figuring out scaling
  const { width, height, fontScale } = useWindowDimensions()
  const safeAreaRightMargin = useSafeAreaInsets().right
  const safeAreaLeftMargin = useSafeAreaInsets().left

  // Requested Appointment
  const requestAppointmentCalendar: CustomCalendarProps = {
    earliestDay: 5,
    latestDay: 120,
  }

  // Direct Appointment
  const directAppointmentCalendar: CustomCalendarProps = {
    earliestDay: 1,
    latestDay: 395,
    initialDate: DateTime.now().plus({ month: 1 }),
  }

  // radio options
  const radioOptions = {
    options: [
      {
        labelKey: 'Request(5 days earliest, 120 days latest)',
        value: 'request',
      },
      {
        labelKey: 'Direct(1 day earliest, 395 days latest, Preferred Date is 1 month ahead)',
        value: 'direct',
      },
    ],
    value: disabledTypes,
    onChange: setDisabledTypes,
  }

  const satDisabledCheckboxProps = {
    selectorType: SelectorType.Checkbox,
    selected: satDisabled,
    onSelectionChange: () => {
      setSatDisabled(!satDisabled)
    },
    labelKey: 'Disable Saturday',
  }
  const isRequestCalendar = disabledTypes === 'request'

  let calendarsProps = {
    disableWeekdays: satDisabled ? DISABLED_WEEKDAYS.SATURDAY : undefined,
  } as CustomCalendarProps
  if (isRequestCalendar) {
    calendarsProps = { ...calendarsProps, ...requestAppointmentCalendar }
  } else {
    calendarsProps = { ...directAppointmentCalendar }
  }
  return (
    <VAScrollView>
      {/*<RadioGroup {...radioOptions} />*/}
      {/*<VASelector {...satDisabledCheckboxProps} />*/}
      {/*<Box>*/}
      {/*  <TextView>{`safeAreaRightMargin: ${safeAreaRightMargin}`}</TextView>*/}
      {/*  <TextView>{`safeAreaLeftMargin: ${safeAreaLeftMargin}`}</TextView>*/}
      {/*  <TextView>{`width: ${width}`}</TextView>*/}
      {/*  <TextView>{`height: ${height}`}</TextView>*/}
      {/*  <TextView>{`PixelRatio/Fontscale: ${PixelRatio.getFontScale()}`}</TextView>*/}
      <TextView>{`Fontscale: ${fontScale}`}</TextView>
      {/*</Box>*/}
      <CustomCalendar key={isRequestCalendar ? '1' : '2'} {...calendarsProps} />
    </VAScrollView>
  )
}

export default CalendarScreen
