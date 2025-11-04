import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { TravelPayClaimData } from 'api/types'
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
import { TimeFrameType } from 'constants/timeframes'
import { getTestIDFromTextLines } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { getPickerOptions } from 'utils/dateUtils'
import getEnv from 'utils/env'
import { getFormattedDateOrTimeWithFormatOption, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

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
  const pickerOptions = getPickerOptions(t, {
    dateRangeA11yLabelTKey: 'travelPay.statusList.dateRangeA11yLabel',
    allOfTKey: 'travelPay.statusList.allOf',
    pastThreeMonthsTKey: 'travelPay.statusList.dateRange.pastThreeMonths',
  }).map((option) => ({
    ...option,
    testID: undefined, // We must pass undefined here to prevent the testID from being set to the a11y value and confusing screen readers
  }))

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
        a11yHintText: t('travelPay.statusList.viewDetails'),
        // Due to weird implementation of the List component, we need to set the testID
        // to the a11y value so that screen readers can read the a11y value correctly
        testId: getTestIDFromTextLines(textLines),
        // The actual testID for the item is passed in as detoxTestID even though it is
        // not specifically for detox tests and can be used for unit tests
        detoxTestID: `claim_summary_${id}`,
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
    <>
      <Box mx={theme.dimensions.gutter} testID="travelPayClaimsListTestId">
        <VAModalPicker
          selectedValue={datePickerOption.value}
          onSelectionChange={(value) => {
            const found = pickerOptions.find((option) => option.value === value)
            if (found) {
              setDatePickerOption(found)
              setTimeFrame(found.value)
              setPage(1)
            }
          }}
          pickerOptions={pickerOptions}
          labelKey={'travelPay.statusList.selectADateRange'}
          testID="getDateRangeTestID"
        />
      </Box>
      <Box mx={theme.dimensions.gutter}>
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
    </>
  )
}

export default TravelPayClaimsList
