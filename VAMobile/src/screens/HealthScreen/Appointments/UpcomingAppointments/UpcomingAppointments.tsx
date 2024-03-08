import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentData, AppointmentsGetData } from 'api/types'
import { Box, LoadingComponent, Pagination, PaginationProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getGroupedAppointments } from 'utils/appointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import NoAppointments from '../NoAppointments/NoAppointments'

type UpcomingAppointmentsProps = {
  appointmentsData?: AppointmentsGetData
  loading: boolean
  setPage: React.Dispatch<React.SetStateAction<number>>
}

function UpcomingAppointments({ appointmentsData, loading, setPage }: UpcomingAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onUpcomingAppointmentPress = (appointment: AppointmentData): void => {
    navigateTo('UpcomingAppointmentDetails', { appointment })
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  if (!appointmentsData) {
    return (
      <NoAppointments
        subText={t('noAppointments.youCanSchedule')}
        subTextA11yLabel={a11yLabelVA(t('noAppointments.youCanSchedule'))}
      />
    )
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const pagination = appointmentsData.meta?.pagination || {
    currentPage: 1,
    perPage: 10,
    totalEntries: 0,
  }
  const { currentPage, perPage, totalEntries } = pagination
  const paginationProps: PaginationProps = {
    onNext: () => {
      setPage(currentPage + 1)
    },
    onPrev: () => {
      setPage(currentPage - 1)
    },
    totalEntries: totalEntries,
    pageSize: perPage,
    page: currentPage,
    tab: 'upcoming appointments',
  }

  return (
    <Box>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
        {t('upcomingAppointments.confirmedApptsDisplayed')}
      </TextView>
      {getGroupedAppointments(appointmentsData.data, theme, { t }, onUpcomingAppointmentPress, false, pagination)}
      <Box flex={1} mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments
