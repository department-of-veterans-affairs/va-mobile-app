import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import {
  BorderColorVariant,
  Box,
  LargePanel,
  PickerItem,
  RadioGroup,
  RadioGroupProps,
  TextView,
  VAModalPicker,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'

type InAppFeedbackScreenProps = StackScreenProps<HomeStackParamList, 'InAppFeedback'>

function InAppFeedbackScreen({ navigation, route }: InAppFeedbackScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [taskCompleted, setTaskCompleted] = useState('')
  const [satisfaction, setSatisfaction] = useState('')
  let task = route?.params?.task || ''
  const [taskSelected, setTaskSelected] = useState(task)

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

  const getInAppFeedbackCategoryPickerOptions = (): Array<PickerItem> => {
    return [
      {
        value: 'Cancel Appointment',
        label: 'Cancel Appointment',
      },
      {
        value: 'Review Appointment',
        label: 'Review Appointment',
      },
      {
        value: 'Review Claim',
        label: 'Review Claim',
      },
      {
        value: 'Submit Claim',
        label: 'Submit Claim',
      },
      {
        value: 'Submit Claim Evidence',
        label: 'Submit Claim Evidence',
      },
      {
        value: 'Submit File Request',
        label: 'Submit File Request',
      },
      {
        value: 'Read New Message',
        label: 'Read New Message',
      },
      {
        value: 'Send New Message',
        label: 'Send New Message',
      },
      {
        value: 'Review Prescription',
        label: 'Review Prescription',
      },
      {
        value: 'Refill Prescription',
        label: 'Refill Prescription',
      },
      {
        value: 'Track Prescription',
        label: 'Refill Prescription',
      },
      {
        value: 'View Vaccine Record',
        label: 'View Vaccine Record',
      },
      {
        value: 'View Letters',
        label: 'View Letters',
      },
    ]
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
            {t('inAppFeedback.taskSelection.header')}
          </TextView>
          <VAModalPicker
            selectedValue={taskSelected || ''}
            onSelectionChange={setTaskSelected}
            pickerOptions={getInAppFeedbackCategoryPickerOptions()}
            includeBlankPlaceholder={true}
            disabled={!!route?.params?.task}></VAModalPicker>
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

//      fieldProps: {
//   labelKey: 'secureMessaging.startNewMessage.category',
//   selectedValue: category,
//   onSelectionChange: onCategoryChange,
//   pickerOptions: getStartNewMessageCategoryPickerOptions(t),
//   includeBlankPlaceholder: true,
//   isRequiredField: true,
//   testID: 'picker',
// },

export default InAppFeedbackScreen
