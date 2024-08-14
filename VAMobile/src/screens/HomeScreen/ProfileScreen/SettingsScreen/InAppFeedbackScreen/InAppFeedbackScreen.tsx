import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { BorderColorVariant, Box, LargePanel, RadioGroup, RadioGroupProps, TextView, radioOption } from 'components'
import RadioGroupModal from 'components/RadioGroupModal'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'

type InAppFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation }: InAppFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const currentScreenName = useNavigationState((state) => state.routes[state.routes.length - 1]).name
  const [taskCompleted, setTaskCompleted] = useState('')
  const [satisfaction, setSatisfaction] = useState('')

  useBeforeNavBackListener(navigation, () => {
    logAnalyticsEvent(Events.vama_feedback_page_closed())
  })

  const onChange = (value: string): void => {
    setTaskCompleted(value)
  }

  const onChange2 = (value: string): void => {
    setSatisfaction(value)
  }

  const onSubmit = (): void => {
    logAnalyticsEvent(Events.vama_feedback_submitted(taskCompleted, satisfaction))
    navigation.goBack()
  }

  const radioGroupProps: RadioGroupProps<string> = {
    isRadioList: false,
    onChange,
    options: [
      { labelKey: t('yes'), value: t('yes') },
      { labelKey: t('no'), value: t('no') },
    ],
    value: taskCompleted,
  }

  const radioGroupProps2: RadioGroupProps<string> = {
    isRadioList: false,
    onChange: onChange2,
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
    <LargePanel title={t('inAppFeedback.title')} rightButtonText={t('close')}>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('inAppFeedback.needYourFeedback.header')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('inAppFeedback.needYourFeedback.body')}
        </TextView>
        <Box
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.menuDivider as BorderColorVariant}>
          <TextView my={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.taskCompletedQuestion.header')}
          </TextView>
          <RadioGroup {...radioGroupProps} />
        </Box>
        <Box
          borderTopWidth={theme.dimensions.borderWidth}
          borderColor={theme.colors.border.menuDivider as BorderColorVariant}>
          <TextView my={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.overallSatisfaction.header')}
          </TextView>
          <RadioGroup {...radioGroupProps2} />
        </Box>
        <Button onPress={onSubmit} label={t('submit')} />
      </Box>
    </LargePanel>
  )
}

export default InAppFeedbackScreen
