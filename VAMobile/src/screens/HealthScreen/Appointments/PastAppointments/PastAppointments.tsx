import React, { RefObject, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { DateTime } from 'luxon'

import { AppointmentData, AppointmentsDateRange, AppointmentsGetData } from 'api/types'
import { AlertWithHaptics, Box, LoadingComponent, Pagination, PaginationProps } from 'components'
import DatePicker, { DatePickerRange } from 'components/DatePicker/DatePicker'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import NoAppointments from 'screens/HealthScreen/Appointments/NoAppointments/NoAppointments'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ErrorsState } from 'store/slices'
import {
  filterAppointments,
  getDatePickerRange,
  getGroupedAppointments,
  getPastAppointmentDateRange,
} from 'utils/appointments'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

type PastAppointmentsProps = {
  appointmentsData?: AppointmentsGetData
  dateRange: AppointmentsDateRange
  loading: boolean
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setDateRange: React.Dispatch<React.SetStateAction<AppointmentsDateRange>>
  setTimeFrame: React.Dispatch<React.SetStateAction<TimeFrameType>>
  scrollViewRef: RefObject<ScrollView>
}

function PastAppointments({
  appointmentsData,
  dateRange,
  loading,
  page,
  setPage,
  setDateRange,
  setTimeFrame,
  scrollViewRef,
}: PastAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const datePickerRange = getDatePickerRange(dateRange)

  const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const endTime =
    downtimeWindowsByFeature[DowntimeFeatureTypeConstants.travelPayFeatures]?.endTime?.toFormat('EEEE, fff')
  const includeTravelClaims = !travelPayInDowntime && featureEnabled('travelPaySMOC')

  const pagination = {
    currentPage: page,
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: appointmentsData?.meta?.pagination?.totalEntries || 0,
  }
  const { perPage, totalEntries } = pagination

  const filteredAppointments = useMemo(() => {
    const appointmentsToFilter = appointmentsData?.data.filter((appointment) => {
      const apptTime = DateTime.fromISO(appointment.attributes.startDateLocal)
      return apptTime >= datePickerRange.startDate && apptTime <= datePickerRange.endDate
    })

    if (datePickerRange.endDate.valueOf() === DateTime.local().endOf('day').valueOf())
      return filterAppointments(appointmentsToFilter || [], true)
    return appointmentsToFilter
  }, [appointmentsData?.data, datePickerRange])

  const appointmentsToShow = useMemo(
    () => filteredAppointments?.slice((page - 1) * perPage, page * perPage) || [],
    [filteredAppointments, page, perPage],
  )

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  const calcTimeFrame = (selectedDateRange: DatePickerRange) => {
    const todaysDate = DateTime.local().startOf('day')
    const dateDiff = todaysDate.diff(selectedDateRange.startDate, 'months').months

    // TODO: REMOVE
    console.log(dateDiff)

    if (dateDiff <= 3) return TimeFrameTypeConstants.PAST_THREE_MONTHS
    else if (dateDiff <= 6) return TimeFrameTypeConstants.PAST_SIX_MONTHS
    else if (dateDiff <= 9) return TimeFrameTypeConstants.PAST_NINE_MONTHS
    else if (dateDiff <= 12) return TimeFrameTypeConstants.PAST_ONE_YEAR
    else return TimeFrameTypeConstants.PAST_TWO_YEARS
  }

  const handleDatePickerApply = (selectedDateRange: DatePickerRange) => {
    const startDate = selectedDateRange.startDate.toISO()
    const endDate = selectedDateRange.endDate.toISO()
    if (startDate && endDate) {
      const timeFrame = calcTimeFrame(selectedDateRange)
      setTimeFrame(timeFrame)
      setDateRange({ startDate, endDate })
      setPage(1)
    }
  }

  const handleDatePickerReset = () => {
    setTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS)
    setDateRange(getPastAppointmentDateRange())
    setPage(1)
  }

  const onPastAppointmentPress = (appointment: AppointmentData): void => {
    navigateTo('PastAppointmentDetails', { appointment })
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
    totalEntries: totalEntries,
    pageSize: perPage,
    page,
    tab: 'past appointments',
  }

  return (
    <Box>
      <DatePicker
        labelKey={'pastAppointments.selectAPastDateRange'}
        initialDateRange={datePickerRange}
        minimumDate={DateTime.local().minus({ years: 2 })}
        maximumDate={DateTime.local()}
        onApply={handleDatePickerApply}
        onReset={handleDatePickerReset}
      />
      {travelPayInDowntime && featureEnabled('travelPaySMOC') && (
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <AlertWithHaptics
            variant="warning"
            header={t('travelPay.downtime.apptsTitle')}
            description={t('travelPay.downtime.message', { endTime })}
            descriptionA11yLabel={t('travelPay.downtime.message', { endTime })}
          />
        </Box>
      )}
      {!appointmentsData || appointmentsData.data.length < 1 ? (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <NoAppointments subText={t('noAppointments.youDontHaveForDates')} showVAGovLink={false} />
        </Box>
      ) : (
        <>
          {getGroupedAppointments(
            appointmentsToShow,
            theme,
            { t },
            onPastAppointmentPress,
            true,
            pagination,
            includeTravelClaims,
          )}
          <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
            <Pagination {...paginationProps} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default PastAppointments
