import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { RootNavStackParamList } from 'App'

import { BorderColorVariant, Box, LargePanel, RadioGroup, RadioGroupProps, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { useExternalLink, useTheme } from 'utils/hooks'

const { LINK_URL_OMB_PAGE } = getEnv()

type InAppFeedbackScreenProps = StackScreenProps<RootNavStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation }: InAppFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [satisfaction, setSatisfaction] = useState('')
  const [task, setTaskOverride] = useState('')
  const launchExternalLink = useExternalLink()

  // useBeforeNavBackListener(navigation, () => {
  // logAnalyticsEvent(Events.vama_feedback_page_closed())
  // })

  const onSubmit = (): void => {
    // logAnalyticsEvent(Events.vama_feedback_submitted(taskCompleted, satisfaction))
    navigation.goBack()
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
          <Button onPress={onSubmit} label={t('submit')} />
        </Box>
        <Box
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.prescriptionDivider as BorderColorVariant}>
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
