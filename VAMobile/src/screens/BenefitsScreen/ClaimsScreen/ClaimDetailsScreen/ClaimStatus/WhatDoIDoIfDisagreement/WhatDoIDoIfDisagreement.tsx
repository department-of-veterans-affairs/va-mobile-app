import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_DECISION_REVIEWS } = getEnv()

type WhatDoIDoIfDisagreementProps = StackScreenProps<BenefitsStackParamList, 'WhatDoIDoIfDisagreement'>

const WhatDoIDoIfDisagreement: FC<WhatDoIDoIfDisagreementProps> = ({ route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const { claimID, claimType, claimStep } = route.params

  const onDecisionReview = async (): Promise<void> => {
    launchExternalLink(LINK_URL_DECISION_REVIEWS, { claim_id: claimID, claim_type: claimType, claim_step: claimStep })
  }

  const text = t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')

  return (
    <LargePanel title={t('claimDetails.claimsHelp.pageTitle')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={a11yLabelVA(t('claimsDetails.whatDoIDoIfDisagreement.header'))}>
          {t('claimsDetails.whatDoIDoIfDisagreement.header')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('claimsDetails.whatDoIDoIfDisagreement.content')}
        </TextView>
        <TextView
          variant="MobileBodyLink"
          accessibilityRole="link"
          {...a11yHintProp(`${text} ${t('mobileBodyLink.a11yHint')}`)}
          onPress={onDecisionReview}
          testID="ClaimsDecisionReviewOptionsTestID">
          {text}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default WhatDoIDoIfDisagreement
