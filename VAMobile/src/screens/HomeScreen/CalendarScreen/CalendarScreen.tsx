import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { DateTime } from 'luxon'
import { HomeStackParamList } from '../HomeStackScreens'
import { RadioGroup, SelectorType, VAScrollView, VASelector } from 'components'
import CustomCalendar, { CustomCalendarProps, DISABLED_WEEKDAYS } from './CustomCalendar'

type CalendarScreenProps = StackScreenProps<HomeStackParamList, 'CustomCalendar'>

/**
 * View for Calendar Spike
 *
 * Returns CalendarScreen component
 */
const CalendarScreen: FC<CalendarScreenProps> = ({}) => {
  const [disabledTypes, setDisabledTypes] = useState<string>('request')
  const [satDisabled, setSatDisabled] = useState(false)

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
      <RadioGroup {...radioOptions} />
      <VASelector {...satDisabledCheckboxProps} />
      <CustomCalendar key={isRequestCalendar ? '1' : '2'} {...calendarsProps} />
    </VAScrollView>
  )
}

export default CalendarScreen
