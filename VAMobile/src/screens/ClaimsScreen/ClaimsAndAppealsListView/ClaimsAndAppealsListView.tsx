import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import _ from 'underscore'

import { Box, DefaultList, DefaultListItemObj, TextLine, TextView } from 'components'
import { ClaimOrAppeal, ClaimOrAppealConstants, ClaimsAndAppealsList } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getActiveOrClosedClaimsAndAppeals } from 'store/actions'
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
  const { activeOrClosedClaimsAndAppeals, claimsAndAppealsList } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  useEffect(() => {
    dispatch(getActiveOrClosedClaimsAndAppeals(claimType))
  }, [dispatch, claimType, claimsAndAppealsList])

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

    _.forEach(activeOrClosedClaimsAndAppeals || ({} as ClaimsAndAppealsList), (claimAndAppeal) => {
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

  if (!activeOrClosedClaimsAndAppeals || activeOrClosedClaimsAndAppeals.length === 0) {
    return <NoClaimsAndAppeals />
  }

  const yourClaimsAndAppealsHeader = t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })

  return (
    <Box {...testIdProps('', false, `${claimType.toLowerCase()}-claims-page`)}>
      <DefaultList items={getListItemVals()} title={yourClaimsAndAppealsHeader} />
    </Box>
  )
}

export default ClaimsAndAppealsListView
