import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import _ from 'underscore'

import { AppointmentStatusConstants, AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, List, ListItemObj, TextLine, TextView, VAPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentLocation, getGroupedAppointments, getYearsToSortedMonths } from '../UpcomingAppointments/UpcomingAppointments'
import { getAppointmentsInDateRange } from 'store/actions'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type PastAppointmentsProps = {}

const PastAppointments: FC<PastAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
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

  const onPastAppointmentPress = (appointmentID: string): void => {
    navigateTo('PastAppointmentDetails', { appointmentID })()
  }

  const listWithAppointmentsAdded = (listItems: Array<ListItemObj>, listOfAppointments: AppointmentsList): Array<ListItemObj> => {
    // for each appointment, retrieve its textLines and add it to the existing listItems
    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment

      const textLines: Array<TextLine> = [
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getAppointmentLocation(attributes.appointmentType, attributes.location.name, t) }) },
      ]

      if (attributes.status === AppointmentStatusConstants.CANCELLED) {
        textLines.push({ text: t('appointments.canceled'), isBold: true, color: 'error' })
      }

      listItems.push({ textLines, onPress: () => onPastAppointmentPress(appointment.id) })
    })

    return listItems
  }

  const getAppointmentsPastThreeMonths = (): ReactNode => {
    if (!appointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(appointmentsByYear).sort().reverse()
    const yearsToSortedMonths = getYearsToSortedMonths(appointmentsByYear, true)

    let listItems: Array<ListItemObj> = []

    _.forEach(sortedYears, (year) => {
      _.forEach(yearsToSortedMonths[year], (month) => {
        const listOfAppointments = appointmentsByYear[year][month]
        listItems = listWithAppointmentsAdded(listItems, listOfAppointments)
      })
    })

    return (
      <Box>
        <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter} mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
          {t('pastAppointments.pastThreeMonths')}
        </TextView>
        <List items={listItems} />
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
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mb={theme.dimensions.pickerLabelMargin}>
        {t('pastAppointments.selectADateRange')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        <VAPicker
          selectedValue={datePickerValue}
          onSelectionChange={setValuesOnPickerSelect}
          pickerOptions={pickerOptions}
          isDatePicker={true}
          testID={'Select-a-date-range-picker'}
        />
      </Box>
      {isPastThreeMonths ? getAppointmentsPastThreeMonths() : getGroupedAppointments(appointmentsByYear || {}, theme, t, onPastAppointmentPress, true)}
    </Box>
  )
}

export default PastAppointments
