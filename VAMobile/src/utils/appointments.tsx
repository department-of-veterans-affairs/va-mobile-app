import React, { ReactNode } from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'
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
  AppointmentsDateRange,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMetaPagination,
} from 'api/types'
import { Box, DefaultList, DefaultListItemObj, TextLineWithIconProps } from 'components'
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
      fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
    }
  }

  return fullAddress ? t('appointments.atFacility', { facility: fullAddress }) : t('appointments.atAtlasFacility')
}

const atFacilityName = (location: AppointmentLocation | undefined, t: TFunction) => {
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
      return atFacilityName(location, t)
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return t('video')
    case AppointmentTypeConstants.VA:
      return phoneOnly ? t('appointmentList.phoneOnly') : atFacilityName(location, t)
    case AppointmentTypeConstants.COMMUNITY_CARE:
      return t('upcomingAppointments.communityCare')
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
export const pendingType = (type: AppointmentType, t: TFunction, phoneOnly: boolean): string => {
  switch (type) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return t('video')
    case AppointmentTypeConstants.COMMUNITY_CARE:
      return t('upcomingAppointments.communityCare')
    case AppointmentTypeConstants.VA:
    default:
      return phoneOnly ? t('appointmentList.phoneOnly') : t('appointmentList.inPerson')
  }
}

/**
 * Returns the icon props to use for the appointment. ex video camera , phone or nothing
 *
 * @param appointmentType - type AppointmentType, to describe the type of appointment
 * @param phoneOnly - boolean tells if the appointment is a phone call
 * @param theme - type VATheme, the theme object to set some properties
 *
 * @returns IconProps or undefined
 */
