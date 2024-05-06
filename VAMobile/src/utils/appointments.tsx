import React, { ReactNode } from 'react'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatus,
  AppointmentStatusConstants,
  AppointmentTimeZone,
  AppointmentType,
  AppointmentTypeConstants,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMetaPagination,
} from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps, VAIconProps, VA_ICON_MAP } from 'components'
import { VATheme, VATypographyThemeVariants } from 'styles/theme'

import { LabelTagTypeConstants } from '../components/LabelTag'
import { getTestIDFromTextLines } from './accessibility'
import {
  getFormattedDate,
  getFormattedDateWithWeekdayForTimeZone,
  getFormattedTimeForTimeZone,
} from './formattingUtils'

export type YearsToSortedMonths = { [key: string]: Array<string> }

const atFacilityAddress = (location: AppointmentLocation | undefined, t: TFunction) => {
  let fullAddress = ''
  if (location?.address) {
    const address = location.address
    if (address.street && address.city && address.state && address.zipCode) {
      fullAddress = `${address.street} ${address.city}, ${address.state} ${address.zipCode}`
    }
  }

  return fullAddress ? t('appointments.atFacility', { facility: fullAddress }) : t('appointments.atAtlasFacility')
}

const atFacilityText = (location: AppointmentLocation | undefined, t: TFunction) => {
  const facility = location?.name
  return facility ? t('appointments.atFacility', { facility }) : t('appointments.atVAFacility')
}

/**
 * Returns returns the appointment type icon text
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param t - function the translate function
 * @param phoneOnly - boolean tells if the appointment is a phone call
 *
 * @returns string of the appointment type icon
 */
export const getAppointmentTypeIconText = (
  type: AppointmentType,
  location: AppointmentLocation,
  phoneOnly: boolean,
  t: TFunction,
): string => {
  switch (type) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      return atFacilityAddress(location, t)
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      return t('video')
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      return atFacilityText(location, t)
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return t('video')
    case AppointmentTypeConstants.VA:
      return phoneOnly ? t('appointmentList.phoneOnly') : atFacilityText(location, t)
    case AppointmentTypeConstants.COMMUNITY_CARE:
    default:
      return phoneOnly ? t('appointmentList.phoneOnly') : ''
  }
}

/**
 * Returns returns the appointment analytics status
 *
 * @param attributes - appointment attributes
 *
 * @returns string appointment analytics status
 */
export const getAppointmentAnalyticsStatus = (attributes: AppointmentAttributes): string => {
  let apiStatus = ''

  const isPendingAppointment =
    attributes.isPending &&
    (attributes.status === AppointmentStatusConstants.SUBMITTED ||
      attributes.status === AppointmentStatusConstants.CANCELLED)

  if (attributes.status === AppointmentStatusConstants.CANCELLED) {
    apiStatus = 'Canceled'
  } else if (attributes.status === AppointmentStatusConstants.BOOKED) {
    apiStatus = 'Confirmed'
  } else if (isPendingAppointment) {
    apiStatus = 'Pending'
  }

  return apiStatus
}

/**
 * Returns returns the appointment analytics days
 *
 * @param attributes - appointment attributes
 *
 * @returns string appointment analytics days
 */
