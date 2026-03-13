import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextView } from 'components'
import FloatingButton from 'components/FloatingButton'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import { useInlineFab, useRouteNavigation, useTheme } from 'utils/hooks'

type SendUsFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'SendUsFeedback'>

function SendUsFeedbackScreen({ navigation }: SendUsFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const shouldUseInlineFab = useInlineFab()

  const getStartSurveyButton = () => (
    <FloatingButton
      testID="startSurveyTestID"
      isHidden={false}
      label={t('giveFeedback.startSurvey')}
      onPress={() => {
        navigateTo('InAppFeedback', { task: 'static' })
      }}
    />
  )

  return (
    <FeatureLandingTemplate
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID"
      footerContent={shouldUseInlineFab ? undefined : getStartSurveyButton()}>
      <Box>
        <TextView mx={theme.dimensions.gutter}>{t('giveFeedback.send.bodyText')}</TextView>
        {shouldUseInlineFab ? getStartSurveyButton() : undefined}
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.floatingButtonOffset}>
          <LinkWithAnalytics
            type="custom"
            text={t('giveFeedback.termsAndConditions')}
            onPress={() => navigateTo('FeedbackTermsAndConditions')}
            testID="termsAndConditionsID"
          />
          <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
            {t('giveFeedback.needHelp')}
          </TextView>
          <TextView>{t('giveFeedback.send.bodyText.2')}</TextView>
          <VeteransCrisisLineNumbers />
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}
export default SendUsFeedbackScreen
