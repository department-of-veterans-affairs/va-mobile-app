import React, { FC, ReactElement } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, List, ListItemObj, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { ClaimType, ClaimTypeConstants } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'

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

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('claimDetails.VANumberDisplayed'),
    numberOrUrlLink: t('claimDetails.VANumber'),
    linkType: LinkTypeOptionsConstants.call,
  }

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

  return (
    <Box {...testIdProps('Claim-status-screen')}>
      {claim && <ClaimTimeline attributes={claim.attributes} />}
      <ActiveClaimStatusDetails />
      <Box>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimDetails.needHelp')}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.callVA')}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('claimDetails.VANumberA11yHint'))} />
          </Box>
        </TextArea>
      </Box>
    </Box>
  )
}

export default ClaimStatus
