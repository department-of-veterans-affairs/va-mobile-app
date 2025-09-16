import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { TravelPayClaimData, TravelPayClaimsDateRange } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  LoadingComponent,
  Pagination,
  PaginationProps,
  TextLine,
  TextView,
  VAModalPicker,
} from 'components'
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType, TimeFrameTypeConstants } from 'constants/timeframes'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import {
  getFormattedDate,
  getFormattedDateOrTimeWithFormatOption,
  getFormattedTimeForTimeZone,
} from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { createTimeFrameDateRangeMap } from 'utils/travelPay'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

const getMMMyyyy = (date: DateTime): string => {
  return getFormattedDate(date.toISO(), 'MMM yyyy')
}

const getDateRange = (startDate: DateTime, endDate: DateTime): string => {
  return `${getMMMyyyy(startDate)} - ${getMMMyyyy(endDate)}`
}

type TravelPayClaimsDatePickerOption = {
  label: string
  value: TimeFrameType
  a11yLabel: string
  dates: TravelPayClaimsDateRange
}

const getPickerOptions = (t: TFunction): Array<TravelPayClaimsDatePickerOption> => {
  const map = createTimeFrameDateRangeMap()

  const pastThreeMonths = map[TimeFrameTypeConstants.PAST_THREE_MONTHS]
  const fiveMonthsToThreeMonths = map[TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS]
  const eightMonthsToSixMonths = map[TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS]
  const elevenMonthsToNineMonths = map[TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS]
  const pastAllCurrentYear = map[TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR]
  const pastAllLastYear = map[TimeFrameTypeConstants.PAST_ALL_LAST_YEAR]

  return [
    {
      label: t('travelPay.statusList.dateRange.pastThreeMonths'),
      value: TimeFrameTypeConstants.PAST_THREE_MONTHS,
      a11yLabel: t('travelPay.statusList.dateRange.pastThreeMonths'),
      dates: {
        startDate: pastThreeMonths.startDate.toISO(),
        endDate: pastThreeMonths.endDate.toISO(),
      },
    },
    {
      label: getDateRange(fiveMonthsToThreeMonths.startDate, fiveMonthsToThreeMonths.endDate),
      value: TimeFrameTypeConstants.PAST_FIVE_TO_THREE_MONTHS,
      a11yLabel: t('travelPay.statusList.dateRangeA11yLabel', {
        date1: getMMMyyyy(fiveMonthsToThreeMonths.startDate),
        date2: getMMMyyyy(fiveMonthsToThreeMonths.endDate),
      }),
      dates: {
        startDate: fiveMonthsToThreeMonths.startDate.toISO(),
        endDate: fiveMonthsToThreeMonths.endDate.toISO(),
      },
    },
    {
      label: getDateRange(eightMonthsToSixMonths.startDate, eightMonthsToSixMonths.endDate),
      value: TimeFrameTypeConstants.PAST_EIGHT_TO_SIX_MONTHS,
      a11yLabel: t('travelPay.statusList.dateRangeA11yLabel', {
        date1: getMMMyyyy(eightMonthsToSixMonths.startDate),
        date2: getMMMyyyy(eightMonthsToSixMonths.endDate),
      }),
      dates: {
        startDate: eightMonthsToSixMonths.startDate.toISO(),
        endDate: eightMonthsToSixMonths.endDate.toISO(),
      },
    },
    {
      label: getDateRange(elevenMonthsToNineMonths.startDate, elevenMonthsToNineMonths.endDate),
      value: TimeFrameTypeConstants.PAST_ELEVEN_TO_NINE_MONTHS,
      a11yLabel: t('travelPay.statusList.dateRangeA11yLabel', {
        date1: getMMMyyyy(elevenMonthsToNineMonths.startDate),
        date2: getMMMyyyy(elevenMonthsToNineMonths.endDate),
      }),
      dates: {
        startDate: elevenMonthsToNineMonths.startDate.toISO(),
        endDate: elevenMonthsToNineMonths.endDate.toISO(),
      },
    },
    {
      label: t('travelPay.statusList.allOf', { year: pastAllCurrentYear.startDate.year }),
      value: TimeFrameTypeConstants.PAST_ALL_CURRENT_YEAR,
      a11yLabel: t('travelPay.statusList.allOf', { year: pastAllCurrentYear.startDate.year }),
      dates: {
        startDate: pastAllCurrentYear.startDate.toISO(),
        endDate: pastAllCurrentYear.endDate.toISO(),
      },
    },
    {
      label: t('travelPay.statusList.allOf', { year: pastAllLastYear.startDate.year }),
      value: TimeFrameTypeConstants.PAST_ALL_LAST_YEAR,
      a11yLabel: t('travelPay.statusList.allOf', { year: pastAllLastYear.startDate.year }),
      dates: {
        startDate: pastAllLastYear.startDate.toISO(),
        endDate: pastAllLastYear.endDate.toISO(),
      },
    },
  ]
}

