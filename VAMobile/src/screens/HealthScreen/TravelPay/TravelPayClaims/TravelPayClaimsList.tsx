import React, { RefObject, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

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
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getTestIDFromTextLines } from 'utils/accessibility'
import {
  capitalizeFirstLetter,
  getFormattedDateOrTimeWithFormatOption,
  getFormattedTimeForTimeZone,
} from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimsListProps = {
  claims: Array<TravelPayClaimData>
  isLoading: boolean
  filter: string // TODO: will change in next ticket
  sortBy: string // TODO: will change in next ticket
  scrollViewRef: RefObject<ScrollView>
}

function TravelPayClaimsList({
  claims,
  isLoading,
  filter: _filter,
  sortBy: _sortBy,
  scrollViewRef,
}: TravelPayClaimsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [claimsToShow, setClaimsToShow] = useState<Array<TravelPayClaimData>>([])
  const [page, setPage] = useState(1)

  const { perPage, totalEntries } = {
    perPage: 10,
    totalEntries: claims.length || 0,
  }

  useEffect(() => {
    const summaryList = claims?.slice((page - 1) * perPage, page * perPage)
    setClaimsToShow(summaryList || [])
  }, [claims, page, perPage])

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsToShow?.forEach((summary, index) => {
      const { attributes } = summary
      const { appointmentDateTime, claimStatus } = attributes

      const textLines: Array<TextLine> = []

      const dateString = getFormattedDateOrTimeWithFormatOption(appointmentDateTime, DateTime.DATE_FULL, undefined, {
        weekday: 'long',
      }) // TODO: do we want to show timezone here?

      const timeString = getFormattedTimeForTimeZone(appointmentDateTime) // TODO: SC - formatting possibly without timezone per specs
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine1', { date: dateString }),
        variant: 'MobileBodyBold',
      })
      textLines.push({
        text: t('travelPay.statusList.appointmentDateLine2', { time: timeString }),
        variant: 'MobileBodyBold',
      })

      // TODO: does 'claim status' need to be first translated into display friendly enum string?
      textLines.push({ text: t('travelPay.statusList.claimStatus', { status: capitalizeFirstLetter(claimStatus) }) })

      const a11yValue = t('listPosition', { position: index + 1, total: totalEntries }) // TODO: add "travel claims" or something here?

      listItems.push({
        textLines,
        a11yValue,
        onPress: () => {}, // TODO: go to claim details
        testId: getTestIDFromTextLines(textLines),
      })
    })

    return listItems
  }

  if (isLoading) {
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
    <Box testID="travelPayClaimsListTestId">
      <DefaultList items={getListItemVals()} />
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default TravelPayClaimsList
