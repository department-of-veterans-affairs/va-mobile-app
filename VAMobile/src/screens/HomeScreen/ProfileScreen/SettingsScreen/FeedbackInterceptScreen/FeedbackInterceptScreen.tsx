import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, RadioButton, RadioButtonProps } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { RootNavStackParamList } from 'App'

import { BorderColorVariant, Box, LargePanel, TextView } from 'components'
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

  const radioButtonProps: RadioButtonProps = {
    onSelectionChange: (s) => setSatisfaction(s as string),
    items: [
      t('inAppFeedback.overallSatisfaction.notAtAllSatisfied'),
      t('inAppFeedback.overallSatisfaction.dissatisfied'),
      t('inAppFeedback.overallSatisfaction.neither'),
      t('inAppFeedback.overallSatisfaction.satisfied'),
      t('inAppFeedback.overallSatisfaction.verySatisfied'),
    ],
    selectedItem: satisfaction,
  }

  return (
    <LargePanel title={t('giveFeedback')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {t('inAppFeedback.overallSatisfaction.header')}
          </TextView>
          <RadioButton {...radioButtonProps} />
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
