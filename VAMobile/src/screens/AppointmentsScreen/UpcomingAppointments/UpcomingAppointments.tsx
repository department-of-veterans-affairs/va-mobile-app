import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'

import { AppointmentType, AppointmentTypeConstants, AppointmentTypeToName, AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextView, textIDObj } from 'components'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentsInDateRange } from 'store/actions'
import { getFormattedDate } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type UpcomingAppointmentsProps = {}

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { appointmentsByYear } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  useEffect(() => {
    const todaysDate = new Date()
    const sixMonthsFromToday = new Date(todaysDate.setMonth(todaysDate.getMonth() + 6))
    dispatch(getAppointmentsInDateRange(todaysDate.toISOString(), sixMonthsFromToday.toISOString()))
  }, [dispatch])

  const getLocation = (appointmentType: AppointmentType, locationName: string): string => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE || appointmentType === AppointmentTypeConstants.VA) {
      return locationName
    }

    return AppointmentTypeToName[appointmentType]
  }

  const onAppointmentPress = (): void => {}

  const getFormattedDateTime = (dateTime: string, dateTimeType: DateTimeFormatOptions, timeZone: string, dateTimeOptions?: { [key: string]: string }): string => {
    const dateObj = DateTime.fromISO(dateTime).setZone(timeZone)
    return dateObj.toLocaleString(Object.assign(dateTimeType, dateTimeOptions))
  }

  type YearsToSortedMonths = { [key: string]: Array<string> }

  const getYearsToSortedMonths = (): YearsToSortedMonths => {
    const yearToSortedMonths: YearsToSortedMonths = {}

    _.forEach(appointmentsByYear || {}, (appointmentsByMonth, year) => {
      yearToSortedMonths[year] = _.keys(appointmentsByMonth).sort()

      // sort the list of appointments within each month
      _.forEach(appointmentsByMonth, (listOfAppointments) => {
        listOfAppointments.sort((a, b) => {
          return new Date(a.attributes.startTime).getTime() - new Date(b.attributes.startTime).getTime()
        })
      })
    })

    return yearToSortedMonths
  }

  const getButtonListItems = (listOfAppointments: AppointmentsList): Array<ButtonListItemObj> => {
    const buttonListItems: Array<ButtonListItemObj> = []

    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment

      const textIDs: Array<textIDObj> = [
        { textID: 'common:text.raw', fieldObj: { text: getFormattedDateTime(attributes.startTime, DateTime.DATE_FULL, attributes.timeZone, { weekday: 'long' }) } },
        {
          textID: { id: 'common:text.raw', isBold: true },
          fieldObj: { text: getFormattedDateTime(attributes.startTime, DateTime.TIME_SIMPLE, attributes.timeZone, { timeZoneName: 'short' }) },
        },
        { textID: 'common:text.raw', fieldObj: { text: getLocation(attributes.appointmentType, attributes.location.name) } },
      ]

      buttonListItems.push({ textIDs, onPress: onAppointmentPress })
    })

    return buttonListItems
  }

  const getGroupedAppointments = (): ReactNode => {
    if (!appointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(appointmentsByYear).sort()
    const yearsToSortedMonths = getYearsToSortedMonths()

    return _.map(sortedYears, (year) => {
      return _.map(yearsToSortedMonths[year], (month) => {
        const listOfAppointments = appointmentsByYear[year][month]
        const buttonListItems = getButtonListItems(listOfAppointments)

        const displayedMonth = getFormattedDate(new Date(parseInt(year, 10), parseInt(month, 10)).toISOString(), 'MMMM')

        return (
          <Box key={month} mb={theme.dimensions.marginBetween}>
            <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter}>
              {displayedMonth} {year}
            </TextView>
            <ButtonList items={buttonListItems} translationNameSpace={NAMESPACE.APPOINTMENTS} />
          </Box>
        )
      })
    })
  }

  return (
    <Box {...testIdProps('Upcoming-appointments')}>
      <TextView mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        {t('upcomingAppointments.confirmedApptsDisplayed')}
      </TextView>
      {getGroupedAppointments()}
    </Box>
  )
}

export default UpcomingAppointments
