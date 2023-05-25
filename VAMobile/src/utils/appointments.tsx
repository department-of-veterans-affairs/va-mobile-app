import { DateTime } from 'luxon'
import { TFunction } from 'i18next'
import React, { ReactNode } from 'react'
import _ from 'underscore'

import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentType,
  AppointmentTypeConstants,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMetaPagination,
} from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps, VAIconProps } from 'components'
import { LabelTagTypeConstants } from '../components/LabelTag'
import { VATheme } from 'styles/theme'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from './formattingUtils'
import { getTestIDFromTextLines } from './accessibility'

export type YearsToSortedMonths = { [key: string]: Array<string> }

/**
 * Returns returns the appointment type icon text
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param translate - function the translate function
 * @param phoneOnly - boolean tells if the appointment is a phone call
 *
 * @returns string of the appointment type icon
 */
export const getAppointmentTypeIconText = (appointmentType: AppointmentType, translate: TFunction, phoneOnly: boolean): string => {
  switch (appointmentType) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      return translate('appointmentList.connectAtAtlas')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      return translate('appointmentList.connectAtHome')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      return translate('appointmentList.connectOnsite')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return translate('appointmentList.connectGFE')
    case AppointmentTypeConstants.VA:
      return phoneOnly ? translate('appointmentList.phoneOnly') : translate('appointmentList.inPerson')
    case AppointmentTypeConstants.COMMUNITY_CARE:
    default:
      return phoneOnly ? translate('appointmentList.phoneOnly') : ''
  }
}

/**
 * Returns returns the request type text for pending appointments
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param translate - function the translate function
 * @param phoneOnly - boolean tells if the appointment is a phone call
 *
 * @returns string of the appointment type icon
 */
export const getPendingAppointmentRequestTypeText = (appointmentType: AppointmentType, translate: TFunction, phoneOnly: boolean): string => {
  switch (appointmentType) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      return translate('appointmentList.connectAtAtlas')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      return translate('appointmentList.connectAtHome')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      return translate('appointmentList.connectOnsite')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return translate('appointmentList.connectGFE')
    case AppointmentTypeConstants.VA:
    case AppointmentTypeConstants.COMMUNITY_CARE:
    default:
      return phoneOnly ? translate('appointmentList.phoneOnly') : translate('appointmentList.inPerson')
  }
}

/**
 * Returns the icon props to use for the appointment. ex video camera , phone or nothing
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param phoneOnly - boolean tells if the appointment is a phone call
 * @param theme - type VATheme, the theme object to set some properties
 *
 * @returns VAIconProps or undefined
 */
export const getAppointmentTypeIcon = (appointmentType: AppointmentType, phoneOnly: boolean, theme: VATheme): VAIconProps | undefined => {
  const iconProp = { fill: theme.colors.icon.defaultMenuItem, height: theme.fontSizes.HelperText.fontSize, width: theme.fontSizes.HelperText.fontSize } as VAIconProps

  switch (appointmentType) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return { ...iconProp, name: 'VideoCamera' }
    case AppointmentTypeConstants.VA:
      return phoneOnly ? { ...iconProp, name: 'PhoneSolid' } : { ...iconProp, name: 'BuildingSolid' }
    case AppointmentTypeConstants.COMMUNITY_CARE:
    default:
      return phoneOnly ? { ...iconProp, name: 'PhoneSolid' } : undefined
  }
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
    const textLines = getTextLinesForAppointmentListItem(appointment, t, theme)
    const position = (currentPage - 1) * perPage + (groupIdx + index + 1)
    const a11yValue = tc('common:listPosition', { position, total: totalEntries })
    const isPendingAppointment = isAPendingAppointment(appointment?.attributes)

    listItems.push({
      textLines,
      a11yValue,
      onPress: () => onAppointmentPress(appointment.id),
      a11yHintText: isPendingAppointment ? t('appointments.viewDetails.request') : t('appointments.viewDetails'),
      testId: getTestIDFromTextLines(textLines),
    })
  })

  return listItems
}

/**
 * Should return an array of TextLineWithIconProps that describes an appointment that is shown in upcoming and past appointment list
 *
 * @param appointment - appointment data
 * @param t - function, the translate function
 * @param theme - type VATheme, the theme object to set some properties
 */
export const getTextLinesForAppointmentListItem = (appointment: AppointmentData, t: TFunction, theme: VATheme): Array<TextLineWithIconProps> => {
  const { attributes } = appointment
  const { startDateUtc, timeZone, appointmentType, location, phoneOnly, isCovidVaccine, typeOfCare, healthcareProvider } = attributes
  const textLines: Array<TextLineWithIconProps> = []
  const isPendingAppointment = attributes.isPending && (attributes.status === AppointmentStatusConstants.SUBMITTED || attributes.status === AppointmentStatusConstants.CANCELLED)

  if (attributes.status === AppointmentStatusConstants.CANCELLED) {
    textLines.push({ text: t('appointments.canceled'), textTag: { labelType: LabelTagTypeConstants.tagInactive }, mb: theme.dimensions.condensedMarginBetween })
  } else if (attributes.status === AppointmentStatusConstants.BOOKED) {
    textLines.push({ text: t('appointments.confirmed'), textTag: { labelType: LabelTagTypeConstants.tagBlue }, mb: theme.dimensions.condensedMarginBetween })
  } else if (isPendingAppointment) {
    textLines.push({ text: t('appointments.pending'), textTag: { labelType: LabelTagTypeConstants.tagYellow }, mb: theme.dimensions.condensedMarginBetween })
  }

  // pending appointments
  if (isPendingAppointment) {
    textLines.push({ text: t('common:text.raw', { text: typeOfCare }), variant: 'MobileBodyBold', mb: 5 })
    switch (appointmentType) {
      case AppointmentTypeConstants.COMMUNITY_CARE:
        if (healthcareProvider) {
          textLines.push({ text: t('common:text.raw', { text: healthcareProvider }), variant: 'HelperText' })
        } else {
          textLines.push({ text: t('upcomingAppointments.communityCare'), variant: 'HelperText' })
        }
        break
      case AppointmentTypeConstants.VA:
      default:
        textLines.push({
          text: t('common:text.raw', { text: location.name }),
          variant: 'HelperText',
          mb: theme.dimensions.condensedMarginBetween,
        })
    }
    const youRequestedText = getPendingAppointmentRequestTypeText(appointmentType, t, phoneOnly)
    textLines.push({
      text: t('appointmentList.youRequested', { typeOfVisit: youRequestedText }),
      variant: 'HelperText',
    })
  } else {
    // if isCovidVaccine is true then make it the bold header, else if typeOfCare exist make it the bold header otherwise make the date/time bold header
    if (isCovidVaccine) {
      textLines.push(
        { text: t('upcomingAppointments.covidVaccine'), variant: 'MobileBodyBold', mb: 5 },
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'HelperText' },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'HelperText', mb: theme.dimensions.condensedMarginBetween },
      )
    } else if (typeOfCare) {
      textLines.push(
        { text: t('common:text.raw', { text: typeOfCare }), variant: 'MobileBodyBold', mb: 5 },
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'HelperText' },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'HelperText', mb: theme.dimensions.condensedMarginBetween },
      )
    } else {
      textLines.push(
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold', mb: 5 },
      )
    }

    const isVideoOrVAAppointment = appointmentType !== AppointmentTypeConstants.COMMUNITY_CARE
    const isCCAppointmentAndPhoneOnly = appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && phoneOnly
    const showAppointmentTypeIcon = isVideoOrVAAppointment || isCCAppointmentAndPhoneOnly
    textLines.push({
      text: t('common:text.raw', { text: healthcareProvider || location.name }),
      variant: 'HelperText',
      mb: showAppointmentTypeIcon ? theme.dimensions.condensedMarginBetween : 0,
    })

    if (showAppointmentTypeIcon) {
      textLines.push({
        text: t('common:text.raw', { text: getAppointmentTypeIconText(appointmentType, t, phoneOnly) }),
        iconProps: getAppointmentTypeIcon(appointmentType, phoneOnly, theme),
        variant: 'HelperText',
      })
    }
  }

  return textLines
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

/**
 * Returns true or false if the appointment is a pending appointment
 * @param attributes - data attributes of an appointment
 */
export const isAPendingAppointment = (attributes: AppointmentAttributes): boolean => {
  const { status, isPending } = attributes || ({} as AppointmentAttributes)
  const validPendingStatus = status === AppointmentStatusConstants.SUBMITTED || status === AppointmentStatusConstants.CANCELLED

  return !!(isPending && validPendingStatus)
}
