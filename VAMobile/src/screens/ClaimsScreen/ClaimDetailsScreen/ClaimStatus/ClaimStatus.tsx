import React, { FC, ReactElement } from 'react'

import { Box, List, ListItemObj, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { ClaimType, ClaimTypeConstants } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'
import NeedHelpData from 'screens/ClaimsScreen/NeedHelpData/NeedHelpData'

/** props for the ClaimStatus component */
type ClaimStatusProps = {
  /** detailed claim information */
  claim: ClaimData
  /** indicates either open or closed claim */
  claimType: ClaimType
}

// TODO: ClaimType and ClaimTypeConstants need to be moved from ClaimsAndAppealsListView into a constants/claims file

/**
 * Component for rendering the details area of a claim when selected on the ClaimDetailsScreen
 */
const ClaimStatus: FC<ClaimStatusProps> = ({ claim, claimType }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()

  const ActiveClaimStatusDetails = (): ReactElement => {
    // alternative check if need to update: isActiveClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    if (isActiveClaim) {
      const detailsFAQListItems: Array<ListItemObj> = [
        { textLines: t('claimDetails.whyWeCombine'), onPress: navigateTo('ConsolidatedClaimsNote') },
        { textLines: t('claimDetails.whatShouldIDoIfDisagree'), onPress: navigateTo('WhatDoIDoIfDisagreement') },
      ]

      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box mb={theme.dimensions.marginBetweenCards}>
          <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={true} />
          <Box mt={theme.dimensions.marginBetweenCards}>
            <List items={detailsFAQListItems} />
          </Box>
        </Box>
      )
    }

    return <></>
  }

  const ClosedClaimStatusDetails = (): ReactElement => {
    const isClosedClaim = claimType === ClaimTypeConstants.CLOSED

    if (isClosedClaim) {
      const completedEvent = claim?.attributes?.eventsTimeline.find((element) => element.type === 'completed')
      if (!completedEvent || !completedEvent.date) {
        return <></>
      }

      return (
        <Box mb={theme.dimensions.marginBetweenCards}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('claimDetails.yourClaimWasClosedOn', { date: formatDateMMMMDDYYYY(completedEvent.date) })}
            </TextView>
            <TextView variant="MobileBody">{t('claimDetails.decisionPacketMailed')}</TextView>
          </TextArea>
        </Box>
      )
    }

    return <></>
  }

  return (
    <Box {...testIdProps('Claim-status-screen')}>
      {claim && <ClaimTimeline attributes={claim.attributes} />}
      <ActiveClaimStatusDetails />
      <ClosedClaimStatusDetails />
      <NeedHelpData />
    </Box>
  )
}

export default ClaimStatus
