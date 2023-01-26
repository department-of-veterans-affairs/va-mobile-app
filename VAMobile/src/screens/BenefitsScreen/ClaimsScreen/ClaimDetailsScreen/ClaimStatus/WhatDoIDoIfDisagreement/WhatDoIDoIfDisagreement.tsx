import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, LargePanel, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_DECISION_REVIEWS } = getEnv()

type WhatDoIDoIfDisagreementProps = StackScreenProps<BenefitsStackParamList, 'WhatDoIDoIfDisagreement'>

const WhatDoIDoIfDisagreement: FC<WhatDoIDoIfDisagreementProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

  const onDecisionReview = async (): Promise<void> => {
    launchExternalLink(LINK_URL_DECISION_REVIEWS)
  }

  const text = t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')

  return (
    <LargePanel title={t('claimDetails.whatDoIDoIfDisagreement.pageTitle')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimsDetails.whatDoIDoIfDisagreement.header')}
          </TextView>
          <TextView variant="MobileBody">{t('claimsDetails.whatDoIDoIfDisagreement.content')}</TextView>
          <TextView
            variant="MobileBodyLink"
            mt={theme.dimensions.standardMarginBetween}
            accessibilityRole="link"
            {...a11yHintProp(`${text} ${t('mobileBodyLink.a11yHint')}`)}
            onPress={onDecisionReview}>
            {text}
          </TextView>
        </TextArea>
      </Box>
    </LargePanel>
  )
}

export default WhatDoIDoIfDisagreement
