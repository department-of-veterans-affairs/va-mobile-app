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
  ScreenIDTypesConstants,
} from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, DefaultList, DefaultListItemObj, LoadingComponent, Pagination, PaginationProps, TextLine, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType, getAppointmentsInDateRange } from 'store/actions'
import { VATheme } from 'styles/theme'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
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

const getListItemsForAppointments = (listOfAppointments: AppointmentsList, t: TFunction, onAppointmentPress: (appointmentID: string) => void): Array<DefaultListItemObj> => {
  const listItems: Array<DefaultListItemObj> = []

  _.forEach(listOfAppointments, (appointment) => {
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

    listItems.push({ textLines, onPress: () => onAppointmentPress(appointment.id), a11yHintText: t('appointments.viewDetails'), testId: getTestIDFromTextLines(textLines) })
  })

  return listItems
}

export const getGroupedAppointments = (
  appointmentsByYear: AppointmentsGroupedByYear,
  theme: VATheme,
  t: TFunction,
  onAppointmentPress: (appointmentID: string) => void,
  isReverseSort: boolean,
): ReactNode => {
  if (!appointmentsByYear) {
    return <></>
  }

  const sortedYears = _.keys(appointmentsByYear).sort()
  if (isReverseSort) {
    sortedYears.reverse()
  }

  const yearsToSortedMonths = getYearsToSortedMonths(appointmentsByYear, isReverseSort)

  return _.map(sortedYears, (year) => {
    return _.map(yearsToSortedMonths[year], (month) => {
      const listOfAppointments = appointmentsByYear[year][month]
      const listItems = getListItemsForAppointments(listOfAppointments, t, onAppointmentPress)

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
  const dispatch = useDispatch()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { upcomingAppointmentsByYear, loading, upcomingPageMetaData } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const onUpcomingAppointmentPress = (appointmentID: string): void => {
    navigateTo('UpcomingAppointmentDetails', { appointmentID })()
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  if (_.isEmpty(upcomingAppointmentsByYear)) {
    return <NoAppointments subText={t('noAppointments.youCanSchedule')} subTextA11yLabel={t('noAppointments.youCanScheduleA11yLabel')} />
  }

  const requestPage = (requestedPage: number) => {
    const todaysDate = DateTime.local()
    const sixMonthsFromToday = todaysDate.plus({ months: 6 })
    dispatch(
      getAppointmentsInDateRange(
        todaysDate.startOf('day').toISO(),
        sixMonthsFromToday.endOf('day').toISO(),
        TimeFrameType.UPCOMING,
        requestedPage,
        ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID,
      ),
    )
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const page = upcomingPageMetaData?.currentPage || 1
  const paginationProps: PaginationProps = {
    onNext: () => {
      requestPage(page + 1)
    },
    onPrev: () => {
      requestPage(page - 1)
    },
    totalEntries: upcomingPageMetaData?.totalEntries || 0,
    pageSize: upcomingPageMetaData?.perPage || 0,
    page,
  }

  return (
    <Box {...testIdProps('', false, 'Upcoming-appointments-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('upcomingAppointments.confirmedApptsDisplayed'))} accessible={true}>
        <TextView variant="MobileBody">{t('upcomingAppointments.confirmedApptsDisplayed')}</TextView>
      </Box>
      {getGroupedAppointments(upcomingAppointmentsByYear || {}, theme, t, onUpcomingAppointmentPress, false)}
      <Box flex={1} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments
