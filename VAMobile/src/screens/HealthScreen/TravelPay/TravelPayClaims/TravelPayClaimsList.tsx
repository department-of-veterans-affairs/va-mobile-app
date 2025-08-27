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
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { getFormattedDateOrTimeWithFormatOption, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

type TravelPayClaimsListProps = {
  claims: Array<TravelPayClaimData>
  isLoading: boolean
  scrollViewRef: RefObject<ScrollView>
  filter: string
  sortBy: string
}

const CLAIMS_PER_PAGE = 10

const getFilteredClaims = (
  claims: Array<TravelPayClaimData>,
  filter: string,
  sortBy: string
) => {
  const result = [...claims];

  return result;
}

function TravelPayClaimsList({
  claims,
  isLoading,
  scrollViewRef,
  filter,
  sortBy,
 }: TravelPayClaimsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [filteredClaims, setFilteredClaims] = useState<Array<TravelPayClaimData>>([]);
  const [claimsToShow, setClaimsToShow] = useState<Array<TravelPayClaimData>>([])
  const [page, setPage] = useState(1)

  const { perPage, totalEntries } = {
    perPage: CLAIMS_PER_PAGE,
    totalEntries: claimsToShow.length || 0,
  }

  useEffect(() => {
    setFilteredClaims(getFilteredClaims(claims, filter, sortBy));
  }, [claims, filter, sortBy])

  useEffect(() => {
    const summaryList = claims?.slice((page - 1) * perPage, page * perPage)
    setClaimsToShow(summaryList || [])
  }, [filteredClaims, page, perPage])

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
