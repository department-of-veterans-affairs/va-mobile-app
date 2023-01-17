import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { Box, SimpleList, SimpleListItemObj, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { ClaimType, ClaimTypeConstants } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'
import NeedHelpData from 'screens/BenefitsScreen/ClaimsScreen/NeedHelpData/NeedHelpData'

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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const ActiveClaimStatusDetails = (): ReactElement => {
    // alternative check if need to update: isClosedClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    if (isActiveClaim) {
      const detailsFAQListItems: Array<SimpleListItemObj> = [
        { text: t('claimDetails.whyWeCombine'), onPress: navigateTo('ConsolidatedClaimsNote'), testId: t('claimDetails.whyWeCombine.a11yLabel') },
        { text: t('claimDetails.whatShouldIDoIfDisagree'), onPress: navigateTo('WhatDoIDoIfDisagreement'), testId: t('claimDetails.whatShouldIDoIfDisagree.a11yLabel') },
      ]

      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          {claim && <ClaimTimeline attributes={claim.attributes} claimID={claim.id} />}
          {false && <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={false} />}
          <Box>
            <SimpleList items={detailsFAQListItems} />
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

      const claimWasClosedOn = t('claimDetails.yourClaimWasClosedOn', { date: formatDateMMMMDDYYYY(completedEvent.date) })

      return (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <Box {...testIdProps(claimWasClosedOn)} accessibilityRole="header" accessible={true}>
              <TextView variant="MobileBodyBold">{claimWasClosedOn}</TextView>
            </Box>
            <Box {...testIdProps(t('claimDetails.decisionPacketMailed'))} accessible={true}>
              <TextView variant="MobileBody">{t('claimDetails.decisionPacketMailed')}</TextView>
            </Box>
          </TextArea>
        </Box>
      )
    }

    return <></>
  }

  return (
    <Box {...testIdProps('Your-claim: Status-tab-claim-details-page')}>
      <ActiveClaimStatusDetails />
      <ClosedClaimStatusDetails />
      <NeedHelpData />
    </Box>
  )
}

export default ClaimStatus
