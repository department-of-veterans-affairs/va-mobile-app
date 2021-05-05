import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, DefaultList, DefaultListItemObj, Pagination, PaginationProps, TextLine } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ScreenIDTypesConstants } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getClaimsAndAppeals } from 'store/actions'
import { getTestIDFromTextLines, testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
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
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { claimsAndAppealsList, claimsAndAppealsMetaPagination } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const claimsAndAppeals = claimsAndAppealsList?.[claimType]

  const getBoldTextDisplayed = (type: ClaimOrAppeal, subType: string, updatedAtDate: string): string => {
    const formattedUpdatedAtDate = formatDateMMMMDDYYYY(updatedAtDate)

    switch (type) {
      case ClaimOrAppealConstants.claim:
        return t('claims.claimFor', { subType: subType.toLowerCase(), date: formattedUpdatedAtDate })
      case ClaimOrAppealConstants.appeal:
        return t('claims.appealFor', { subType: capitalizeWord(subType), date: formattedUpdatedAtDate })
    }

    return ''
  }

  const getListItemVals = (): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []
    claimsAndAppeals?.forEach((claimAndAppeal) => {
      const { type, attributes, id } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [
        { text: getBoldTextDisplayed(type, attributes.subtype, attributes.updatedAt), variant: 'MobileBodyBold' },
        { text: `Submitted ${formattedDateFiled}` },
      ]

      const onPress = type === ClaimOrAppealConstants.claim ? navigateTo('ClaimDetailsScreen', { claimID: id, claimType }) : navigateTo('AppealDetailsScreen', { appealID: id })

      listItems.push({ textLines, onPress, a11yHintText: t('claims.a11yHint', { activeOrClosed: claimType, claimOrAppeal: type }), testId: getTestIDFromTextLines(textLines) })
    })

    return listItems
  }

  if (!claimsAndAppeals || claimsAndAppeals.length === 0) {
    return <NoClaimsAndAppeals />
  }

  const yourClaimsAndAppealsHeader = t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })

  const requestPage = (requestedPage: number, selectedClaimType: ClaimType) => {
    dispatch(getClaimsAndAppeals(requestedPage, selectedClaimType, ScreenIDTypesConstants.CLAIMS_SCREEN_ID))
  }

  // Use the metaData to tell us what the currentPage is.
  // This ensures we have the data before we update the currentPage and the UI.
  const pageMetaData = claimsAndAppealsMetaPagination?.[claimType]
  const page = pageMetaData?.currentPage || 1
  const paginationProps: PaginationProps = {
    itemName: t('claimsAndAppeals.pagination'),
    onNext: () => {
      requestPage(page + 1, claimType)
    },
    onPrev: () => {
      requestPage(page - 1, claimType)
    },
    totalEntries: pageMetaData?.totalEntries || 0,
    pageSize: pageMetaData?.perPage || 0,
    page,
  }

  return (
    <Box {...testIdProps('', false, `${claimType.toLowerCase()}-claims-page`)}>
      <DefaultList items={getListItemVals()} title={yourClaimsAndAppealsHeader} />
      <Box flex={1} mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default ClaimsAndAppealsListView