export const getAppointmentTypeIcon = (
  type: AppointmentType,
  phoneOnly: boolean,
  theme: VATheme,
): IconProps | undefined => {
  const iconProps = {
    fill: theme.colors.icon.defaultMenuItem,
    height: theme.fontSizes.HelperText.fontSize,
    width: theme.fontSizes.HelperText.fontSize,
  } as IconProps
  switch (type) {
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      return { ...iconProps, name: 'LocationCity' } as IconProps
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
    case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
      return { ...iconProps, name: 'Videocam' } as IconProps
    case AppointmentTypeConstants.VA:
      return phoneOnly
        ? ({ ...iconProps, name: 'Phone' } as IconProps)
        : ({ ...iconProps, name: 'LocationCity' } as IconProps)
    case AppointmentTypeConstants.COMMUNITY_CARE:
      return undefined
    default:
      return phoneOnly ? ({ ...iconProps, name: 'Phone' } as IconProps) : undefined
  }
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

const isClinicVideoAppointment = (attributes: AppointmentAttributes) => {
  const { appointmentType } = attributes
  return (
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS
  )
}

/**
 * Determines if an appointment is community care.
 *
 * @param attributes - type AppointmentAttributes, data attrubutes of an appointment.
 * @returns boolean - true if the appointment is community care appointment.
 */
const getIsCommunityCare = (attributes: AppointmentAttributes) => {
  return attributes.appointmentType === AppointmentTypeConstants.COMMUNITY_CARE
}

/**
 * Determines if an appointment is phone only.
 *
 * @param attributes - type AppointmentAttributes, data attrubutes of an appointment.
 * @returns boolean - true if the appointment is phone only.
 */
const getIsPhoneOnly = (attributes: AppointmentAttributes) => {
  return attributes.phoneOnly
}

/**
 * Determines if an appointment is a video appointment.
 *
 * @param attributes - type AppointmentAttributes, data attrubutes of an appointment.
 * @returns boolean - true if the appointment is a video appointment.
 */
const getIsVideo = (attributes: AppointmentAttributes) => {
  const { appointmentType } = attributes
  return (
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS ||
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE ||
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE ||
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME
  )
}

/**
 * Returns true or false if the appointment is eligible for travel pay
 * @param attributes - type AppointmentAttributes, data attributes of an appointment
 * @returns boolean, true if the appointment is eligible for travel pay
 */
export const isEligibleForTravelPay = (attributes: AppointmentAttributes) => {
  const { status, travelPayClaim } = attributes
  const isPast = !isAPendingAppointment(attributes)
  const isInPerson = !getIsVideo(attributes) && !getIsCommunityCare(attributes) && !getIsPhoneOnly(attributes)
  const isClinicVideo = isClinicVideoAppointment(attributes)
  const isBooked = status === AppointmentStatusConstants.BOOKED
  // if the claim data is not successful or the claim has already been filed, then the appointment is not eligible for travel pay
  const hasNoClaim = !!travelPayClaim?.metadata.success && !travelPayClaim?.claim
  return isPast && isBooked && (isInPerson || isClinicVideo) && hasNoClaim
}

/**
 * Returns the number of days left to file travel pay
 * @param startDateUtc - string, the start date of the appointment in UTC
 * @returns number, the number of days left to file travel pay
 */
export const getDaysLeftToFileTravelPay = (startDateUtc: string) => {
  const daysToFile = 30 // 30 days to file travel pay
  const lastFileDate = DateTime.fromISO(startDateUtc).plus({ days: daysToFile })
  return Math.floor(lastFileDate.diff(DateTime.now().toUTC(), 'days').days)
}

const getTravelPay = (attributes: AppointmentAttributes, t: TFunction, mb: number) => {
  const daysLeftToFile = getDaysLeftToFileTravelPay(attributes.startDateUtc)
  if (isEligibleForTravelPay(attributes) && daysLeftToFile >= 0) {
    return {
      text: t('travelPay.daysToFile', { count: daysLeftToFile, days: daysLeftToFile }),
      textTag: { labelType: LabelTagTypeConstants.tagBlue },
      mb,
    }
  } else {
    return undefined
  }
}

const getStatus = (
  isPending: boolean,
  status: AppointmentStatus,
  t: TFunction,
  mb: number,
): TextLineWithIconProps | undefined => {
  if (status === AppointmentStatusConstants.CANCELLED) {
    return {
      text: t('appointments.canceled'),
      textTag: { labelType: LabelTagTypeConstants.tagInactive },
      mb,
    }
  } else if (status === AppointmentStatusConstants.BOOKED) {
    return {
      text: t('appointments.confirmed'),
      textTag: { labelType: LabelTagTypeConstants.tagGreen },
      mb,
    }
  } else if (isPending) {
    return {
      text: t('appointments.pending'),
      textTag: { labelType: LabelTagTypeConstants.tagYellow },
      mb,
    }
  } else {
    return undefined
  }
}

const getDate = (startDateUtc: string, timeZone: AppointmentTimeZone): TextLineWithIconProps => ({
  text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone),
  variant: 'MobileBodyBold',
})

const getTime = (startDateUtc: string, timeZone: AppointmentTimeZone, mb: number): TextLineWithIconProps => ({
  text: getFormattedTimeForTimeZone(startDateUtc, timeZone),
  variant: 'MobileBodyBold',
  mb,
})

const getCareText = (typeOfCare = '', serviceCategoryName: string | null = '', t: TFunction) => {
  return serviceCategoryName === 'COMPENSATION & PENSION' ? t('appointments.claimExam') : typeOfCare
}

const getModality = (
  type: AppointmentType,
  phoneOnly: boolean,
  location: AppointmentLocation,
  theme: VATheme,
  t: TFunction,
): TextLineWithIconProps => ({
  text: getAppointmentTypeIconText(type, location, phoneOnly, t),
  iconProps: getAppointmentTypeIcon(type, phoneOnly, theme),
  variant: 'HelperText',
})

