import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FullScreenSubtask, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import getEnv from 'utils/env'
import { useExternalLink, useTheme } from 'utils/hooks'

const { LINK_URL_OMB_PAGE } = getEnv()

type FeedbackTermsAndConditionsScreenProps = StackScreenProps<HomeStackParamList, 'FeedbackTermsAndConditions'>

function FeedbackTermsAndConditionsScreen({ navigation }: FeedbackTermsAndConditionsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

  return (
    <FullScreenSubtask
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID"
      secondaryContentButtonText={t('back')}
      onSecondaryContentButtonPress={navigation.goBack}>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold">{t('giveFeedback.termsAndConditions.lowercase')}</TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
          {t('inAppFeedback.legalReqs.paragraph')}
        </TextView>
        <Pressable onPress={() => launchExternalLink(LINK_URL_OMB_PAGE)} accessibilityRole="link" accessible={true}>
          <TextView variant="MobileBodyLink" mt={theme.dimensions.standardMarginBetween}>
            {t('inAppFeedback.legalReqs.paragraph.link')}
          </TextView>
        </Pressable>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('inAppFeedback.legalReqs.paragraph.2')}
        </TextView>
      </Box>
    </FullScreenSubtask>
  )
}
export default FeedbackTermsAndConditionsScreen
