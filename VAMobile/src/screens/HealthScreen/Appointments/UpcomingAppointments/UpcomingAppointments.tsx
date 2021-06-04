import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'

import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  AppointmentStatusConstants,
  AppointmentType,
  AppointmentTypeConstants,
  AppointmentTypeToID,
  AppointmentsGroupedByYear,
  AppointmentsList,
  AppointmentsMetaPagination,
  ScreenIDTypesConstants,
} from 'store/api/types'
import { AppointmentsDateRange, TimeFrameType, getAppointmentsInDateRange } from 'store/actions'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, DefaultList, DefaultListItemObj, LoadingComponent, Pagination, PaginationProps, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { getUpcomingAppointmentDateRange } from '../Appointments'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoAppointments from '../NoAppointments/NoAppointments'

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
        const d1 = DateTime.fromISO(a.attributes.startDateUtc)
        const d2 = DateTime.fromISO(b.attributes.startDateUtc)
        return isReverseSort ? d2.toSeconds() - d1.toSeconds() : d1.toSeconds() - d2.toSeconds()
      })
    })
  })

  return yearToSortedMonths
}

const getListItemsForAppointments = (
  listOfAppointments: AppointmentsList,
  translations: { t: TFunction; tc: TFunction },
  onAppointmentPress: (appointmentID: string) => void,
  upcomingPageMetaData: AppointmentsMetaPagination,
  groupIdx: number,
): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []
  const { t, tc } = translations
  const { currentPage, perPage, totalEntries } = upcomingPageMetaData

  _.forEach(listOfAppointments, (appointment, index) => {
    const { attributes } = appointment
    const { startDateUtc, timeZone, appointmentType, location } = attributes

    const textLines: Array<TextLine> = [
      { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
      { text: t('common:text.raw', { text: getAppointmentLocation(appointmentType, location.name, t) }) },
    ]

    if (attributes.status === AppointmentStatusConstants.CANCELLED) {
      textLines.push({ text: t('appointments.canceled'), variant: 'MobileBodyBold', color: 'error' })
    }

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
      const listItems = getListItemsForAppointments(listOfAppointments, translations, onAppointmentPress, upcomingPageMetaData, groupIdx)
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

type UpcomingAppointmentsProps = Record<string, unknown>

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const tc = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { currentPageUpcomingAppointmentsByYear, loading, upcomingPageMetaData } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const onUpcomingAppointmentPress = (appointmentID: string): void => {
    navigateTo('UpcomingAppointmentDetails', { appointmentID })()
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  if (_.isEmpty(currentPageUpcomingAppointmentsByYear)) {
    return <NoAppointments subText={t('noAppointments.youCanSchedule')} subTextA11yLabel={t('noAppointments.youCanScheduleA11yLabel')} />
  }

  const requestPage = (requestedPage: number) => {
    const upcomingRange: AppointmentsDateRange = getUpcomingAppointmentDateRange()
    dispatch(getAppointmentsInDateRange(upcomingRange.startDate, upcomingRange.endDate, TimeFrameType.UPCOMING, requestedPage, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const { currentPage, perPage, totalEntries } = upcomingPageMetaData
  const paginationProps: PaginationProps = {
    onNext: () => {
      requestPage(currentPage + 1)
    },
    onPrev: () => {
      requestPage(currentPage - 1)
    },
    totalEntries: totalEntries,
    pageSize: perPage,
    page: currentPage,
  }

  return (
    <Box {...testIdProps('', false, 'Upcoming-appointments-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('upcomingAppointments.confirmedApptsDisplayed'))} accessible={true}>
        <TextView variant="MobileBody">{t('upcomingAppointments.confirmedApptsDisplayed')}</TextView>
      </Box>
      {getGroupedAppointments(currentPageUpcomingAppointmentsByYear || {}, theme, { t, tc }, onUpcomingAppointmentPress, false, upcomingPageMetaData)}
      <Box flex={1} mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments
