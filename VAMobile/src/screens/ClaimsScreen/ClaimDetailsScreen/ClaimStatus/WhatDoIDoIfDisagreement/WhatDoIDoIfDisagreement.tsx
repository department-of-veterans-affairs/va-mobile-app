import { Linking, ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView } from 'components'
import { ClaimsStackParamList } from '../../../ClaimsStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_DECISION_REVIEWS } = getEnv()

type WhatDoIDoIfDisagreementProps = StackScreenProps<ClaimsStackParamList, 'WhatDoIDoIfDisagreement'>

const WhatDoIDoIfDisagreement: FC<WhatDoIDoIfDisagreementProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

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
    await Linking.openURL(LINK_URL_DECISION_REVIEWS)
  }

  return (
    <ScrollView {...testIdProps(generateTestID(t('claimDetails.whatDoIDoIfDisagreement.pageTitle'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimsDetails.whatDoIDoIfDisagreement.header')}
          </TextView>
          <TextView variant="MobileBody">{t('claimsDetails.whatDoIDoIfDisagreement.content')}</TextView>
          <TextView variant="MobileBodyLink" color="link" mt={theme.dimensions.standardMarginBetween} accessibilityRole="link" onPress={onDecisionReview}>
            {t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')}
          </TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default WhatDoIDoIfDisagreement
