import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, RadioButton, RadioButtonProps } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FullScreenSubtask, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'

type InAppFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation }: InAppFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [satisfaction, setSatisfaction] = useState('')
  const [meetMyNeeds, setMeetMyNeeds] = useState('')
  const [easyToUse, setEasyToUse] = useState('')
  let submittedCheck = false
  const navigateTo = useRouteNavigation()

  useBeforeNavBackListener(navigation, () => {
    if (submittedCheck === true) {
      return
    }
    logAnalyticsEvent(Events.vama_feedback_closed('GiveFeedback'))
  })

  const onSubmit = (): void => {
    logAnalyticsEvent(Events.vama_feedback(satisfaction, meetMyNeeds, easyToUse, ''))
    submittedCheck = true
    navigateTo('FeedbackSent')
  }

  const satisfactionProps: RadioButtonProps = {
    onSelectionChange: (s) => setSatisfaction(s as string),
    items: [
      t('inAppFeedback.overallSatisfaction.verySatisfied'),
      t('inAppFeedback.overallSatisfaction.satisfied'),
      t('inAppFeedback.overallSatisfaction.neither'),
      t('inAppFeedback.overallSatisfaction.dissatisfied'),
      t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
    ],
    selectedItem: satisfaction,
  }

  const meetMyNeedsProps: RadioButtonProps = {
    onSelectionChange: (s) => setMeetMyNeeds(s as string),
    items: [
      t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
      t('inAppFeedback.agreeOrDisagree.agree'),
      t('inAppFeedback.agreeOrDisagree.neither'),
      t('inAppFeedback.agreeOrDisagree.disagree'),
      t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
    ],
    selectedItem: meetMyNeeds,
  }

  const easyToUseProps: RadioButtonProps = {
    onSelectionChange: (s) => setEasyToUse(s as string),
    items: [
      t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
      t('inAppFeedback.agreeOrDisagree.agree'),
      t('inAppFeedback.agreeOrDisagree.neither'),
      t('inAppFeedback.agreeOrDisagree.disagree'),
      t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
    ],
    selectedItem: easyToUse,
  }

  return (
    <FullScreenSubtask
      title={t('giveFeedback.send')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.overallSatisfaction.header')}
          </TextView>
          <RadioButton {...satisfactionProps} />
        </Box>
        <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
          {t('inAppFeedback.agreeOrDisagree.header')}
        </TextView>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody" accessibilityRole="header">
            {t('inAppFeedback.functions.header')}
          </TextView>
          <RadioButton {...meetMyNeedsProps} />
        </Box>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody" accessibilityRole="header">
            {t('inAppFeedback.easyToUse.header')}
          </TextView>
          <RadioButton {...easyToUseProps} />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button
            label={t('inAppFeedback.submitFeedback')}
            onPress={() => {
              onSubmit()
            }}
          />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default InAppFeedbackScreen
