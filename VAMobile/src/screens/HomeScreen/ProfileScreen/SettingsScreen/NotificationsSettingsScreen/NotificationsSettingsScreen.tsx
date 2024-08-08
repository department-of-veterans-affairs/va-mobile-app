import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking } from 'react-native'
import { Notifications } from 'react-native-notifications'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { MutateOptions, useQueryClient } from '@tanstack/react-query'

import {
  DEVICE_ENDPOINT_SID,
  notificationKeys,
  useLoadPushNotification,
  useLoadPushPreferences,
  useLoadSystemNotificationsSettings,
  useRegisterDevice,
  useSetPushPref,
} from 'api/notifications'
import { PushRegistrationResponse, RegisterDeviceParams } from 'api/types'
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
import { ScreenIDTypesConstants } from 'store/api/types'
import { logAnalyticsEvent } from 'utils/analytics'
import { useOnResumeForeground, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

function NotificationsSettingsScreen({ navigation }: NotificationsSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const isFocused = useIsFocused()
  const {
    data: pushPreferences,
    isFetching: loadingPreferences,
    error: hasError,
    refetch: refetchPushPreferences,
  } = useLoadPushPreferences({ enabled: screenContentAllowed('WG_NotificationsSettings') })
  const { data: notificationData } = useLoadPushNotification()
  const { data: systemNotificationData, isFetching: loadingSystemNotification } = useLoadSystemNotificationsSettings({
    enabled: isFocused && screenContentAllowed('WG_NotificationsSettings'),
  })
  const { mutate: registerDevice, isPending: registeringDevice } = useRegisterDevice()
  const { mutate: setPushPref, isPending: settingPreference } = useSetPushPref()

  const openSettings = () => {
    queryClient.invalidateQueries({
      queryKey: [notificationKeys.systemNotifications],
    })
    Linking.openSettings()
  }
  const goToSettings = () => {
    logAnalyticsEvent(Events.vama_click(t('notifications.settings.alert.openSettings'), t('notifications.title')))
    Alert.alert(t('leavingApp.title'), t('leavingApp.body.settings'), [
      {
        text: t('leavingApp.cancel'),
        style: 'cancel',
      },
      { text: t('leavingApp.ok'), onPress: openSettings, style: 'default' },
    ])
  }

  const fetchPreferences = async () => {
    const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)

    if (endpoint_sid && notificationData?.deviceToken) {
      refetchPushPreferences()
    } else {
      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        const registerParams = {
          deviceToken: event.deviceToken,
        }
        const mutateOptions: MutateOptions<PushRegistrationResponse | undefined, Error, RegisterDeviceParams, unknown> =
          {
            onSettled: () => {
              refetchPushPreferences()
            },
          }
        registerDevice(registerParams, mutateOptions)
      })
      Notifications.events().registerRemoteNotificationsRegistrationFailed(() => {
        const registerParams = {
          deviceToken: undefined,
        }
        const mutateOptions: MutateOptions<PushRegistrationResponse | undefined, Error, RegisterDeviceParams, unknown> =
          {
            onSettled: () => {
              refetchPushPreferences()
            },
          }
        registerDevice(registerParams, mutateOptions)
      })
      Notifications.registerRemoteNotifications()
    }
  }

  useOnResumeForeground(fetchPreferences)

  const preferenceList = (): ReactNode => {
    if (pushPreferences) {
      const prefsItems = pushPreferences.preferences.map((pref): SimpleListItemObj => {
        return {
          a11yHintText: t('notifications.settings.switch.a11yHint', { notificationChannelName: pref.preferenceName }),
          text: pref.preferenceName,
          decorator: ButtonDecoratorType.Switch,
          decoratorProps: {
            on: pref.value,
          },
          onPress: () => {
            logAnalyticsEvent(Events.vama_toggle(pref.preferenceName, !pref.value, t('notifications.title')))
            setPushPref(pref)
          },
        }
      })
      return (
        <Box mt={condensedMarginBetween}>
          <SimpleList items={prefsItems} />
        </Box>
      )
    }
    return <></>
  }

  const loadingCheck = loadingPreferences || loadingSystemNotification || registeringDevice || settingPreference

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('notifications.title')}>
      {loadingCheck ? (
        <LoadingComponent text={settingPreference ? t('notifications.saving') : t('notifications.loading')} />
      ) : hasError ||
        (systemNotificationData?.systemNotificationsOn && pushPreferences && pushPreferences.preferences.length < 1) ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN}
          error={hasError}
          onTryAgain={fetchPreferences}
        />
      ) : (
        <Box mb={contentMarginBottom}>
          {systemNotificationData?.systemNotificationsOn ? (
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
