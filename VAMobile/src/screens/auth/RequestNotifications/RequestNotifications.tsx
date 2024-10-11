import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeRequestNotifications, setNotificationsPreferenceScreen, setRequestNotifications } from 'store/slices'
import { useAppDispatch, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>

function BiometricsPreferenceScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const onSkip = (): void => {
    console.log('onSkip')
    completeRequestNotifications()
    dispatch(setNotificationsPreferenceScreen(false))
  }

  const onUseNotifications = (): void => {
    console.log('onUse')
    completeRequestNotifications()
    dispatch(setRequestNotifications(true))
    dispatch(setNotificationsPreferenceScreen(false))
  }

  return (
    <VAScrollView>
      <Box mt={60} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="BitterHeading" accessibilityRole="header">
          {t('requestNotifications.stayUpdated')}
        </TextView>
        <TextView
          variant="MobileBody"
          mt={theme.dimensions.textAndButtonLargeMargin}
          mb={theme.dimensions.standardMarginBetween}>
          {t('requestNotifications.getNotified')}
        </TextView>
        <TextView paragraphSpacing={true} variant="MobileBody">
          {t('requestNotifications.youCanChange')}
        </TextView>
        <Button onPress={onUseNotifications} label={t('requestNotifications.turnOn')} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button onPress={onSkip} label={t('requestNotifications.skip')} buttonType={ButtonVariants.Secondary} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BiometricsPreferenceScreen
