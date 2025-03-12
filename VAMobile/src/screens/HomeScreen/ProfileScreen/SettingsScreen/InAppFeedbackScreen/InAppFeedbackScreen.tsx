import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { RootNavStackParamList } from 'App'

import { BorderColorVariant, Box, LargePanel, RadioGroup, RadioGroupProps, TextView, VATextInput } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { checkStringForPII } from 'utils/common'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useExternalLink, useTheme } from 'utils/hooks'

const { LINK_URL_OMB_PAGE } = getEnv()

type InAppFeedbackScreenProps = StackScreenProps<RootNavStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation, route }: InAppFeedbackScreenProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [satisfaction, setSatisfaction] = useState('')
  const [task, setTaskOverride] = useState('')
  const { screen } = route.params
  let submittedCheck = false
  const launchExternalLink = useExternalLink()

  useBeforeNavBackListener(navigation, () => {
    if (submittedCheck === true) {
      return
    }
    logAnalyticsEvent(Events.vama_feedback_closed(screen))
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
            logAnalyticsEvent(Events.vama_feedback_submitted(screen, newText, satisfaction))
            submittedCheck = true
            navigation.goBack()
            snackbar.show(t('inAppFeedback.snackbar.success'))
          },
          style: 'default',
        },
      ])
    } else {
      logAnalyticsEvent(Events.vama_feedback_submitted(screen, task, satisfaction))
      submittedCheck = true
      navigation.goBack()
      snackbar.show(t('inAppFeedback.snackbar.success'))
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

  return (
    <LargePanel title={t('giveFeedback')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('inAppFeedback.whatTask.header')}
        </TextView>
        <TextView variant="MobileBody" mb={theme.dimensions.alertBorderWidth}>
          {t('inAppFeedback.whatTask.body')}
        </TextView>
        <VATextInput
          inputType="none"
          isTextArea={true}
          value={task}
          testID="AppFeedbackTaskID"
          onChange={setTaskOverride}
        />
        <Box>
          <TextView my={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.overallSatisfaction.header')}
          </TextView>
          <RadioGroup {...radioGroupProps} />
        </Box>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <Button onPress={onSubmit} label={t('inAppFeedback.submitFeedback')} />
        </Box>
        <Box
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.divider as BorderColorVariant}>
          <TextView variant="HelperText" mt={theme.dimensions.standardMarginBetween}>
            {t('inAppFeedback.legalReqs.number')}
          </TextView>
          <TextView variant="HelperText">{t('inAppFeedback.legalReqs.expiration')}</TextView>
          <TextView variant="HelperText">{t('inAppFeedback.legalReqs.burdenTime')}</TextView>
          <TextView variant="HelperText" mt={theme.dimensions.standardMarginBetween}>
            {t('inAppFeedback.legalReqs.paragraph')}
          </TextView>
          <Pressable onPress={() => launchExternalLink(LINK_URL_OMB_PAGE)} accessibilityRole="link" accessible={true}>
            <TextView variant="MobileFooterLink" mt={theme.dimensions.standardMarginBetween}>
              {t('inAppFeedback.legalReqs.paragraph.link')}
            </TextView>
          </Pressable>
          <TextView variant="HelperText" mt={theme.dimensions.standardMarginBetween}>
            {t('inAppFeedback.legalReqs.paragraph.2')}
          </TextView>
        </Box>
      </Box>
    </LargePanel>
  )
}

export default InAppFeedbackScreen
