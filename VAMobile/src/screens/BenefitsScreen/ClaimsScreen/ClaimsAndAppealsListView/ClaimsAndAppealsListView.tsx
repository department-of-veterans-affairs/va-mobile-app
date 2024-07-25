import React, { RefObject, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDecisionLetters } from 'api/decisionLetters'
import { ClaimOrAppealConstants, ClaimsAndAppealsList } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  LabelTagTypeConstants,
  LoadingComponent,
  Pagination,
  PaginationProps,
  TextLine,
} from 'components'
import { ClaimType } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

import NoClaimsAndAppeals from '../NoClaimsAndAppeals/NoClaimsAndAppeals'

type ClaimsAndAppealsListProps = {
  claimType: ClaimType
  scrollViewRef: RefObject<ScrollView>
}

function ClaimsAndAppealsListView({ claimType, scrollViewRef }: ClaimsAndAppealsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const [page, setPage] = useState(1)
  const [previousClaimType, setClaimType] = useState(claimType)
  const { data: claimsAndAppealsListPayload, isLoading: loadingClaimsAndAppeals } = useClaimsAndAppeals(claimType)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: decisionLetterData } = useDecisionLetters()
  const [claimsToShow, setClaimsToShow] = useState<Array<ClaimsAndAppealsList>>([])

  const claimsAndAppeals = claimsAndAppealsListPayload?.data
  const pageMetaData = claimsAndAppealsListPayload?.meta.pagination
  const { perPage, totalEntries } = {
    perPage: 10,
    totalEntries: pageMetaData?.totalEntries || 0,
  }

  useEffect(() => {
    const claimsList = claimsAndAppeals?.slice((page - 1) * perPage, page * perPage)
    setClaimsToShow(claimsList || [])
  }, [claimsAndAppeals, page, perPage])

  useEffect(() => {
    if (previousClaimType !== claimType) {
      setClaimType(claimType)
      setPage(1)
    }
  }, [claimType, previousClaimType])

  const onClaimDetails = (id: string) => {
    navigateTo('ClaimDetailsScreen', { claimID: id, claimType })
  }

  const onAppealDetails = (id: string) => {
    navigateTo('AppealDetailsScreen', { appealID: id })
  }

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsToShow?.forEach((claimAndAppeal, index) => {
      const { type, attributes, id } = claimAndAppeal

      const textLines: Array<TextLine> = [{ text: capitalizeWord(attributes.displayTitle), variant: 'MobileBodyBold' }]

      if (
        featureEnabled('decisionLettersWaygate') &&
        userAuthorizedServices?.decisionLetters &&
        attributes.decisionLetterSent &&
        (decisionLetterData?.data.length || 0) > 0
      ) {
        const margin = theme.dimensions.condensedMarginBetween
        textLines.push({
          text: t('claims.decisionLetterReady'),
          textTag: { labelType: LabelTagTypeConstants.tagBlue },
          mt: margin,
          mb: margin,
        })
      } else if (attributes.documentsNeeded) {
        const margin = theme.dimensions.condensedMarginBetween
        textLines.push({
          text: t('claims.moreInfoNeeded'),
          textTag: { labelType: LabelTagTypeConstants.tagYellow },
          mt: margin,
          mb: margin,
        })
      }

      textLines.push({ text: t('claimDetails.receivedOn', { date: formatDateMMMMDDYYYY(attributes.dateFiled) }) })

      const position = (page - 1) * perPage + index + 1
      const a11yValue = t('listPosition', { position, total: totalEntries })
      listItems.push({
        textLines,
        a11yValue,
        onPress: () => (type === ClaimOrAppealConstants.claim ? onClaimDetails(id) : onAppealDetails(id)),
        testId: getTestIDFromTextLines(textLines),
      })
    })

    return listItems
  }

  if (claimsAndAppeals?.length === 0) {
    return <NoClaimsAndAppeals claimType={claimType} />
  }

  if (loadingClaimsAndAppeals) {
    return <LoadingComponent text={t('claimsAndAppeals.loadingClaimsAndAppeals')} />
  }

  const yourClaimsAndAppealsHeader = t('claims.yourClaims', { claimType: claimType.toLowerCase() })

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
    tab: claimType.toLowerCase(),
  }

  return (
    <Box {...testIdProps('', false, `${claimType.toLowerCase()}-claims-page`)}>
      <DefaultList items={getListItemVals()} title={yourClaimsAndAppealsHeader} />
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default ClaimsAndAppealsListView
