import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useState } from 'react'

import _ from 'underscore'

import { AppointmentStatusConstants, AppointmentsList } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, Pagination, PaginationProps, TextLine, VAModalPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { TimeFrameType, getAppointmentsInDateRange } from 'store/actions'
import { getAppointmentLocation, getGroupedAppointments, getYearsToSortedMonths } from '../UpcomingAppointments/UpcomingAppointments'
import { getFormattedDate, getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoAppointments from '../NoAppointments/NoAppointments'

type PastAppointmentsProps = Record<string, unknown>

const PastAppointments: FC<PastAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { pastAppointmentsByYear, loading, pastPageMetaData } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

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
        dates: { startDate: threeMonthsEarlier.startOf('day'), endDate: todaysDate.minus({ day: 1 }).endOf('day') },
        timeFrame: TimeFrameType.PAST_THREE_MONTHS,
      },
      {
        label: getDateRange(fiveMonthsEarlier, threeMonthsEarlier.endOf('month').endOf('day')),
        value: t('pastAppointments.fiveMonthsToThreeMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(fiveMonthsEarlier), date2: getMMMyyyy(threeMonthsEarlier.endOf('month').endOf('day')) }),
        dates: { startDate: fiveMonthsEarlier, endDate: threeMonthsEarlier },
        timeFrame: TimeFrameType.PAST_FIVE_TO_THREE_MONTHS,
      },
      {
        label: getDateRange(eightMonthsEarlier, sixMonthsEarlier),
        value: t('pastAppointments.eightMonthsToSixMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(eightMonthsEarlier), date2: getMMMyyyy(sixMonthsEarlier) }),
        dates: { startDate: eightMonthsEarlier, endDate: sixMonthsEarlier },
        timeFrame: TimeFrameType.PAST_EIGHT_TO_SIX_MONTHS,
      },
      {
        label: getDateRange(elevenMonthsEarlier, nineMonthsEarlier),
        value: t('pastAppointments.elevenMonthsToNineMonths'),
        a11yLabel: t('pastAppointments.dateRangeA11yLabel', { date1: getMMMyyyy(elevenMonthsEarlier), date2: getMMMyyyy(nineMonthsEarlier) }),
        dates: { startDate: elevenMonthsEarlier, endDate: nineMonthsEarlier },
        timeFrame: TimeFrameType.PAST_ELEVEN_TO_NINE_MONTHS,
      },
      {
        label: t('pastAppointments.allOf', { year: currentYear }),
        value: t('pastAppointments.allOf', { year: currentYear }),
        a11yLabel: t('pastAppointments.allOf', { year: currentYear }),
        dates: { startDate: firstDayCurrentYear, endDate: todaysDate.minus({ day: 1 }).endOf('day') },
        timeFrame: TimeFrameType.PAST_ALL_CURRENT_YEAR,
      },
      {
        label: t('pastAppointments.allOf', { year: lastYear }),
        value: t('pastAppointments.allOf', { year: lastYear }),
        a11yLabel: t('pastAppointments.allOf', { year: lastYear }),
        dates: { startDate: firstDayLastYear, endDate: lastDayLastYear },
        timeFrame: TimeFrameType.PAST_ALL_LAST_YEAR,
      },
    ]
  }

  const pickerOptions = getPickerOptions()
  const [datePickerValue, setDatePickerValue] = useState(pickerOptions[0].value)
  const onPastAppointmentPress = (appointmentID: string): void => {
    navigateTo('PastAppointmentDetails', { appointmentID })()
  }

  const listWithAppointmentsAdded = (listItems: Array<DefaultListItemObj>, listOfAppointments: AppointmentsList): Array<DefaultListItemObj> => {
    // for each appointment, retrieve its textLines and add it to the existing listItems
    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment

      const textLines: Array<TextLine> = [
        { text: t('common:text.raw', { text: getFormattedDateWithWeekdayForTimeZone(attributes.startDateUtc, attributes.timeZone) }), variant: 'MobileBodyBold' },
        { text: t('common:text.raw', { text: getFormattedTimeForTimeZone(attributes.startDateUtc, attributes.timeZone) }), variant: 'MobileBodyBold' },
        { text: t('common:text.raw', { text: getAppointmentLocation(attributes.appointmentType, attributes.location.name, t) }) },
      ]

      if (attributes.status === AppointmentStatusConstants.CANCELLED) {
        textLines.push({ text: t('appointments.canceled'), variant: 'MobileBodyBold', color: 'error' })
      }

      listItems.push({ textLines, onPress: () => onPastAppointmentPress(appointment.id), a11yHintText: t('appointments.viewDetails'), testId: getTestIDFromTextLines(textLines) })
    })

    return listItems
  }

  const getAppointmentsPastThreeMonths = (): ReactNode => {
    if (!pastAppointmentsByYear) {
      return <></>
    }

    const sortedYears = _.keys(pastAppointmentsByYear).sort().reverse()
    const yearsToSortedMonths = getYearsToSortedMonths(pastAppointmentsByYear, true)

    let listItems: Array<DefaultListItemObj> = []

    _.forEach(sortedYears, (year) => {
      _.forEach(yearsToSortedMonths[year], (month) => {
        const listOfAppointments = pastAppointmentsByYear[year][month]
        listItems = listWithAppointmentsAdded(listItems, listOfAppointments)
      })
    })

    return <DefaultList items={listItems} title={t('pastAppointments.pastThreeMonths')} />
  }

  const getAppointmentsInSelectedRange = (pickerVal: string, selectedPage: number): void => {
    const currentDates = pickerOptions.find((el) => el.value === pickerVal)
    if (currentDates) {
      dispatch(
        getAppointmentsInDateRange(
          currentDates.dates.startDate.startOf('day').toISO(),
          currentDates.dates.endDate.endOf('day').toISO(),
          currentDates.timeFrame,
          selectedPage,
          ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID,
        ),
      )
    }
  }

  const setValuesOnPickerSelect = (selectValue: string): void => {
    setDatePickerValue(selectValue)
    getAppointmentsInSelectedRange(selectValue, 1)
  }

  const isPastThreeMonths = datePickerValue === t('pastAppointments.pastThreeMonths')

  const getAppointmentData = (): ReactNode => {
    const appointmentsDoNotExist = !pastAppointmentsByYear || _.isEmpty(pastAppointmentsByYear)

    if (appointmentsDoNotExist) {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <NoAppointments subText={t('noAppointments.youDontHaveForDates')} />
        </Box>
      )
    }

    return isPastThreeMonths ? getAppointmentsPastThreeMonths() : getGroupedAppointments(pastAppointmentsByYear || {}, theme, t, onPastAppointmentPress, true)
  }

  if (useError(ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PAST_APPOINTMENTS_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('appointments.loadingAppointments')} />
  }

  const requestPage = (requestedPage: number) => {
    getAppointmentsInSelectedRange(datePickerValue, requestedPage)
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const page = pastPageMetaData?.currentPage || 1
  const paginationProps: PaginationProps = {
    onNext: () => {
      requestPage(page + 1)
    },
    onPrev: () => {
      requestPage(page - 1)
    },
    totalEntries: pastPageMetaData?.totalEntries || 0,
    pageSize: pastPageMetaData?.perPage || 0,
    page,
  }

  return (
    <Box {...testIdProps('', false, 'Past-appointments-page')}>
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <VAModalPicker
          selectedValue={datePickerValue}
          onSelectionChange={setValuesOnPickerSelect}
          pickerOptions={pickerOptions}
          labelKey={'health:pastAppointments.selectADateRange'}
        />
      </Box>
      {getAppointmentData()}
      <Box flex={1} mt={theme.dimensions.textAndButtonLargeMargin} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default PastAppointments
