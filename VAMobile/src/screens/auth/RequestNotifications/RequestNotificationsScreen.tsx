import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeRequestNotifications, setNotificationsPreferenceScreen, setRequestNotifications } from 'store/slices'
import { useAppDispatch, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>

function RequestNotificationsScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const onSkip = (): void => {
    //This sets the async storage to not display this screen again
    dispatch(completeRequestNotifications())
    //This sets the state variable for the session
    dispatch(setNotificationsPreferenceScreen(false))
  }

  const onUseNotifications = (): void => {
    dispatch(completeRequestNotifications())
    dispatch(setNotificationsPreferenceScreen(false))
    //This actually triggers the notification manager code to request via OS.
    dispatch(setRequestNotifications(true))
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

export default RequestNotificationsScreen
