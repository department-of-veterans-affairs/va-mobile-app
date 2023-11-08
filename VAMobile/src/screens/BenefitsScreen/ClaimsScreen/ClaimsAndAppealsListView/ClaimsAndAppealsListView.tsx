import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, DefaultList, DefaultListItemObj, LabelTagTypeConstants, Pagination, PaginationProps, TextLine } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ScreenIDTypesConstants } from 'store/api/types'
import { ClaimsAndAppealsState, getClaimsAndAppeals } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useSelector } from 'react-redux'
import NoClaimsAndAppeals from '../NoClaimsAndAppeals/NoClaimsAndAppeals'

export const ClaimTypeConstants: {
  ACTIVE: ClaimType
  CLOSED: ClaimType
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

export type ClaimType = 'ACTIVE' | 'CLOSED'

type ClaimsAndAppealsListProps = {
  claimType: ClaimType
}

const ClaimsAndAppealsListView: FC<ClaimsAndAppealsListProps> = ({ claimType }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { claimsAndAppealsByClaimType, claimsAndAppealsMetaPagination } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const claimsAndAppeals = claimsAndAppealsByClaimType[claimType]
  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const pageMetaData = claimsAndAppealsMetaPagination[claimType]
  const { currentPage, perPage, totalEntries } = pageMetaData

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

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsAndAppeals.forEach((claimAndAppeal, index) => {
      const { type, attributes, id } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [
        { text: getBoldTextDisplayed(type, attributes.displayTitle, attributes.updatedAt), variant: 'MobileBodyBold' },
        { text: `Submitted ${formattedDateFiled}` },
      ]

      if (featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters && attributes.decisionLetterSent) {
        const margin = theme.dimensions.condensedMarginBetween
        textLines.push({ text: t('claims.decisionLetterAvailable'), textTag: { labelType: LabelTagTypeConstants.tagBlue }, mt: margin, mb: margin })
      }

      const position = (currentPage - 1) * perPage + index + 1
      const a11yValue = t('listPosition', { position, total: totalEntries })
      const onPress = type === ClaimOrAppealConstants.claim ? navigateTo('ClaimDetailsScreen', { claimID: id, claimType }) : navigateTo('AppealDetailsScreen', { appealID: id })
      listItems.push({
        textLines,
        a11yValue,
        onPress,
        testId: getTestIDFromTextLines(textLines),
      })
    })

    return listItems
  }

  if (claimsAndAppeals.length === 0) {
    return <NoClaimsAndAppeals claimType={claimType} />
  }

  const yourClaimsAndAppealsHeader = t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })

  const requestPage = (requestedPage: number, selectedClaimType: ClaimType) => {
    dispatch(getClaimsAndAppeals(selectedClaimType, ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID, requestedPage))
  }

  const paginationProps: PaginationProps = {
    onNext: () => {
      requestPage(currentPage + 1, claimType)
    },
    onPrev: () => {
      requestPage(currentPage - 1, claimType)
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
