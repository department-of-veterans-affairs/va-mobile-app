import { DateTime } from 'luxon'
import { TFunction } from 'i18next'
import React, { ReactNode } from 'react'
import _ from 'underscore'

import {
  AppointmentStatusConstants,
  AppointmentType,
  AppointmentTypeConstants,
  AppointmentTypeToID,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMetaPagination,
} from 'store/api'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps, VAIconProps } from 'components'
import { VATheme } from 'styles/theme'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from './formattingUtils'
import { getTestIDFromTextLines } from './accessibility'

export type YearsToSortedMonths = { [key: string]: Array<string> }

/**
 * Returns returns the appointment location
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param locationName - string name of the location of the appointment
 * @param translate - function the translate function
 * @param phoneOnly - boolean tells if the appointment is a phone call
 * @param isCovidVaccine - boolean or undefined tells if the appointment is a covid
 *
 * @returns string of the location name
 */
export const getAppointmentLocation = (appointmentType: AppointmentType, locationName: string, translate: TFunction, phoneOnly: boolean, isCovidVaccine?: boolean): string => {
  if (phoneOnly) {
    return translate('upcomingAppointments.phoneOnly')
  } else if (isCovidVaccine) {
    return translate('upcomingAppointments.covidVaccine')
  } else if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE || appointmentType === AppointmentTypeConstants.VA) {
    return locationName
  }

  return translate(AppointmentTypeToID[appointmentType])
}

/**
 * Returns the icon props to use for the appointment. ex video camera , phone or nothing
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param phoneOnly - boolean tells if the appointment is a phone call
 * @param theme - type VATheme, the theme object to set some properties
 *
 * @returns VAIconProps or undefoned
 */
export const getAppointmentTypeIcon = (appointmentType: AppointmentType, phoneOnly: boolean, theme: VATheme): VAIconProps | undefined => {
  const iconProp = { fill: theme.colors.icon.dark, height: theme.fontSizes.MobileBody.fontSize, width: theme.fontSizes.MobileBody.fontSize } as VAIconProps

  if (appointmentType.includes('VIDEO')) {
    return { ...iconProp, name: 'VideoCamera' }
  } else if (phoneOnly) {
    return { ...iconProp, name: 'PhoneSolid' }
  }

  return undefined
}

/**
 * Returns list of appointments
 *
 * @param appointmentsByYear - type AppointmentsGroupedByYear, set appointment by year
 * @param theme - type VATheme, the theme object to set some properties
 * @param translate - function, the translate function
 * @param onAppointmentPress - function, the function that will be triggered on appointment press
 * @param isReverseSort - boolean, set if it is a reverse sort
 * @param upcomingPageMetaData - type AppointmentsMetaPagination, set the pagination info
 *
 * @returns list of appointments
 */
export const getGroupedAppointments = (
  appointmentsByYear: AppointmentsGroupedByYear,
  theme: VATheme,
  translations: { t: TFunction; tc: TFunction },
  onAppointmentPress: (appointmentID: string) => void,
  isReverseSort: boolean,
  upcomingPageMetaData: AppointmentsMetaPagination,
): ReactNode => {
  if (!appointmentsByYear) {
    return <></>
  }

  const sortedYears = _.keys(appointmentsByYear).sort()
  if (isReverseSort) {
    sortedYears.reverse()
  }

  const yearsToSortedMonths = getYearsToSortedMonths(appointmentsByYear, isReverseSort)

  //track the start index for each grouping to get the current item position for a11yValue
  let groupIdx = 0
  return _.map(sortedYears, (year) => {
    return _.map(yearsToSortedMonths[year], (month) => {
      const listOfAppointments = appointmentsByYear[year][month]
      const listItems = getListItemsForAppointments(listOfAppointments, translations, onAppointmentPress, upcomingPageMetaData, groupIdx, theme)
      groupIdx = groupIdx + listItems.length
      const displayedMonth = getFormattedDate(new Date(parseInt(year, 10), parseInt(month, 10)).toISOString(), 'MMMM')

      return (
        <Box key={month} mb={theme.dimensions.standardMarginBetween}>
          <DefaultList items={listItems} title={`${displayedMonth} ${year}`} />
        </Box>
      )
    })
  })
}

/**
 * Returns item list of appointments
 *
 * @param listOfAppointments - type AppointmentsList, set appointment by year
 * @param translations - function, the translate function
 * @param onAppointmentPress - function, the function that will be triggered on appointment press
 * @param upcomingPageMetaData - type AppointmentsMetaPagination, set the pagination info
 * @param groupIdx - number, id of the appointment group
 * @param theme - type VATheme, the theme object to set some properties
 *
 * @returns Array list of appointments items
 */
const getListItemsForAppointments = (
  listOfAppointments: AppointmentsList,
  translations: { t: TFunction; tc: TFunction },
  onAppointmentPress: (appointmentID: string) => void,
  upcomingPageMetaData: AppointmentsMetaPagination,
  groupIdx: number,
  theme: VATheme,
): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []
  const { t, tc } = translations
  const { currentPage, perPage, totalEntries } = upcomingPageMetaData

  _.forEach(listOfAppointments, (appointment, index) => {
    const { attributes } = appointment
    const { startDateUtc, timeZone, appointmentType, location, phoneOnly, isCovidVaccine } = attributes
    const textLines: Array<TextLineWithIconProps> = []

    if (attributes.status === AppointmentStatusConstants.CANCELLED) {
      textLines.push({ text: t('appointments.canceled'), isTextTag: true })
    }

    textLines.push(
      { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
      {
        text: t('common:text.raw', { text: getAppointmentLocation(appointmentType, location.name, t, phoneOnly, isCovidVaccine) }),
        iconProps: getAppointmentTypeIcon(appointmentType, phoneOnly, theme),
      },
    )

    const position = (currentPage - 1) * perPage + (groupIdx + index + 1)
    const a11yValue = tc('common:listPosition', { position, total: totalEntries })

    listItems.push({
      textLines,
      a11yValue,
      onPress: () => onAppointmentPress(appointment.id),
      a11yHintText: t('appointments.viewDetails'),
      testId: getTestIDFromTextLines(textLines),
    })
  })

  return listItems
}

/**
 * Returns sorted appointment
 *
 * @param appointmentsByYear - type AppointmentsGroupedByYear, set appointment by year
 * @param isReverseSort - boolean, set if it is a reverse sort
 *
 * @returns type YearsToSortedMonths sorted appointments
 */
export const getYearsToSortedMonths = (appointmentsByYear: AppointmentsGroupedByYear, isReverseSort: boolean): YearsToSortedMonths => {
  const yearToSortedMonths: YearsToSortedMonths = {}

  _.forEach(appointmentsByYear || {}, (appointmentsByMonth, year) => {
    // convert string number to literal number for sorting
    const sortedMonths = _.keys(appointmentsByMonth).sort((a, b) => {
      return parseInt(a, 10) - parseInt(b, 10)
    })

    if (isReverseSort) {
      sortedMonths.reverse()
    }
    yearToSortedMonths[year] = sortedMonths

    // sort the list of appointments within each month
    _.forEach(appointmentsByMonth, (listOfAppointments) => {
      listOfAppointments.sort((a, b) => {
        const d1 = DateTime.fromISO(a.attributes.startDateUtc)
        const d2 = DateTime.fromISO(b.attributes.startDateUtc)
        return isReverseSort ? d2.toSeconds() - d1.toSeconds() : d1.toSeconds() - d2.toSeconds()
      })
    })
  })

  return yearToSortedMonths
}
