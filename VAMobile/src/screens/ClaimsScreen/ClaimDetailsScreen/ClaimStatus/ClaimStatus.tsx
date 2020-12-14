import React, { FC, ReactElement } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, List, ListItemObj, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'

import { ClaimType, ClaimTypeConstants } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ClaimStatusProps = {
  claim: ClaimData
  claimType: ClaimType
}

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
      const displayDate = claim && claim.attributes && claim.attributes.maxEstDate ? formatDateMMMMDDYYYY(claim.attributes.maxEstDate) : t('claimDetails.noEstimatedDecisionDate')

      const detailsFAQListItems: Array<ListItemObj> = [
        { textLines: t('claimDetails.whyWeCombine'), onPress: navigateTo('ConsolidatedClaimsNote') },
        { textLines: t('claimDetails.whatShouldIDoIfDisagree'), onPress: navigateTo('WhatDoIDoIfDisagreement') },
      ]

      return (
        <Box mb={theme.dimensions.marginBetweenCards}>
          <TextArea>
            <TextView variant="MobileBody">{t('claimDetails.estimatedDecisionDate')}</TextView>
            <TextView variant="MobileBodyBold">{displayDate}</TextView>
            <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
              {t('claimDetails.weBaseThis')}
            </TextView>
          </TextArea>
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
