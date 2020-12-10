import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, List, ListItemObj, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ClaimStatusProps = {
  claim: ClaimData
}

const ClaimStatus: FC<ClaimStatusProps> = ({ claim }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()

  const displayDate = claim && claim.attributes && claim.attributes.maxEstDate ? formatDateMMMMDDYYYY(claim.attributes.maxEstDate) : t('claimDetails.noEstimatedDecisionDate')

  const detailsFAQListItems: Array<ListItemObj> = [
    { textLines: t('claimDetails.whyWeCombine'), onPress: navigateTo('ConsolidatedClaimsNote') },
    { textLines: t('claimDetails.whatShouldIDoIfDisagree'), onPress: navigateTo('WhatDoIDoIfDisagreement') },
  ]

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('claimDetails.VANumberDisplayed'),
    numberOrUrlLink: t('claimDetails.VANumber'),
    linkType: LinkTypeOptionsConstants.call,
  }

  return (
    <Box>
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
      <Box mt={theme.dimensions.marginBetweenCards}>
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
