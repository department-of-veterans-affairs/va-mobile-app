import React from 'react'
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { useNotificationContext } from 'components/NotificationManager'
import { NAMESPACE } from 'constants/namespaces'
import { useAppDispatch, useTheme } from 'utils/hooks'

const NOTIFICATION_COMPLETED_KEY = '@store_notification_preference_complete'
const FIRST_NOTIFICATION_STORAGE_VAL = 'COMPLETE'

export type SyncScreenProps = Record<string, unknown>

function RequestNotificationsScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const { setRequestNotifications, setRequestNotificationPreferenceScreen } = useNotificationContext()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const onSkip = (): void => {
    //This sets the async storage to not display this screen again
    AsyncStorage.setItem(NOTIFICATION_COMPLETED_KEY, FIRST_NOTIFICATION_STORAGE_VAL)
    //This sets the state variable for the session
    setRequestNotificationPreferenceScreen(false)
  }

  const onUseNotifications = (): void => {
    AsyncStorage.setItem(NOTIFICATION_COMPLETED_KEY, FIRST_NOTIFICATION_STORAGE_VAL)
    setRequestNotificationPreferenceScreen(false)
    //This actually triggers the notification manager code to request via OS.
    setRequestNotifications(true)
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
        <Button
          onPress={onUseNotifications}
          label={t('requestNotifications.turnOn')}
          testID="RequestNotificationTurnOnID"
        />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button onPress={onSkip} label={t('requestNotifications.skip')} buttonType={ButtonVariants.Secondary} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default RequestNotificationsScreen
