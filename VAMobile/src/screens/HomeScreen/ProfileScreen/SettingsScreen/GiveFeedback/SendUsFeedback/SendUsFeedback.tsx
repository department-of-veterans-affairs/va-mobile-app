import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { Box, FeatureLandingTemplate, LinkWithAnalytics, TextView } from 'components'
import FloatingButton from 'components/FloatingButton'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type SendUsFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'SendUsFeedback'>

const { LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

function SendUsFeedbackScreen({ navigation }: SendUsFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const getStartSurveyButton = () => (
    <Box py={theme.dimensions.standardMarginBetween}>
      <FloatingButton
        testID="startSurveyTestID"
        label={t('giveFeedback.startSurvey')}
        onPress={() => {
          navigateTo('InAppFeedback', { task: 'static' })
        }}
      />
    </Box>
  )

  return (
    <FeatureLandingTemplate
      backLabel={t('giveFeedback')}
      backLabelOnPress={navigation.goBack}
      title={t('giveFeedback.send')}
      testID="sendUsFeedbackID"
      footerContent={screenReaderEnabled ? undefined : getStartSurveyButton()}>
      <Box mx={theme.dimensions.gutter}>
        <TextView>{t('giveFeedback.send.bodyText')}</TextView>
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
        <Box mb={theme.dimensions.contentMarginBottom}>
          <VeteransCrisisLineNumbers />
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}
export default SendUsFeedbackScreen
