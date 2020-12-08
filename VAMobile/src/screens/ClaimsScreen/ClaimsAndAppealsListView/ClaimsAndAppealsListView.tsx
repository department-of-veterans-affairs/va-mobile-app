import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { Box, List, ListItemObj, TextLine, TextView } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ClaimsAndAppealsList } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getActiveOrClosedClaimsAndAppeals, getAllClaimsAndAppeals } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

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
  const { activeOrClosedClaimsAndAppeals } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const getAllClaimsAndAppealsData = async (): Promise<void> => {
    await dispatch(getAllClaimsAndAppeals())
    await dispatch(getActiveOrClosedClaimsAndAppeals(claimType))
  }

  useEffect(() => {
    getAllClaimsAndAppealsData()
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

  const getListItemVals = (): Array<ListItemObj> => {
    const listItems: Array<ListItemObj> = []

    _.forEach(activeOrClosedClaimsAndAppeals || ({} as ClaimsAndAppealsList), (claimAndAppeal) => {
      const { type, attributes } = claimAndAppeal

      const formattedDateFiled = formatDateMMMMDDYYYY(attributes.dateFiled)
      const textLines: Array<TextLine> = [{ text: getBoldTextDisplayed(type, attributes.subtype, attributes.updatedAt), isBold: true }, { text: `Submitted ${formattedDateFiled}` }]

      listItems.push({ textLines, onPress: () => {} })
    })

    return listItems
  }

  return (
    <Box>
      <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={theme.dimensions.titleHeaderAndElementMargin}>
        {t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })}
      </TextView>
      <List items={getListItemVals()} />
    </Box>
  )
}

export default ClaimsAndAppealsListView
