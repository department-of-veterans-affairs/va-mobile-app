import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import _ from 'underscore'

import { AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextLine, TextView, VAPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentLocation, getYearsToSortedMonths } from '../UpcomingAppointments/UpcomingAppointments'
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

  useEffect(() => {
    const todaysDate = new Date()
    const threeMonthsAgo = new Date(todaysDate.setMonth(todaysDate.getMonth() - 3))
    dispatch(getAppointmentsInDateRange(todaysDate.toISOString(), threeMonthsAgo.toISOString()))
  }, [dispatch])

  const getMMMMyyyy = (date: Date): string => {
    return getFormattedDate(date.toISOString(), 'MMM yyyy')
  }

  const getDateRange = (startDate: Date, endDate: Date): string => {
    const formattedStartDate = getMMMMyyyy(startDate)
    const formattedEndDate = getMMMMyyyy(endDate)
    return `${formattedStartDate} - ${formattedEndDate}`
  }

  const getDateNumMonthsAgo = (num: number): Date => {
    const todaysDate = new Date()
    return new Date(todaysDate.setMonth(todaysDate.getMonth() - num))
  }

  const getPickerOptions = () => {
    const fiveMonthsEarlier = getDateNumMonthsAgo(5)
    const threeMonthsEarlier = getDateNumMonthsAgo(3)

    const eightMonthsEarlier = getDateNumMonthsAgo(8)
    const sixMonthsEarlier = getDateNumMonthsAgo(6)

    const elevenMonthsEarlier = getDateNumMonthsAgo(11)
    const nineMonthsEarlier = getDateNumMonthsAgo(9)

    return [
      {
        label: t('pastAppointments.pastThreeMonths'),
        value: t('pastAppointments.pastThreeMonths'),
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier),
        value: '5 months to 3 months',
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: '8 months to 6 months',
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: '11 months to 9 months',
      },
    ]
  }

  const pickerOptions = getPickerOptions()
  const [datePickerValue, setDatePickerValue] = useState(pickerOptions[0].value)

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

  return (
    <Box {...testIdProps('Past-appointments')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter}>
        {t('pastAppointments.selectADateRange')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        <VAPicker selectedValue={datePickerValue} onSelectionChange={setDatePickerValue} pickerOptions={pickerOptions} />
      </Box>
      {getAppointmentsPastThreeMonths()}
    </Box>
  )
}

export default PastAppointments
