import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DateTime } from 'luxon'

import { TravelPayClaimData } from 'api/types'
import { Box, DefaultList, DefaultListItemObj, Pagination, PaginationProps, TextLine } from 'components'
import { Events } from 'constants/analytics'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { getTestIDFromTextLines } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { getFormattedDateOrTimeWithFormatOption, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

type TravelPayClaimsListProps = {
  claims: Array<TravelPayClaimData>
  currentPage: number
  onNext?: (page: number) => void
  onPrev?: (page: number) => void
}

export const CLAIMS_PER_PAGE = 10

function TravelPayClaimsList({ claims, currentPage, onNext, onPrev }: TravelPayClaimsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [claimsToShow, setClaimsToShow] = useState<Array<TravelPayClaimData>>([])

  const perPage = DEFAULT_PAGE_SIZE
  const totalEntries = claims.length

  useEffect(() => {
    const summaryList = claims?.slice((currentPage - 1) * perPage, currentPage * perPage)
    setClaimsToShow(summaryList || [])
  }, [claims, currentPage, perPage])

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

  const paginationProps: PaginationProps = {
    onNext: () => {
      const nextPage = currentPage + 1
      onNext?.(nextPage)
    },
    onPrev: () => {
      const prevPage = currentPage - 1
      onPrev?.(prevPage)
    },
    totalEntries,
    pageSize: perPage,
    page: currentPage,
  }

  return (
    <Box testID="travelPayClaimsListTestId">
      <DefaultList items={getListItemVals()} />
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default TravelPayClaimsList
