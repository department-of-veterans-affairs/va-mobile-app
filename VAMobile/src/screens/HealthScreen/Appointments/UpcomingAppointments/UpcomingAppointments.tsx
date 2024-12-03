import React, { RefObject, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useIsFocused } from '@react-navigation/native'

import { AppointmentData, AppointmentsGetData, AppointmentsList } from 'api/types'
import { Box, LoadingComponent, Pagination, PaginationProps, TextView } from 'components'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getGroupedAppointments } from 'utils/appointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import NoAppointments from '../NoAppointments/NoAppointments'

type UpcomingAppointmentsProps = {
  appointmentsData?: AppointmentsGetData
  loading: boolean
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  scrollViewRef: RefObject<ScrollView>
}

function UpcomingAppointments({ appointmentsData, loading, page, setPage, scrollViewRef }: UpcomingAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()
  const [appointmentsToShow, setAppointmentsToShow] = useState<AppointmentsList>([])

  const pagination = {
    currentPage: page,
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: appointmentsData?.meta?.pagination?.totalEntries || 0,
  }
  const { perPage, totalEntries } = pagination

  useEffect(() => {
    const appointmentsList = appointmentsData?.data.slice((page - 1) * perPage, page * perPage)
    setAppointmentsToShow(appointmentsList || [])
  }, [appointmentsData?.data, page, perPage])

  if (loading && isFocused) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  if (!appointmentsData || appointmentsData.data.length < 1) {
    return (
      <NoAppointments
        subText={t('noAppointments.youCanSchedule')}
        subTextA11yLabel={a11yLabelVA(t('noAppointments.youCanSchedule'))}
      />
    )
  }

  const onUpcomingAppointmentPress = (appointment: AppointmentData): void => {
    navigateTo('UpcomingAppointmentDetails', { appointment: appointment, page })
  }

  const paginationProps: PaginationProps = {
    onNext: () => {
      setPage(page + 1)
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
    },
    onPrev: () => {
      setPage(page - 1)
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
    },
    totalEntries,
    pageSize: perPage,
    page,
    tab: 'upcoming appointments',
  }

  return (
    <Box>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} testID="Test">
        {t('upcomingAppointments.confirmedApptsDisplayed')}
      </TextView>
      {getGroupedAppointments(appointmentsToShow, theme, { t }, onUpcomingAppointmentPress, false, pagination)}
      <Box flex={1} mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default UpcomingAppointments