export const getAppointmentAnalyticsDays = (attributes: AppointmentAttributes): number => {
  const apptDate = Math.floor(DateTime.fromISO(attributes.startDateUtc).toMillis() / (1000 * 60 * 60 * 24))
  const nowDate = Math.floor(DateTime.now().toMillis() / (1000 * 60 * 60 * 24))
  const days = apptDate - nowDate

  return days
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
export const pendingType = (appointmentType: AppointmentType, translate: TFunction, phoneOnly: boolean): string => {
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
export const getAppointmentTypeIcon = (
  type: AppointmentType,
  phoneOnly: boolean,
  theme: VATheme,
): VAIconProps | undefined => {
  const iconProps = {
    fill: theme.colors.icon.defaultMenuItem,
    height: theme.fontSizes.HelperText.fontSize,
    width: theme.fontSizes.HelperText.fontSize,
  } as VAIconProps
  const types = AppointmentTypeConstants
  let name: keyof typeof VA_ICON_MAP | undefined

  if (type === types.VA_VIDEO_CONNECT_ONSITE || type === types.VA_VIDEO_CONNECT_ATLAS) {
    name = 'Building'
  } else if (type === types.VA_VIDEO_CONNECT_GFE || type === types.VA_VIDEO_CONNECT_HOME) {
    name = 'VideoCamera'
  } else if (type === types.VA) {
    name = phoneOnly ? 'Phone' : 'Building'
  } else if (phoneOnly) {
    name = 'Phone'
  }

  return name && { ...iconProps, name }
}

/**
 * Returns list of appointments
 *
 * @param appointments - list of appointments unsorted
 * @param theme - type VATheme, the theme object to set some properties
 * @param translate - function, the translate function
 * @param onAppointmentPress - function, the function that will be triggered on appointment press
 * @param isReverseSort - boolean, set if it is a reverse sort
 * @param upcomingPageMetaData - type AppointmentsMetaPagination, set the pagination info
 *
 * @returns list of appointments
 */
export const getGroupedAppointments = (
  appointments: AppointmentsList,
  theme: VATheme,
  translations: { t: TFunction },
  onAppointmentPress: (appointment: AppointmentData) => void,
  isReverseSort: boolean,
  upcomingPageMetaData: AppointmentsMetaPagination,
): ReactNode => {
  if (!appointments) {
    return <></>
  }
  const appointmentsByYear: AppointmentsGroupedByYear = groupAppointmentsByYear(appointments)
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
      const listItems = getListItemsForAppointments(
        listOfAppointments,
        translations,
        onAppointmentPress,
        upcomingPageMetaData,
        groupIdx,
        theme,
      )
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

export const groupAppointmentsByYear = (appointmentsList?: AppointmentsList): AppointmentsGroupedByYear => {
  const appointmentsByYear: AppointmentsGroupedByYear = {}

  // Group appointments by year, resulting object is { year: [ list of appointments for year ] }
  const initialAppointmentsByYear = _.groupBy(appointmentsList || [], (appointment) => {
    return getFormattedDate(appointment.attributes.startDateUtc, 'yyyy')
  })

  // Group appointments by year by month next, resulting object is { year: { month1: [ list for month1 ], month2: [ list for month2 ] } }
  _.each(initialAppointmentsByYear, (listOfAppointmentsInYear, year) => {
    appointmentsByYear[year] = _.groupBy(listOfAppointmentsInYear, (appointment): number => {
      return new Date(appointment.attributes.startDateUtc).getUTCMonth()
    })
  })

  return appointmentsByYear
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
  translations: { t: TFunction },
  onAppointmentPress: (appointment: AppointmentData) => void,
  upcomingPageMetaData: AppointmentsMetaPagination,
  groupIdx: number,
  theme: VATheme,
): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []
  const { t } = translations
  const { currentPage, perPage, totalEntries } = upcomingPageMetaData

  _.forEach(listOfAppointments, (appointment, index) => {
    const textLines = getTextLinesForAppointmentListItem(appointment, t, theme)
    const position = (currentPage - 1) * perPage + (groupIdx + index + 1)
    const a11yValue = t('listPosition', { position, total: totalEntries })
    const isPendingAppointment = isAPendingAppointment(appointment?.attributes)

    listItems.push({
      textLines,
      a11yValue,
      onPress: () => onAppointmentPress(appointment),
      a11yHintText: isPendingAppointment ? t('appointments.viewDetails.request') : t('appointments.viewDetails'),
      testId: getTestIDFromTextLines(textLines),
    })
  })

  return listItems
}

const getStatus = (isPending: boolean, status: AppointmentStatus, t: TFunction, mb: number) => {
  const result: TextLineWithIconProps[] = []

  if (status === AppointmentStatusConstants.CANCELLED) {
    result.push({
      text: t('appointments.canceled'),
      textTag: { labelType: LabelTagTypeConstants.tagInactive },
      mb,
    })
  } else if (status === AppointmentStatusConstants.BOOKED) {
    result.push({
      text: t('appointments.confirmed'),
      textTag: { labelType: LabelTagTypeConstants.tagGreen },
      mb,
    })
  } else if (isPending) {
    result.push({
      text: t('appointments.pending'),
      textTag: { labelType: LabelTagTypeConstants.tagYellow },
      mb,
    })
  }

  return result
}

const getDateAndTime = (
  startDateUtc: string,
  timeZone: AppointmentTimeZone,
  t: TFunction,
  tinyMarginBetween: number,
): Array<TextLineWithIconProps> => {
  return [
    {
      text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone),
      variant: 'MobileBodyBold',
    },
    {
      text: getFormattedTimeForTimeZone(startDateUtc, timeZone),
      variant: 'MobileBodyBold',
      mb: tinyMarginBetween,
    },
  ]
}

const makeCareText = (typeOfCare: string, serviceCategoryName: string, isCovidVaccine: boolean, t: TFunction) => {
  if (serviceCategoryName === 'COMPENSATION & PENSION') {
    return t('appointments.claimExam')
  } else if (isCovidVaccine) {
    return t('upcomingAppointments.covidVaccine')
  } else {
    return typeOfCare
  }
}

const getModality = (
  type: AppointmentType,
  phoneOnly: boolean,
  location: AppointmentLocation,
  theme: VATheme,
  t: TFunction,
): TextLineWithIconProps[] => [
  {
    text: getAppointmentTypeIconText(type, location, phoneOnly, t),
    iconProps: getAppointmentTypeIcon(type, phoneOnly, theme),
    variant: 'HelperText',
  },
]

const getTextLine = (text?: string | null, variant: keyof VATypographyThemeVariants = 'HelperText', mb = 5) => {
  return text ? [{ text, variant, mb }] : []
}
/**
 * Should return an array of TextLineWithIconProps that describes an appointment that is shown in upcoming and past appointment list
 *
 * @param appointment - appointment data
 * @param t - function, the translate function
 * @param theme - type VATheme, the theme object to set some properties
 */
export const getTextLinesForAppointmentListItem = (
  appointment: AppointmentData,
  t: TFunction,
  theme: VATheme,
): Array<TextLineWithIconProps> => {
  const { attributes } = appointment
  const {
    startDateUtc,
    timeZone,
    appointmentType,
    location,
    phoneOnly,
    isCovidVaccine,
    typeOfCare,
    healthcareProvider,
    serviceCategoryName,
  } = attributes
  const { condensedMarginBetween, tinyMarginBetween } = theme.dimensions
  const isPending =
    attributes.isPending &&
    (attributes.status === AppointmentStatusConstants.SUBMITTED ||
      attributes.status === AppointmentStatusConstants.CANCELLED)
  const careText = makeCareText(typeOfCare || '', serviceCategoryName || '', isCovidVaccine, t)

  if (isPending) {
    return [
      ...getTextLine(careText, 'MobileBodyBold'),
      ...getStatus(isPending, attributes.status, t, condensedMarginBetween),
      ...getTextLine(healthcareProvider),
      ...getTextLine(t('appointmentList.youRequested', { typeOfVisit: pendingType(appointmentType, t, phoneOnly) })),
    ]
  } else {
    return [
      ...getDateAndTime(startDateUtc, timeZone, t, tinyMarginBetween),
      ...getStatus(isPending, attributes.status, t, condensedMarginBetween),
      ...getTextLine(careText),
      ...getTextLine(healthcareProvider),
      ...getModality(appointmentType, phoneOnly, location, theme, t),
    ]
  }
}

/**
 * Returns sorted appointment
 *
 * @param appointmentsByYear - type AppointmentsGroupedByYear, set appointment by year
 * @param isReverseSort - boolean, set if it is a reverse sort
 *
 * @returns type YearsToSortedMonths sorted appointments
 */
export const getYearsToSortedMonths = (
  appointmentsByYear: AppointmentsGroupedByYear,
  isReverseSort: boolean,
): YearsToSortedMonths => {
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
  const validPendingStatus =
    status === AppointmentStatusConstants.SUBMITTED || status === AppointmentStatusConstants.CANCELLED

  return !!(isPending && validPendingStatus)
}
