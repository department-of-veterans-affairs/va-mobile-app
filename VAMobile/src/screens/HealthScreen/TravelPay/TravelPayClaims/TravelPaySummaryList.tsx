import React, { RefObject, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { DateTime } from 'luxon'

import { useTravelPayClaims } from 'api/travelPay'
import { TravelPayClaimData } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  LoadingComponent,
  Pagination,
  PaginationProps,
  TextLine,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  capitalizeFirstLetter,
  getFormattedDateOrTimeWithFormatOption,
  getFormattedTimeNoTimeZone,
} from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPaySummaryListProps = {
  scrollViewRef: RefObject<ScrollView>
}

export default function TravelPaySummaryList({ scrollViewRef }: TravelPaySummaryListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [page, setPage] = useState(1)
  const { data: summariesPayload, isLoading: isLoadingSummaries } = useTravelPayClaims({ startDate: '', endDate: '' })
  const [summariesToShow, setSummariesToShow] = useState<Array<TravelPayClaimData>>([])

  const summaries = summariesPayload?.data

  const metadata = summariesPayload?.meta
  const { perPage, totalEntries } = {
    perPage: 10,
    totalEntries: metadata?.totalRecordCount || 0,
  }

  useEffect(() => {
    const summaryList = summaries?.slice((page - 1) * perPage, page * perPage)
    setSummariesToShow(summaryList || [])
  }, [summaries, page, perPage])

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    summariesToShow?.forEach((summary) => {
      const { attributes } = summary
      const { appointmentDateTime, claimStatus } = attributes

      const textLines: Array<TextLine> = []

      const dateString = getFormattedDateOrTimeWithFormatOption(appointmentDateTime, DateTime.DATE_FULL, undefined, {
        weekday: 'long',
      }) // TODO: SC - timezone?
      const timeString = getFormattedTimeNoTimeZone(appointmentDateTime) // TODO: SC - formatting
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine1', { date: dateString }),
        variant: 'MobileBodyBold',
      })
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine2', { time: timeString }),
        variant: 'MobileBodyBold',
      })
      textLines.push({ text: t('travelPay.statusList.claimStatus', { status: capitalizeFirstLetter(claimStatus) }) })

      const a11yValue = `test-a11y`

      listItems.push({
        textLines,
        a11yValue,
        onPress: () => {},
        testId: 'test',
      })
    })

    return listItems
  }

  if (isLoadingSummaries) {
    return <LoadingComponent text={t('travelPay.statusList.loadingClaims')} />
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
  }

  return (
    <Box>
      <DefaultList items={getListItemVals()} />
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}
