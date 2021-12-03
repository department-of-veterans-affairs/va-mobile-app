import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'
import _ from 'underscore'

import { AppointmentsDateRange, getAppointmentsInDateRange } from 'store/actions'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, LoadingComponent, Pagination, PaginationProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { getGroupedAppointments } from 'utils/appointments'
import { getUpcomingAppointmentDateRange } from '../Appointments'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoAppointments from '../NoAppointments/NoAppointments'

type UpcomingAppointmentsProps = Record<string, unknown>

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const tc = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { currentPageAppointmentsByYear, loading, paginationByTimeFrame } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)
  const currentPageUpcomingAppointmentsByYear = currentPageAppointmentsByYear.upcoming

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
    dispatch(
      getAppointmentsInDateRange(upcomingRange.startDate, upcomingRange.endDate, TimeFrameTypeConstants.UPCOMING, requestedPage, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID),
    )
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const { currentPage, perPage, totalEntries } = paginationByTimeFrame.upcoming
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
      {getGroupedAppointments(currentPageUpcomingAppointmentsByYear || {}, theme, { t, tc }, onUpcomingAppointmentPress, false, paginationByTimeFrame.upcoming)}
      <Box flex={1} mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments
