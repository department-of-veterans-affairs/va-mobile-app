import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { ClaimsStackParamList } from '../../../ClaimsStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useExternalLink, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_DECISION_REVIEWS } = getEnv()

type WhatDoIDoIfDisagreementProps = StackScreenProps<ClaimsStackParamList, 'WhatDoIDoIfDisagreement'>

const WhatDoIDoIfDisagreement: FC<WhatDoIDoIfDisagreementProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('claimDetails.whatDoIDoIfDisagreement.pageTitle')} accessibilityRole="header">
          {t('claimDetails.whatDoIDoIfDisagreement.pageTitle')}
        </HiddenTitle>
      ),
    })
  })

  const onDecisionReview = async (): Promise<void> => {
    launchExternalLink(LINK_URL_DECISION_REVIEWS)
  }

  const text = t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')

  return (
    <VAScrollView {...testIdProps(generateTestID(t('claimDetails.whatDoIDoIfDisagreement.pageTitle'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimsDetails.whatDoIDoIfDisagreement.header')}
          </TextView>
          <TextView variant="MobileBody">{t('claimsDetails.whatDoIDoIfDisagreement.content')}</TextView>
          <TextView
            variant="MobileBodyLink"
            color="link"
            mt={theme.dimensions.standardMarginBetween}
            accessibilityRole="link"
            {...a11yHintProp(`${text} ${t('common:mobileBodyLink.a11yHint')}`)}
            onPress={onDecisionReview}>
            {text}
          </TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default WhatDoIDoIfDisagreement
