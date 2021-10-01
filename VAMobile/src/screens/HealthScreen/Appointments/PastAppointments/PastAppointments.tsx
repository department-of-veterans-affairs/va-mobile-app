import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useState } from 'react'

import _ from 'underscore'

import { AppointmentStatusConstants, AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, Pagination, PaginationProps, TextLineWithIconProps, VAModalPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/appointments'
import { getAppointmentLocation, getAppointmentTypeIcon, getGroupedAppointments, getYearsToSortedMonths } from 'utils/appointments'
import { getAppointmentsInDateRange } from 'store/actions'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoAppointments from '../NoAppointments/NoAppointments'

type PastAppointmentsProps = Record<string, unknown>

const PastAppointments: FC<PastAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const tc = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { currentPageAppointmentsByYear, loading, paginationByTimeFrame } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

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
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(fiveMonthsEarlier), date2: getMMMyyyy(threeMonthsEarlier.endOf('month').endOf('day')) }),
        dates: { startDate: fiveMonthsEarlier, endDate: threeMonthsEarlier },
        timeFrame: TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: t('pastAppointments.eightMonthsToSixMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(eightMonthsEarlier), date2: getMMMyyyy(sixMonthsEarlier) }),
        dates: { startDate: eightMonthsEarlier, endDate: sixMonthsEarlier },
        timeFrame: TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: t('pastAppointments.elevenMonthsToNineMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(elevenMonthsEarlier), date2: getMMMyyyy(nineMonthsEarlier) }),
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
  const { timeFrame } = datePickerOption
  const currentPagePastAppointmentsByYear = currentPageAppointmentsByYear[timeFrame]
  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const { currentPage, perPage, totalEntries } = paginationByTimeFrame[timeFrame]
  const onPastAppointmentPress = (appointmentID: string): void => {
    navigateTo('PastAppointmentDetails', { appointmentID })()
  }

  const listWithAppointmentsAdded = (listItems: Array<DefaultListItemObj>, listOfAppointments: AppointmentsList): Array<DefaultListItemObj> => {
    // for each appointment, retrieve its textLines and add it to the existing listItems
    _.forEach(listOfAppointments, (appointment, index) => {
      const {
        attributes: { appointmentType, startDateUtc, timeZone, phoneOnly, location, status, covidVaccination },
      } = appointment

      const textLines: Array<TextLineWithIconProps> = []

      if (status === AppointmentStatusConstants.CANCELLED) {
        textLines.push({ text: t('appointments.canceled'), isTextTag: true })
      }

      textLines.push(
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(startDateUtc, timeZone) }), variant: 'MobileBodyBold' },
        {
          text: t('common:text.raw', { text: getAppointmentLocation(appointmentType, location.name, t, phoneOnly, covidVaccination) }),
          iconProps: getAppointmentTypeIcon(appointmentType, phoneOnly, theme),
        },
      )

      const position = (currentPage - 1) * perPage + index + 1
      const a11yValue = tc('common:listPosition', { position, total: totalEntries })

      listItems.push({
        textLines,
        a11yValue,
        onPress: () => onPastAppointmentPress(appointment.id),
        a11yHintText: t('appointments.viewDetails'),
        testId: getTestIDFromTextLines(textLines),
      })
    })

    return listItems
  }

  const getAppointmentsPastThreeMonths = (): ReactNode => {
    if (!currentPagePastAppointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(currentPagePastAppointmentsByYear).sort().reverse()
    const yearsToSortedMonths = getYearsToSortedMonths(currentPagePastAppointmentsByYear, true)

    let listItems: Array<DefaultListItemObj> = []

    _.forEach(sortedYears, (year) => {
      _.forEach(yearsToSortedMonths[year], (month) => {
        const listOfAppointments = currentPagePastAppointmentsByYear[year][month]
        listItems = listWithAppointmentsAdded(listItems, listOfAppointments)
      })
    })

    return <DefaultList items={listItems} title={t('pastAppointments.pastThreeMonths')} />
  }

  const getAppointmentsInSelectedRange = (curSelectedRange: PastAppointmentsDatePickerOption, selectedPage: number): void => {
    dispatch(
      getAppointmentsInDateRange(
        curSelectedRange.dates.startDate.startOf('day').toISO(),
        curSelectedRange.dates.endDate.endOf('day').toISO(),
        curSelectedRange.timeFrame,
        selectedPage,
        ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID,
      ),
    )
  }

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setDatePickerOption(curSelectedRange)
      getAppointmentsInSelectedRange(curSelectedRange, 1)
    }
  }

  const isPastThreeMonths = datePickerOption.timeFrame === TimeFrameTypeConstants.PAST_THREE_MONTHS

  const getAppointmentData = (): ReactNode => {
    const appointmentsDoNotExist = !currentPagePastAppointmentsByYear || _.isEmpty(currentPagePastAppointmentsByYear)

    if (appointmentsDoNotExist) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <NoAppointments subText={t('noAppointments.youDontHaveForDates')} />
        </Box>
      )
    }

    return isPastThreeMonths
      ? getAppointmentsPastThreeMonths()
      : getGroupedAppointments(currentPagePastAppointmentsByYear || {}, theme, { t, tc }, onPastAppointmentPress, true, paginationByTimeFrame[timeFrame])
  }

  if (useError(ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  const requestPage = (requestedPage: number) => {
    getAppointmentsInSelectedRange(datePickerOption, requestedPage)
  }

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
    <Box {...testIdProps('', false, 'Past-appointments-page')}>
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <VAModalPicker
          selectedValue={datePickerOption.value}
          onSelectionChange={setValuesOnPickerSelect}
          pickerOptions={pickerOptions}
          labelKey={'health:pastAppointments.selectADateRange'}
        />
      </Box>
      {getAppointmentData()}
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default PastAppointments
