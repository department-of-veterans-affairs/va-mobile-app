import React, { RefObject, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { DateTime } from 'luxon'

import { AppointmentData, AppointmentsDateRange, AppointmentsGetData, AppointmentsList } from 'api/types'
import { Box, LoadingComponent, Pagination, PaginationProps, VAModalPicker } from 'components'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { getGroupedAppointments } from 'utils/appointments'
import { getFormattedDate } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import NoAppointments from '../NoAppointments/NoAppointments'

type PastAppointmentsProps = {
  appointmentsData?: AppointmentsGetData
  loading: boolean
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setDateRange: React.Dispatch<React.SetStateAction<AppointmentsDateRange>>
  setTimeFrame: React.Dispatch<
    React.SetStateAction<
      | 'upcoming'
      | 'pastThreeMonths'
      | 'pastFiveToThreeMonths'
      | 'pastEightToSixMonths'
      | 'pastElevenToNineMonths'
      | 'pastAllCurrentYear'
      | 'pastAllLastYear'
    >
  >
  scrollViewRef: RefObject<ScrollView>
}

function PastAppointments({
  appointmentsData,
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

  const getMMMyyyy = (date: DateTime): string => {
    return getFormattedDate(date.toISO(), 'MMM yyyy')
  }

  const getDateRange = (startDate: DateTime, endDate: DateTime): string => {
    return `${getMMMyyyy(startDate)} - ${getMMMyyyy(endDate)}`
  }

  type PastAppointmentsDatePickerValue = {
    startDate: DateTime
    endDate: DateTime
  }

  type PastAppointmentsDatePickerOption = {
    label: string
    value: string
    a11yLabel: string
    dates: PastAppointmentsDatePickerValue
    timeFrame: TimeFrameType
  }

  const getPickerOptions = (): Array<PastAppointmentsDatePickerOption> => {
    const todaysDate = DateTime.local()

    const fiveMonthsEarlier = todaysDate.minus({ months: 5 }).startOf('month').startOf('day')
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    const eightMonthsEarlier = todaysDate.minus({ months: 8 }).startOf('month').startOf('day')
    const sixMonthsEarlier = todaysDate.minus({ months: 6 }).endOf('month').endOf('day')

    const elevenMonthsEarlier = todaysDate.minus({ months: 11 }).startOf('month').startOf('day')
    const nineMonthsEarlier = todaysDate.minus({ months: 9 }).endOf('month').endOf('day')

    const currentYear = todaysDate.get('year')
    const firstDayCurrentYear = todaysDate.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })

    const lastYearDateTime = todaysDate.minus({ years: 1 })
    const lastYear = lastYearDateTime.get('year')
    const firstDayLastYear = lastYearDateTime.set({ month: 1, day: 1, hour: 0, minute: 0, millisecond: 0 })
    const lastDayLastYear = lastYearDateTime.set({ month: 12, day: 31, hour: 23, minute: 59, millisecond: 999 })

    return [
      {
        label: t('pastAppointments.pastThreeMonths'),
        value: t('pastAppointments.pastThreeMonths'),
        a11yLabel: t('pastAppointments.pastThreeMonths'),
        dates: { startDate: threeMonthsEarlier.startOf('day'), endDate: todaysDate.minus({ days: 1 }).endOf('day') },
        timeFrame: TimeFrameTypeConstants.PAST_THREE_MONTHS,
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier.endOf('month').endOf('day')),
        value: t('pastAppointments.fiveMonthsToThreeMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', {
          date1: getMMMyyyy(fiveMonthsEarlier),
          date2: getMMMyyyy(threeMonthsEarlier.endOf('month').endOf('day')),
        }),
        dates: { startDate: fiveMonthsEarlier, endDate: threeMonthsEarlier },
        timeFrame: TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: t('pastAppointments.eightMonthsToSixMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', {
          date1: getMMMyyyy(eightMonthsEarlier),
          date2: getMMMyyyy(sixMonthsEarlier),
        }),
        dates: { startDate: eightMonthsEarlier, endDate: sixMonthsEarlier },
        timeFrame: TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: t('pastAppointments.elevenMonthsToNineMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', {
          date1: getMMMyyyy(elevenMonthsEarlier),
          date2: getMMMyyyy(nineMonthsEarlier),
        }),
        dates: { startDate: elevenMonthsEarlier, endDate: nineMonthsEarlier },
        timeFrame: TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
      },
      {
        label: t('pastAppointments.allOf', { year: currentYear }),
        value: t('pastAppointments.allOf', { year: currentYear }),
        a11yLabel: t('pastAppointments.allOf', { year: currentYear }),
        dates: { startDate: firstDayCurrentYear, endDate: todaysDate.minus({ days: 1 }).endOf('day') },
        timeFrame: TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
      },
      {
        label: t('pastAppointments.allOf', { year: lastYear }),
        value: t('pastAppointments.allOf', { year: lastYear }),
        a11yLabel: t('pastAppointments.allOf', { year: lastYear }),
        dates: { startDate: firstDayLastYear, endDate: lastDayLastYear },
        timeFrame: TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      },
    ]
  }

  const pickerOptions = getPickerOptions()
  const [datePickerOption, setDatePickerOption] = useState(pickerOptions[0])

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
      {getGroupedAppointments(appointmentsToShow, theme, { t }, onPastAppointmentPress, true, pagination)}
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default PastAppointments
