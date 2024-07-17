import React, { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { Notifications } from 'react-native-notifications'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import {
  AlertBox,
  Box,
  ButtonDecoratorType,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { DEVICE_ENDPOINT_SID, NotificationsState, loadPushPreferences, registerDevice, setPushPref } from 'store/slices'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useError, useOnResumeForeground, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

function NotificationsSettingsScreen({ navigation }: NotificationsSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const hasError = useError(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN)
  const theme = useTheme()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const { deviceToken, preferences, loadingPreferences, registeringDevice, systemNotificationsOn, settingPreference } =
    useSelector<RootState, NotificationsState>((state) => state.notifications)
  const goToSettings = () => {
    logAnalyticsEvent(Events.vama_click(t('notifications.settings.alert.openSettings'), t('notifications.title')))
    Linking.openSettings()
  }
  const dispatch = useAppDispatch()

  const fetchPreferences = async () => {
    const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
    if (endpoint_sid && deviceToken) {
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
  }

  useOnResumeForeground(fetchPreferences)

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
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('notifications.title')}>
      {loadingCheck ? (
        <LoadingComponent text={settingPreference ? t('notifications.saving') : t('notifications.loading')} />
      ) : hasError || (systemNotificationsOn && !preferences.length) ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN} onTryAgain={fetchPreferences} />
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
            <AlertBox
              border={'informational'}
              title={t('notifications.settings.alert.title')}
              text={t('notifications.settings.alert.text')}>
              <Box mt={standardMarginBetween}>
                <Button onPress={goToSettings} label={t('notifications.settings.alert.openSettings')} />
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
