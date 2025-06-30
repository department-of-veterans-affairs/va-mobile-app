import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type FeedbackSentScreenProps = StackScreenProps<HomeStackParamList, 'FeedbackSent'>

function FeedbackSentScreen({}: FeedbackSentScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  return (
    <FeatureLandingTemplate
      backLabel={t('giveFeedback')}
      backLabelOnPress={() => {
        navigateTo('GiveFeedback')
      }}
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID">
      <Box mx={theme.dimensions.gutter}>
        <TextView>{t('giveFeedback.sent.bodyText')}</TextView>
      </Box>
    </FeatureLandingTemplate>
  )
}
export default FeedbackSentScreen
