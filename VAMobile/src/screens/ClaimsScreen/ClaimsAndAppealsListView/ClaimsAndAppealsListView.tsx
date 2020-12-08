import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { Box, List, ListItemObj, TextLine, TextView } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ClaimsAndAppealsList } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getActiveClaimsAndAppeals } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

export const ClaimTypeConstants: {
  ACTIVE: ClaimType
  CLOSED: ClaimType
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

type ClaimType = 'ACTIVE' | 'CLOSED'

type ClaimsAndAppealsListProps = {
  claimType: ClaimType
}

const ClaimsAndAppealsListView: FC<ClaimsAndAppealsListProps> = ({ claimType }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { activeClaimsAndAppeals } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  useEffect(() => {
    switch (claimType) {
      case ClaimTypeConstants.ACTIVE:
        dispatch(getActiveClaimsAndAppeals())
    }
  }, [dispatch, claimType])

  const getBoldTextDisplayed = (type: ClaimOrAppeal, subType: string, updatedAtDate: string): string => {
    const formattedUpdatedAtDate = formatDateMMMMDDYYYY(updatedAtDate)

    switch (type) {
      case ClaimOrAppealConstants.claim:
        return `Claim for ${subType.toLowerCase()} updated on ${formattedUpdatedAtDate}`
      default:
        return `${capitalizeWord(subType)} appeal updated on ${formattedUpdatedAtDate}`
    }
  }

  const getListItemVals = (listOfClaimsAndAppeals: ClaimsAndAppealsList): Array<ListItemObj> => {
    const listItems: Array<ListItemObj> = []

    _.forEach(listOfClaimsAndAppeals || ({} as ClaimsAndAppealsList), (claimAndAppeal) => {
      const { type, attributes } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [{ text: getBoldTextDisplayed(type, attributes.subtype, attributes.updatedAt), isBold: true }, { text: `Submitted ${formattedDateFiled}` }]

      listItems.push({ textLines, onPress: () => {} })
    })

    return listItems
  }

  const listItemValsParameter = claimType === ClaimTypeConstants.ACTIVE && activeClaimsAndAppeals ? activeClaimsAndAppeals : ({} as ClaimsAndAppealsList)

  return (
    <Box>
      <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={theme.dimensions.titleHeaderAndElementMargin}>
        {t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })}
      </TextView>
      <List items={getListItemVals(listItemValsParameter)} />
    </Box>
  )
}

export default ClaimsAndAppealsListView
