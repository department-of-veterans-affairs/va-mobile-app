import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, FullScreenSubtask, RadioGroup, RadioGroupProps, TextView, VATextInput } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { checkStringForPII } from 'utils/common'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'

type InAppFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation }: InAppFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [satisfaction, setSatisfaction] = useState('')
  const [meetMyNeeds, setMeetMyNeeds] = useState('')
  const [easyToUse, setEasyToUse] = useState('')
  const [task, setTaskOverride] = useState('')
  let submittedCheck = false
  const navigateTo = useRouteNavigation()

  useBeforeNavBackListener(navigation, () => {
    if (submittedCheck === true) {
      return
    }
    logAnalyticsEvent(Events.vama_feedback_closed())
  })

  const onSubmit = (): void => {
    const { found, newText } = checkStringForPII(task)
    if (found) {
      Alert.alert(t('inAppFeedback.personalInfo.title'), t('inAppFeedback.personalInfo.body'), [
        {
          text: t('inAppFeedback.personalInfo.edit'),
          style: 'cancel',
        },
        {
          text: t('inAppFeedback.personalInfo.submit'),
          onPress: () => {
            logAnalyticsEvent(Events.vama_feedback(satisfaction, meetMyNeeds, easyToUse, newText))
            submittedCheck = true
            navigateTo('FeedbackSent')
          },
          style: 'default',
        },
      ])
    } else {
      logAnalyticsEvent(Events.vama_feedback(satisfaction, meetMyNeeds, easyToUse, task))
      submittedCheck = true
      navigateTo('FeedbackSent')
    }
  }

  const radioGroupProps: RadioGroupProps<string> = {
    isRadioList: false,
    onChange: setSatisfaction,
    options: [
      {
        labelKey: t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
        value: t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
      },
      {
        labelKey: t('inAppFeedback.overallSatisfaction.dissatisfied'),
        value: t('inAppFeedback.overallSatisfaction.dissatisfied'),
      },
      {
        labelKey: t('inAppFeedback.overallSatisfaction.neither'),
        value: t('inAppFeedback.overallSatisfaction.neither'),
      },
      {
        labelKey: t('inAppFeedback.overallSatisfaction.satisfied'),
        value: t('inAppFeedback.overallSatisfaction.satisfied'),
      },
      {
        labelKey: t('inAppFeedback.overallSatisfaction.verySatisfied'),
        value: t('inAppFeedback.overallSatisfaction.verySatisfied'),
      },
    ],
    value: satisfaction,
  }

  const meetMyNeedsProps: RadioGroupProps<string> = {
    isRadioList: false,
    onChange: setMeetMyNeeds,
    options: [
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
        value: t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.agree'),
        value: t('inAppFeedback.agreeOrDisagree.agree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.neither'),
        value: t('inAppFeedback.agreeOrDisagree.neither'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.disagree'),
        value: t('inAppFeedback.agreeOrDisagree.disagree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
        value: t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
      },
    ],
    value: meetMyNeeds,
  }

  const easyToUseProps: RadioGroupProps<string> = {
    isRadioList: false,
    onChange: setEasyToUse,
    options: [
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
        value: t('inAppFeedback.agreeOrDisagree.stronglyAgree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.agree'),
        value: t('inAppFeedback.agreeOrDisagree.agree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.neither'),
        value: t('inAppFeedback.agreeOrDisagree.neither'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.disagree'),
        value: t('inAppFeedback.agreeOrDisagree.disagree'),
      },
      {
        labelKey: t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
        value: t('inAppFeedback.agreeOrDisagree.stronglyDisagree'),
      },
    ],
    value: easyToUse,
  }

  return (
    <FullScreenSubtask
      title={t('giveFeedback.send')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      primaryContentButtonText={t('inAppFeedback.submitFeedback')}
      onPrimaryContentButtonPress={onSubmit}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.overallSatisfaction.header')}
          </TextView>
          <RadioGroup {...radioGroupProps} />
        </Box>
        <Box>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.agreeOrDisagree.header')}
          </TextView>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody" accessibilityRole="header">
            {t('inAppFeedback.functions.header')}
          </TextView>
          <RadioGroup {...meetMyNeedsProps} />
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody" accessibilityRole="header">
            {t('inAppFeedback.easyToUse.header')}
          </TextView>
          <RadioGroup {...easyToUseProps} />
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.whatTask.header')}
          </TextView>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="HelperText">
            {t('inAppFeedback.whatTask.body')}
          </TextView>
          <VATextInput
            inputType="none"
            isTextArea={true}
            value={task}
            testID="AppFeedbackTaskID"
            onChange={setTaskOverride}
          />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default InAppFeedbackScreen
