import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { Box, List, ListItemObj, TextLine, TextView } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ClaimsAndAppealsList } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getActiveOrClosedClaimsAndAppeals, getAllClaimsAndAppeals } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

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
  const { activeOrClosedClaimsAndAppeals } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  useEffect(() => {
    const getAllClaimsAndAppealsData = async (): Promise<void> => {
      await dispatch(getAllClaimsAndAppeals())
      await dispatch(getActiveOrClosedClaimsAndAppeals(claimType))
    }

    getAllClaimsAndAppealsData()
  }, [dispatch, claimType])

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

  const getListItemVals = (): Array<ListItemObj> => {
    const listItems: Array<ListItemObj> = []

    _.forEach(activeOrClosedClaimsAndAppeals || ({} as ClaimsAndAppealsList), (claimAndAppeal) => {
      const { type, attributes, id } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [{ text: getBoldTextDisplayed(type, attributes.subtype, attributes.updatedAt), isBold: true }, { text: `Submitted ${formattedDateFiled}` }]

      const onPress = type === ClaimOrAppealConstants.claim ? navigateTo('ClaimDetails', { claimID: id }) : (): void => {}

      listItems.push({ textLines, onPress, a11yHintText: t('claims.a11yHint', { activeOrClosed: claimType, claimOrAppeal: type }) })
    })

    return listItems
  }

  return (
    <Box {...testIdProps(`Claims-and-appeals-list-view-${claimType}`)}>
      <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
        {t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })}
      </TextView>
      <List items={getListItemVals()} />
    </Box>
  )
}

export default ClaimsAndAppealsListView
