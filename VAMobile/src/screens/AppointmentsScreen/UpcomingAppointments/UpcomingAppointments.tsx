import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import _ from 'underscore'

import { AppointmentType, AppointmentTypeConstants, AppointmentTypeToID, AppointmentsGroupedByYear, AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentsInDateRange } from 'store/actions'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type YearsToSortedMonths = { [key: string]: Array<string> }

export const getAppointmentLocation = (appointmentType: AppointmentType, locationName: string, translate: TFunction): string => {
  if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE || appointmentType === AppointmentTypeConstants.VA) {
    return locationName
  }

  return translate(AppointmentTypeToID[appointmentType])
}

export const getYearsToSortedMonths = (appointmentsByYear: AppointmentsGroupedByYear, isReverseSort: boolean): YearsToSortedMonths => {
  const yearToSortedMonths: YearsToSortedMonths = {}

  _.forEach(appointmentsByYear || {}, (appointmentsByMonth, year) => {
    const sortedMonths = _.keys(appointmentsByMonth).sort()
    if (isReverseSort) {
      sortedMonths.reverse()
    }
    yearToSortedMonths[year] = sortedMonths

    // sort the list of appointments within each month
    _.forEach(appointmentsByMonth, (listOfAppointments) => {
      listOfAppointments.sort((a, b) => {
        if (isReverseSort) {
          return new Date(b.attributes.startTime).getTime() - new Date(a.attributes.startTime).getTime()
        }
        return new Date(a.attributes.startTime).getTime() - new Date(b.attributes.startTime).getTime()
      })
    })
  })

  return yearToSortedMonths
}

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

  const onUpcomingAppointmentPress = (): void => {}

  const getButtonListItems = (listOfAppointments: AppointmentsList): Array<ButtonListItemObj> => {
    const buttonListItems: Array<ButtonListItemObj> = []

    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment

      const textLines: Array<TextLine> = [
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(attributes.startTime, attributes.timeZone) }), isBold: true },
        { text: t('common:text.raw', { text: getAppointmentLocation(attributes.appointmentType, attributes.location.name, t) }) },
      ]

      buttonListItems.push({ textLines, onPress: onUpcomingAppointmentPress })
    })

    return buttonListItems
  }

  const getGroupedAppointments = (): ReactNode => {
    if (!appointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(appointmentsByYear).sort()
    const yearsToSortedMonths = getYearsToSortedMonths(appointmentsByYear, false)

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
            <ButtonList items={buttonListItems} />
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
