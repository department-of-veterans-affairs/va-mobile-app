import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LargePanel, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_DECISION_REVIEWS } = getEnv()

type WhatDoIDoIfDisagreementProps = StackScreenProps<BenefitsStackParamList, 'WhatDoIDoIfDisagreement'>

function WhatDoIDoIfDisagreement({ route }: WhatDoIDoIfDisagreementProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimID, claimType, claimStep } = route.params

  const text = t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')

  return (
    <LargePanel title={t('claimDetails.claimsHelp.pageTitle')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.learnWhatToDoIfDisagreePanel')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('claimsDetails.whatDoIDoIfDisagreement.content')}
        </TextView>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_DECISION_REVIEWS}
          text={text}
          a11yHint={`${text} ${t('mobileBodyLink.a11yHint')}`}
          analyticsProps={{ claim_id: claimID, claim_type: claimType, claim_step: claimStep }}
          testID="ClaimsDecisionReviewOptionsTestID"
        />
      </Box>
    </LargePanel>
  )
}

export default WhatDoIDoIfDisagreement
