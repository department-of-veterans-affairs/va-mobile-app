import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import _ from 'underscore'

import { AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextLine, TextView, VAPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentLocation, getGroupedAppointments, getYearsToSortedMonths } from '../UpcomingAppointments/UpcomingAppointments'
import { getAppointmentsInDateRange } from 'store/actions'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type PastAppointmentsProps = {}

const PastAppointments: FC<PastAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { appointmentsByYear } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const getMMMyyyy = (date: Date): string => {
    return getFormattedDate(date.toISOString(), 'MMM yyyy')
  }

  const getDateRange = (startDate: Date, endDate: Date): string => {
    return `${getMMMyyyy(startDate)} - ${getMMMyyyy(endDate)}`
  }

  const getDateNumMonthsAgo = (num: number): Date => {
    const todaysDate = new Date()
    return new Date(todaysDate.setMonth(todaysDate.getMonth() - num))
  }

  const getFirstDayOfYear = (year: number): Date => {
    return new Date(year, 0, 1)
  }

  const getLastDayOfYear = (year: number): Date => {
    return new Date(year, 11, 31)
  }

  type PastAppointmentsDatePickerValue = {
    startDate: Date
    endDate: Date
  }

  type PastAppointmentsDatePickerOption = {
    label: string
    value: string
    dates: PastAppointmentsDatePickerValue
  }

  const getPickerOptions = (): Array<PastAppointmentsDatePickerOption> => {
    const todaysDate = new Date()

    const fiveMonthsEarlier = getDateNumMonthsAgo(5)
    const threeMonthsEarlier = getDateNumMonthsAgo(3)

    const eightMonthsEarlier = getDateNumMonthsAgo(8)
    const sixMonthsEarlier = getDateNumMonthsAgo(6)

    const elevenMonthsEarlier = getDateNumMonthsAgo(11)
    const nineMonthsEarlier = getDateNumMonthsAgo(9)

    const currentYear = todaysDate.getUTCFullYear()
    const firstDayCurrentYear = getFirstDayOfYear(currentYear)
    const lastDayCurrentYear = getLastDayOfYear(currentYear)

    const lastYear = new Date(todaysDate.setUTCFullYear(currentYear - 1)).getUTCFullYear()
    const firstDayLastYear = getFirstDayOfYear(lastYear)
    const lastDayLastYear = getLastDayOfYear(lastYear)

    return [
      {
        label: t('pastAppointments.pastThreeMonths'),
        value: t('pastAppointments.pastThreeMonths'),
        dates: { startDate: threeMonthsEarlier, endDate: todaysDate },
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier),
        value: t('pastAppointments.fiveMonthsToThreeMonths'),
        dates: { startDate: fiveMonthsEarlier, endDate: threeMonthsEarlier },
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: t('pastAppointments.eightMonthsToSixMonths'),
        dates: { startDate: eightMonthsEarlier, endDate: sixMonthsEarlier },
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: t('pastAppointments.elevenMonthsToNineMonths'),
        dates: { startDate: elevenMonthsEarlier, endDate: nineMonthsEarlier },
      },
      {
        label: t('pastAppointments.allOf', { year: currentYear }),
        value: t('pastAppointments.allOf', { year: currentYear }),
        dates: { startDate: firstDayCurrentYear, endDate: lastDayCurrentYear },
      },
      {
        label: t('pastAppointments.allOf', { year: lastYear }),
        value: t('pastAppointments.allOf', { year: lastYear }),
        dates: { startDate: firstDayLastYear, endDate: lastDayLastYear },
      },
    ]
  }

  const pickerOptions = getPickerOptions()
  const [datePickerValue, setDatePickerValue] = useState(pickerOptions[0].value)
  const [dateRange, setDateRange] = useState(pickerOptions[0].dates)

  useEffect(() => {
    dispatch(getAppointmentsInDateRange(dateRange.startDate.toISOString(), dateRange.endDate.toISOString()))
  }, [dispatch, dateRange])

  const onPastAppointmentPress = (): void => {}

  const buttonListWithAppointmentsAdded = (buttonListItems: Array<ButtonListItemObj>, listOfAppointments: AppointmentsList): Array<ButtonListItemObj> => {
    // for each appointment, retrieve its textLines and add it to the existing buttonListItems
    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment

      const textLines: Array<TextLine> = [
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getAppointmentLocation(attributes.appointmentType, attributes.location.name, t) }) },
      ]

      buttonListItems.push({ textLines, onPress: onPastAppointmentPress })
    })

    return buttonListItems
  }

  const getAppointmentsPastThreeMonths = (): ReactNode => {
    if (!appointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(appointmentsByYear).sort().reverse()
    const yearsToSortedMonths = getYearsToSortedMonths(appointmentsByYear, true)

    let buttonListItems: Array<ButtonListItemObj> = []

    _.forEach(sortedYears, (year) => {
      _.forEach(yearsToSortedMonths[year], (month) => {
        const listOfAppointments = appointmentsByYear[year][month]
        buttonListItems = buttonListWithAppointmentsAdded(buttonListItems, listOfAppointments)
      })
    })

    return (
      <Box>
        <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter} accessibilityRole="header">
          {t('pastAppointments.pastThreeMonths')}
        </TextView>
        <ButtonList items={buttonListItems} />
      </Box>
    )
  }

  const setValuesOnPickerSelect = (selectValue: string): void => {
    setDatePickerValue(selectValue)
    const currentDates = pickerOptions.find((el) => el.value === selectValue)
    if (currentDates) {
      setDateRange(currentDates.dates)
    }
  }

  const isPastThreeMonths = datePickerValue === t('pastAppointments.pastThreeMonths')

  return (
    <Box {...testIdProps('Past-appointments')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter}>
        {t('pastAppointments.selectADateRange')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        <VAPicker selectedValue={datePickerValue} onSelectionChange={setValuesOnPickerSelect} pickerOptions={pickerOptions} testID={'Select-a-date-range-picker'} />
      </Box>
      {isPastThreeMonths ? getAppointmentsPastThreeMonths() : getGroupedAppointments(appointmentsByYear || {}, theme, t, onPastAppointmentPress, true)}
    </Box>
  )
}

export default PastAppointments