const getResultsText = (t: TFunction, numResults: number, pageStart: number, pageEnd: number) => {
  if (numResults === 0) {
    return t('travelPay.statusList.emptyResults', { numResults })
  }
  return t('travelPay.statusList.resultsText', { numResults, pageStart, pageEnd })
}

type TravelPayClaimsListProps = {
  claims: Array<TravelPayClaimData>
  isLoading: boolean
  setTimeFrame: React.Dispatch<React.SetStateAction<TimeFrameType>>
  onNext?: (page: number) => void
  onPrev?: (page: number) => void
  totalRecordCount: number
}

function TravelPayClaimsList({
  claims,
  isLoading,
  setTimeFrame,
  totalRecordCount,
  onNext,
  onPrev,
}: TravelPayClaimsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const pickerOptions = getPickerOptions(t)

  const [datePickerOption, setDatePickerOption] = useState(pickerOptions[0])

  const [claimsToShow, setClaimsToShow] = useState<Array<TravelPayClaimData>>([])
  const [page, setPage] = useState(1)

  const { perPage, totalEntries } = {
    perPage: DEFAULT_PAGE_SIZE,
    totalEntries: totalRecordCount,
  }
  const pageStart = (page - 1) * DEFAULT_PAGE_SIZE + 1
  const pageEnd = Math.min(page * DEFAULT_PAGE_SIZE, totalEntries)

  useEffect(() => {
    const summaryList = claims?.slice((page - 1) * perPage, page * perPage)
    setClaimsToShow(summaryList || [])
  }, [claims, page, perPage])

  const goToClaimDetails = (claimId: string) => {
    logAnalyticsEvent(Events.vama_webview(LINK_URL_TRAVEL_PAY_WEB_DETAILS, claimId))
    navigateTo('Webview', {
      url: LINK_URL_TRAVEL_PAY_WEB_DETAILS + claimId,
      displayTitle: t('travelPay.webview.claims.displayTitle'),
      loadingMessage: t('travelPay.webview.claims.loading'),
      useSSO: true,
      backButtonTestID: `webviewBack`,
    })
  }

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsToShow?.forEach((summary, index) => {
      const { attributes } = summary
      const { id, appointmentDateTime, claimStatus } = attributes

      const textLines: Array<TextLine> = []

      const dateString = getFormattedDateOrTimeWithFormatOption(appointmentDateTime, DateTime.DATE_FULL, undefined, {
        weekday: 'long',
      })

      const timeString = getFormattedTimeForTimeZone(appointmentDateTime)
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine1', { date: dateString }),
        variant: 'MobileBodyBold',
      })
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine2', { time: timeString }),
        variant: 'MobileBodyBold',
      })

      textLines.push({ text: t('travelPay.statusList.claimStatus', { status: claimStatus }) })

      const a11yValue = t('listPosition', { position: index + 1, total: totalEntries })

      listItems.push({
        textLines,
        a11yValue,
        onPress: () => goToClaimDetails(id),
        testId: `claim_summary_${id}`,
      })
    })

    return listItems
  }

  if (isLoading) {
    return <LoadingComponent text={t('travelPay.statusList.loading')} />
  }

  const paginationProps: PaginationProps = {
    onNext: () => {
      const nextPage = page + 1
      onNext?.(nextPage)
      setPage(nextPage)
    },
    onPrev: () => {
      const prevPage = page - 1
      onPrev?.(prevPage)
      setPage(prevPage)
    },
    totalEntries: totalEntries,
    pageSize: perPage,
    page,
  }

  return (
    <Box testID="travelPayClaimsListTestId">
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <VAModalPicker
          selectedValue={datePickerOption.value}
          onSelectionChange={(value) => {
            const found = pickerOptions.find((option) => option.value === value)
            if (found) {
              setDatePickerOption(found)
              setTimeFrame(found.value)
            }
          }}
          pickerOptions={pickerOptions}
          labelKey={'travelPay.statusList.selectADateRange'}
          testID="getDateRangeTestID"
        />
        <TextView my={theme.dimensions.lineItemSpacing} variant="MobileBodyBold">
          {getResultsText(t, totalEntries, pageStart, pageEnd)}
        </TextView>
      </Box>
      <DefaultList items={getListItemVals()} />
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        {!isLoading && <Pagination {...paginationProps} />}
      </Box>
    </Box>
  )
}

export default TravelPayClaimsList
