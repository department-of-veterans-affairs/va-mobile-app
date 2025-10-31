import React, { RefObject, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { AppointmentData, AppointmentsDateRange, AppointmentsGetData } from 'api/types'
import { AlertWithHaptics, Box, LoadingComponent, Pagination, PaginationProps, VAModalPicker } from 'components'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameDropDatePickerValue } from 'constants/timeframes'
import NoAppointments from 'screens/HealthScreen/Appointments/NoAppointments/NoAppointments'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ErrorsState } from 'store/slices'
import { filterAppointments, getGroupedAppointments } from 'utils/appointments'
import { getPickerOptions } from 'utils/dateUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

type PastAppointmentsOldProps = {
  appointmentsData?: AppointmentsGetData
  loading: boolean
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setDateRange: React.Dispatch<React.SetStateAction<AppointmentsDateRange>>
  setTimeFrame: React.Dispatch<React.SetStateAction<TimeFrameType>>
  scrollViewRef: RefObject<ScrollView>
}

function PastAppointmentsOld({
  appointmentsData,
  loading,
  page,
  setPage,
  setDateRange,
  setTimeFrame,
  scrollViewRef,
}: PastAppointmentsOldProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

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

  type PastAppointmentsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
    dates: TimeFrameDropDatePickerValue
    timeFrame: TimeFrameType
  }

  const getPastAppointmentsPickerOptions = (): Array<PastAppointmentsDatePickerOption> => {
    const pickerOptions = getPickerOptions(t, {
      dateRangeA11yLabelTKey: 'pastAppointments.dateRangeA11yLabel',
      allOfTKey: 'pastAppointments.allOf',
      pastThreeMonthsTKey: 'pastAppointments.pastThreeMonths',
    })
      // Filter out the fourteen to twelve months option because it is not part of the past appointments time frames
      .filter((option) => option.value !== TimeFrameTypeConstants.PAST_FOURTEEN_TO_TWELVE_MONTHS)
      .map((option) => ({
        ...option,
        value: option.label,
        timeFrame: option.value as TimeFrameType, // We know the value is a TimeFrameType because we filtered out the fourteen to twelve months option
        testID: undefined, // We must pass undefined here to prevent the testID from being set to the a11y value and confusing screen readers
      }))
    return pickerOptions
  }

  const pickerOptions = getPastAppointmentsPickerOptions()
  const [datePickerOption, setDatePickerOption] = useState(pickerOptions[0])

  const filteredAppointments = useMemo(
    () =>
      datePickerOption.timeFrame === TimeFrameTypeConstants.PAST_THREE_MONTHS ||
      datePickerOption.timeFrame === TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR
        ? filterAppointments(appointmentsData?.data || [], true)
        : appointmentsData?.data,
    [appointmentsData?.data, datePickerOption],
  )

  const appointmentsToShow = useMemo(
    () => filteredAppointments?.slice((page - 1) * perPage, page * perPage) || [],
    [filteredAppointments, page, perPage],
  )

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      const startDate = curSelectedRange.dates.startDate.startOf('day').toISO()
      const endDate = curSelectedRange.dates.endDate.endOf('day').toISO()
      if (startDate && endDate) {
        setTimeFrame(curSelectedRange.timeFrame)
        setDateRange({ startDate: startDate, endDate: endDate })
        setPage(1)
      }
      setDatePickerOption(curSelectedRange)
    }
  }

  if (!appointmentsData || appointmentsData.data.length < 1) {
    return (
      <Box>
        <Box mx={theme.dimensions.gutter} accessible={true}>
          <VAModalPicker
            selectedValue={datePickerOption.value}
            onSelectionChange={setValuesOnPickerSelect}
            pickerOptions={pickerOptions}
            labelKey={'pastAppointments.selectADateRange'}
            testID="getDateRangeTestID"
          />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <NoAppointments subText={t('noAppointments.youDontHaveForDates')} showVAGovLink={false} />
        </Box>
      </Box>
    )
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
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <VAModalPicker
          selectedValue={datePickerOption.value}
          onSelectionChange={setValuesOnPickerSelect}
          pickerOptions={pickerOptions}
          labelKey={'pastAppointments.selectADateRange'}
          testID="getDateRangeTestID"
          confirmTestID="pastApptsDateRangeConfirmID"
          cancelTestID="pastApptsDateRangeCancelID"
        />
      </Box>
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
    </Box>
  )
}

export default PastAppointmentsOld
