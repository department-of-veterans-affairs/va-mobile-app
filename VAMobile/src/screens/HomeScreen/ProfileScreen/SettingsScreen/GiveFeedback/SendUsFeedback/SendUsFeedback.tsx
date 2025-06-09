import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextView } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import { setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type SendUsFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'SendUsFeedback'>

const { LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

function SendUsFeedbackScreen({ navigation }: SendUsFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  return (
    <FeatureLandingTemplate
      backLabel={t('giveFeedback')}
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID"
      footerContent={
        <Box mx={theme.dimensions.gutter} py={theme.dimensions.standardMarginBetween}>
          <Button
            label={t('giveFeedback.startSurvey')}
            onPress={() => {
              navigateTo('InAppFeedback', { task: 'static' })
            }}
          />
        </Box>
      }>
      <Box mx={theme.dimensions.gutter}>
        <TextView>{t('giveFeedback.send.bodyText')}</TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VeteransCrisisLineNumbers />
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('veteransCrisisLine.getMoreResources')}
          </TextView>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_VETERANS_CRISIS_LINE}
            text={t('veteransCrisisLine.urlDisplayed')}
            a11yLabel={t('veteransCrisisLine.urlA11yLabel')}
            a11yHint={t('veteransCrisisLine.urlA11yHint')}
            analyticsOnPress={() => setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())}
            testID="veteransCrisisLineGetMoreResourcesTestID"
          />
        </Box>
        <LinkWithAnalytics
          type="custom"
          text={t('giveFeedback.termsAndConditions')}
          onPress={() => navigateTo('FeedbackTermsAndConditions')}
          testID="termsAndConditionsID"
        />
      </Box>
    </FeatureLandingTemplate>
  )
}
export default SendUsFeedbackScreen