const getTextLine = (
  text: string | null,
  mb: number,
  variant: keyof VATypographyThemeVariants = 'HelperText',
): TextLineWithIconProps | undefined => {
  return text ? { text, variant, mb } : undefined
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
    typeOfCare,
    healthcareProvider,
    serviceCategoryName,
  } = attributes
  const { condensedMarginBetween, tinyMarginBetween } = theme.dimensions
  const isPending =
    attributes.isPending &&
    (attributes.status === AppointmentStatusConstants.SUBMITTED ||
      attributes.status === AppointmentStatusConstants.CANCELLED)
  const careText = getCareText(typeOfCare, serviceCategoryName, t)
  let result: Array<TextLineWithIconProps | undefined> = []

  if (isPending) {
    const type = pendingType(appointmentType, t, phoneOnly)
    result = [
      getTextLine(careText, tinyMarginBetween, 'MobileBodyBold'),
      getStatus(isPending, attributes.status, t, condensedMarginBetween),
      getTextLine(healthcareProvider, tinyMarginBetween),
      getTextLine(t('appointmentList.requestType', { type }), tinyMarginBetween),
    ]
  } else {
    result = [
      getDate(startDateUtc, timeZone),
      getTime(startDateUtc, timeZone, tinyMarginBetween),
      getTravelPay(attributes, t, condensedMarginBetween),
      getStatus(isPending, attributes.status, t, condensedMarginBetween),
      getTextLine(careText, tinyMarginBetween),
      getTextLine(healthcareProvider, tinyMarginBetween),
      getModality(appointmentType, phoneOnly, location, theme, t),
    ]
  }

  return result.filter(Boolean) as Array<TextLineWithIconProps>
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

/**
 * Returns the date rage for upcoming appointments
 *
 * @returns AppointmentsDateRange
 */
export const getUpcomingAppointmentDateRange = (): AppointmentsDateRange => {
  const todaysDate = DateTime.local()
  const futureDate = todaysDate.plus({ days: 390 })

  return {
    startDate: todaysDate.startOf('day').toISO(),
    endDate: futureDate.endOf('day').toISO(),
  }
}

/**
 * Returns the date rage for appointments in the past 3 months
 *
 * @returns AppointmentsDateRange
 */
export const getPastAppointmentDateRange = (): AppointmentsDateRange => {
  const todaysDate = DateTime.local()
  const threeMonthsEarlier = todaysDate.minus({ months: 3 })

  return {
    startDate: threeMonthsEarlier.startOf('day').toISO(),
    endDate: todaysDate.minus({ days: 1 }).endOf('day').toISO(),
  }
}

export type AppointmentDetailsScreenType =
  | 'ClaimExam'
  | 'CommunityCare'
  | 'CompensationPension'
  | 'InPersonVA'
  | 'Phone'
  | 'VideoVA'
  | 'VideoAtlas'
  | 'VideoHome'
  | 'VideoGFE'

export const AppointmentDetailsTypeConstants: {
  ClaimExam: AppointmentDetailsScreenType
  CommunityCare: AppointmentDetailsScreenType
  CompensationPension: AppointmentDetailsScreenType
  InPersonVA: AppointmentDetailsScreenType
  Phone: AppointmentDetailsScreenType
  VideoVA: AppointmentDetailsScreenType
  VideoAtlas: AppointmentDetailsScreenType
  VideoHome: AppointmentDetailsScreenType
  VideoGFE: AppointmentDetailsScreenType
} = {
  ClaimExam: 'ClaimExam',
  CommunityCare: 'CommunityCare',
  CompensationPension: 'CompensationPension',
  InPersonVA: 'InPersonVA',
  Phone: 'Phone',
  VideoVA: 'VideoVA',
  VideoAtlas: 'VideoAtlas',
  VideoHome: 'VideoHome',
  VideoGFE: 'VideoGFE',
}

export type AppointmentDetailsSubType =
  | 'Pending'
  | 'Past'
  | 'Upcoming'
  | 'Canceled'
  | 'CanceledAndPending'
  | 'PastPending'

export const AppointmentDetailsSubTypeConstants: {
  Pending: AppointmentDetailsSubType
  Past: AppointmentDetailsSubType
  Upcoming: AppointmentDetailsSubType
  Canceled: AppointmentDetailsSubType
  CanceledAndPending: AppointmentDetailsSubType
  PastPending: AppointmentDetailsSubType
} = {
  Pending: 'Pending',
  Past: 'Past',
  Upcoming: 'Upcoming',
  Canceled: 'Canceled',
  CanceledAndPending: 'CanceledAndPending',
  PastPending: 'PastPending',
}
