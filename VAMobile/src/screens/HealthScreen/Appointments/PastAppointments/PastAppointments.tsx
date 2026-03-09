import React, { RefObject, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { DateTime } from 'luxon'

import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import { AppointmentData, AppointmentsDateRange, AppointmentsGetData } from 'api/types'
import { AlertWithHaptics, Box, LoadingComponent, Pagination, PaginationProps, VAModalPicker } from 'components'
import DatePicker, { DatePickerRange } from 'components/DatePicker/DatePicker'
import { Events } from 'constants/analytics'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameDropDatePickerValue } from 'constants/timeframes'
import NoAppointments from 'screens/HealthScreen/Appointments/NoAppointments/NoAppointments'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  filterAppointments,
  getDatePickerRange,
  getGroupedAppointments,
  getPastAppointmentDateRange,
  getPastTimeFrame,
} from 'utils/appointments'
import { getPickerOptions } from 'utils/dateUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { useOfflineEventQueue } from 'utils/hooks/offline'
import { featureEnabled } from 'utils/remoteConfig'

type PastAppointmentsProps = {
  appointmentsData?: AppointmentsGetData
  dateRange: AppointmentsDateRange
  loading: boolean
  setDateRange: React.Dispatch<React.SetStateAction<AppointmentsDateRange>>
  setTimeFrame: React.Dispatch<React.SetStateAction<TimeFrameType>>
  scrollViewRef: RefObject<ScrollView>
}

type PastAppointmentsDatePickerOption = {
  label: string
  value: string
  a11yLabel: string
  dates: TimeFrameDropDatePickerValue
  timeFrame: TimeFrameType
}

function PastAppointments({
  appointmentsData,
  dateRange,
  loading,
  setDateRange,
  setTimeFrame,
  scrollViewRef,
}: PastAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  useOfflineEventQueue(ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID)
  const [page, setPage] = useState(1)
  const [onApplyClicked, setOnApplyClicked] = useState(false)
  const [invalidDateRange, setInvalidDateRange] = useState<DatePickerRange>()

  const useOldDatePicker = featureEnabled('useOldDatePicker')
  const datePickerRange = getDatePickerRange(dateRange)

  const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)
  const { maintenanceWindows } = useMaintenanceWindows()
  const endTime = maintenanceWindows?.[DowntimeFeatureTypeConstants.travelPayFeatures]?.endTime?.toFormat('EEEE, fff')

  useEffect(() => {
    if (onApplyClicked) {
      setOnApplyClicked(false)
    }
  }, [onApplyClicked])

  const getPastAppointmentsPickerOptions = (): Array<PastAppointmentsDatePickerOption> => {
    const pickerOptions = getPickerOptions(t, {
      dateRangeA11yLabelTKey: 'pastAppointments.dateRangeA11yLabel',
      allOfTKey: 'pastAppointments.allOf',
      pastThreeMonthsTKey: 'pastAppointments.pastThreeMonths',
    }).map((option) => ({
      ...option,
      value: option.label,
      timeFrame: option.value as TimeFrameType, // We know the value is a TimeFrameType because we filtered out the fourteen to twelve months option
      testID: option.a11yLabel, // testID is used as both test id and accessibility label
    }))
    return pickerOptions
  }

  const pickerOptions = getPastAppointmentsPickerOptions()
  const [datePickerOption, setDatePickerOption] = useState(pickerOptions[0])

  const filteredAppointments = useMemo(() => {
    if (useOldDatePicker) {
      return datePickerOption.timeFrame === TimeFrameTypeConstants.PAST_THREE_MONTHS ||
        datePickerOption.timeFrame === TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR
        ? filterAppointments(appointmentsData?.data || [], true)
        : appointmentsData?.data
    }
    return filterAppointments(appointmentsData?.data || [], true, datePickerRange)
  }, [appointmentsData?.data, datePickerOption, datePickerRange, useOldDatePicker])

  const pagination = {
    currentPage: page,
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: filteredAppointments?.length || 0,
  }
  const { perPage, totalEntries } = pagination

  const appointmentsToShow = useMemo(
    () => filteredAppointments?.slice((page - 1) * perPage, page * perPage) || [],
    [filteredAppointments, page, perPage],
  )

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

  const handleDatePickerApply = (selectedDateRange: DatePickerRange, isValid: boolean) => {
    if (isValid) {
      const startDate = selectedDateRange.startDate.toISO()
      const endDate = selectedDateRange.endDate.toISO()
      if (startDate && endDate) {
        const calculatedTimeFrame = getPastTimeFrame(selectedDateRange)
        logAnalyticsEvent(Events.vama_appt_time_frame(calculatedTimeFrame))

        const timeFrameToQuery =
          calculatedTimeFrame === TimeFrameTypeConstants.PAST_ONE_MONTH
            ? TimeFrameTypeConstants.PAST_THREE_MONTHS
            : calculatedTimeFrame

        setTimeFrame(timeFrameToQuery)
        setDateRange({ startDate, endDate })
        setInvalidDateRange(undefined)
        setPage(1)
      }
    } else {
      setInvalidDateRange(selectedDateRange)
    }
    setOnApplyClicked(true)
  }

  const handleDatePickerReset = () => {
    setInvalidDateRange(undefined)
    setTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS)
    setDateRange(getPastAppointmentDateRange())
    setPage(1)
  }

  const getDatePicker = () => {
    if (useOldDatePicker) {
      return (
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
      )
    }
    return (
      <DatePicker
        labelKey={'pastAppointments.selectAPastDateRange'}
        initialDateRange={invalidDateRange || datePickerRange}
        minimumDate={DateTime.local().minus({ years: 2 })}
        maximumDate={DateTime.local()}
        useSecondaryApplyButton={featureEnabled('startScheduling')}
        onApply={handleDatePickerApply}
        onReset={handleDatePickerReset}
      />
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

  const renderNoAppointments = () => {
    logAnalyticsEvent(Events.vama_appt_empty_range)
    return <NoAppointments subText={t('noAppointments.youDontHaveForDates')} showVAGovLink={false} />
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  return (
    <Box>
      {invalidDateRange && (
        <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <AlertWithHaptics
            variant="error"
            header={t('datePicker.error.header')}
            description={t('datePicker.error.message')}
            focusOnError={onApplyClicked}
            scrollViewRef={scrollViewRef}
          />
        </Box>
      )}
      {getDatePicker()}
      {travelPayInDowntime && (
        <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <AlertWithHaptics
            variant="warning"
            header={t('travelPay.downtime.apptsTitle')}
            description={t('travelPay.downtime.message', { endTime })}
            descriptionA11yLabel={t('travelPay.downtime.message', { endTime })}
          />
        </Box>
      )}
      {!filteredAppointments || filteredAppointments.length < 1 ? (
        renderNoAppointments()
      ) : (
        <>
          {getGroupedAppointments(
            appointmentsToShow,
            theme,
            { t },
            onPastAppointmentPress,
            true,
            pagination,
            !travelPayInDowntime,
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
