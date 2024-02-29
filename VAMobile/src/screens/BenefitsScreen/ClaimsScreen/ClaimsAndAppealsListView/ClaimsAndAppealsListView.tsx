import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { ClaimOrAppeal, ClaimOrAppealConstants } from 'api/types'
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
}

function ClaimsAndAppealsListView({ claimType }: ClaimsAndAppealsListProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const [page, setPage] = useState(1)
  const [previousClaimType, setClaimType] = useState(claimType)
  const { data: claimsAndAppealsListPayload, isLoading: loadingClaimsAndAppeals } = useClaimsAndAppeals(claimType, page)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const claimsAndAppeals = claimsAndAppealsListPayload?.data
  const pageMetaData = claimsAndAppealsListPayload?.meta.pagination
  const { currentPage, perPage, totalEntries } = pageMetaData || { currentPage: 1, perPage: 10, totalEntries: 0 }

  useEffect(() => {
    if (previousClaimType !== claimType) {
      setClaimType(claimType)
      setPage(1)
    }
  }, [claimType, previousClaimType])

  const getBoldTextDisplayed = (type: ClaimOrAppeal, displayTitle: string, updatedAtDate: string): string => {
    const formattedUpdatedAtDate = formatDateMMMMDDYYYY(updatedAtDate)

    switch (type) {
      case ClaimOrAppealConstants.claim:
        return t('claims.claimFor', { displayTitle: displayTitle?.toLowerCase(), date: formattedUpdatedAtDate })
      case ClaimOrAppealConstants.appeal:
        return t('claims.appealFor', { displayTitle: capitalizeWord(displayTitle), date: formattedUpdatedAtDate })
    }

    return ''
  }

  const onClaimDetails = (id: string) => {
    navigateTo('ClaimDetailsScreen', { claimID: id, claimType })
  }

  const onAppealDetails = (id: string) => {
    navigateTo('AppealDetailsScreen', { appealID: id })
  }

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsAndAppeals?.forEach((claimAndAppeal, index) => {
      const { type, attributes, id } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [
        { text: getBoldTextDisplayed(type, attributes.displayTitle, attributes.updatedAt), variant: 'MobileBodyBold' },
        { text: `Submitted ${formattedDateFiled}` },
      ]

      if (
        featureEnabled('decisionLettersWaygate') &&
        userAuthorizedServices?.decisionLetters &&
        attributes.decisionLetterSent
      ) {
        const margin = theme.dimensions.condensedMarginBetween
        textLines.push({
          text: t('claims.decisionLetterReady'),
          textTag: { labelType: LabelTagTypeConstants.tagBlue },
          mt: margin,
          mb: margin,
        })
      }

      const position = (currentPage - 1) * perPage + index + 1
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

  const yourClaimsAndAppealsHeader = t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })

  const paginationProps: PaginationProps = {
    onNext: () => {
      setPage(currentPage + 1)
    },
    onPrev: () => {
      setPage(currentPage - 1)
    },
    totalEntries: totalEntries,
    pageSize: perPage,
    page: currentPage,
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
