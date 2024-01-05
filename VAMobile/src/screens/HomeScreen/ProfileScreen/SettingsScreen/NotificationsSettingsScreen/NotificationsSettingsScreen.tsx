import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { AlertBox, Box, ButtonDecoratorType, ErrorComponent, FeatureLandingTemplate, LoadingComponent, SimpleList, SimpleListItemObj, TextView, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { Notifications } from 'react-native-notifications'
import { NotificationsState, loadPushPreferences, registerDevice, setPushPref } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { StackScreenProps } from '@react-navigation/stack'
import { logAnalyticsEvent } from 'utils/analytics'
import { screenContentAllowed } from 'utils/waygateConfig'
import { useAppDispatch, useError, useOnResumeForeground, useTheme } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

const NotificationsSettingsScreen: FC<NotificationsSettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const hasError = useError(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN)
  const theme = useTheme()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const { deviceToken, preferences, loadingPreferences, registeringDevice, systemNotificationsOn, settingPreference } = useSelector<RootState, NotificationsState>(
    (state) => state.notifications,
  )
  const goToSettings = () => {
    logAnalyticsEvent(Events.vama_click(t('notifications.settings.alert.openSettings'), t('notifications.title')))
    Linking.openSettings()
  }
  const dispatch = useAppDispatch()

  useOnResumeForeground(() => {
    if (deviceToken) {
      dispatch(loadPushPreferences(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN))
    } else {
      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        dispatch(registerDevice(event.deviceToken, true))
      })
      Notifications.events().registerRemoteNotificationsRegistrationFailed(() => {
        dispatch(registerDevice())
      })
      Notifications.registerRemoteNotifications()
    }
  })

  useEffect(() => {
    if (screenContentAllowed('WG_NotificationsSettings')) {
      dispatch(loadPushPreferences(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN))
    }
  }, [dispatch])

  const preferenceList = (): ReactNode => {
    const prefsItems = preferences.map((pref): SimpleListItemObj => {
      return {
        a11yHintText: t('notifications.settings.switch.a11yHint', { notificationChannelName: pref.preferenceName }),
        text: pref.preferenceName,
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: pref.value,
        },
        onPress: () => {
          logAnalyticsEvent(Events.vama_toggle(pref.preferenceName, !pref.value, t('notifications.title')))
          dispatch(setPushPref(pref))
        },
      }
    })
    return (
      <Box mt={condensedMarginBetween}>
        <SimpleList items={prefsItems} />
      </Box>
    )
  }

  const loadingCheck = loadingPreferences || registeringDevice || settingPreference

  return (
    <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('notifications.title')}>
      {hasError ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN} />
      ) : loadingCheck ? (
        <LoadingComponent text={settingPreference ? t('notifications.saving') : t('notifications.loading')} />
      ) : (
        <Box mb={contentMarginBottom}>
          {systemNotificationsOn ? (
            <>
              <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter}>
                {t('notifications.settings.personalize.heading')}
              </TextView>
              <TextView variant={'MobileBody'} accessibilityRole={'header'} mx={gutter} mt={condensedMarginBetween}>
                {t('notifications.settings.personalize.text.systemNotificationsOn')}
              </TextView>
              {preferenceList()}
            </>
          ) : (
            <AlertBox border={'informational'} title={t('notifications.settings.alert.title')} text={t('notifications.settings.alert.text')}>
              <Box mt={standardMarginBetween}>
                <VAButton onPress={goToSettings} label={t('notifications.settings.alert.openSettings')} buttonType={'buttonPrimary'} />
              </Box>
            </AlertBox>
          )}
          <TextView variant={'TableFooterLabel'} mx={gutter} mt={condensedMarginBetween}>
            {t('notifications.settings.privacy')}
          </TextView>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default NotificationsSettingsScreen
