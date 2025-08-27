import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { RootNavStackParamList } from 'App'

import { BorderColorVariant, Box, LargePanel, RadioGroup, RadioGroupProps, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useExternalLink, useTheme } from 'utils/hooks'

const { LINK_URL_OMB_PAGE } = getEnv()

type FeedbackInterceptScreenProps = StackScreenProps<RootNavStackParamList, 'FeedbackIntercept'>

function FeedbackInterceptScreen({ navigation, route }: FeedbackInterceptScreenProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [satisfaction, setSatisfaction] = useState('')
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
    logAnalyticsEvent(Events.vama_feedback_submitted(screen, '', satisfaction))
    submittedCheck = true
    navigation.goBack()
    snackbar.show(t('inAppFeedback.snackbar.success'))
  }

  const radioGroupProps: RadioGroupProps<string> = {
    isRadioList: false,
    onChange: setSatisfaction,
    options: [
      {
        optionLabelKey: t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
        value: t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
      },
      {
        optionLabelKey: t('inAppFeedback.overallSatisfaction.dissatisfied'),
        value: t('inAppFeedback.overallSatisfaction.dissatisfied'),
      },
      {
        optionLabelKey: t('inAppFeedback.overallSatisfaction.neither'),
        value: t('inAppFeedback.overallSatisfaction.neither'),
      },
      {
        optionLabelKey: t('inAppFeedback.overallSatisfaction.satisfied'),
        value: t('inAppFeedback.overallSatisfaction.satisfied'),
      },
      {
        optionLabelKey: t('inAppFeedback.overallSatisfaction.verySatisfied'),
        value: t('inAppFeedback.overallSatisfaction.verySatisfied'),
      },
    ],
    value: satisfaction,
  }

  return (
    <LargePanel title={t('giveFeedback')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
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

export default FeedbackInterceptScreen
