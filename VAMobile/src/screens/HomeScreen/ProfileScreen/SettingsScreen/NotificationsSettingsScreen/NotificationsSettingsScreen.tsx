import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking } from 'react-native'
import { Notifications } from 'react-native-notifications'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { MutateOptions, useQueryClient } from '@tanstack/react-query'

import {
  DEVICE_ENDPOINT_SID,
  DEVICE_TOKEN_KEY,
  notificationKeys,
  usePushPreferences,
  useRegisterDevice,
  useSystemNotificationsSettings,
  useUpdatePushPreferences,
} from 'api/notifications'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { PushRegistrationResponse, RegisterDeviceParams } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  ButtonDecoratorType,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextView,
} from 'components'
import { useNotificationContext } from 'components/NotificationManager'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useAppDispatch, useOnResumeForeground, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

const NOTIFICATION_COMPLETED_KEY = '@store_notification_preference_complete'
const FIRST_NOTIFICATION_STORAGE_VAL = 'COMPLETE'

const { LINK_URL_VA_NOTIFICATIONS } = getEnv()

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

function NotificationsSettingsScreen({ navigation }: NotificationsSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { gutter, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const isFocused = useIsFocused()

  const {
    data: systemNotificationData,
    isFetching: loadingSystemNotification,
    refetch: refetchSystemNotificationSettings,
  } = useSystemNotificationsSettings({
    enabled: screenContentAllowed('WG_NotificationsSettings'),
  })
  const {
    data: pushPreferences,
    isFetching: loadingPreferences,
    error: hasError,
    refetch: refetchPushPreferences,
  } = usePushPreferences({
    enabled:
      isFocused && systemNotificationData?.systemNotificationsOn && screenContentAllowed('WG_NotificationsSettings'),
  })
  const { data: personalInformation } = usePersonalInformation()
  const { mutate: registerDevice, isPending: registeringDevice } = useRegisterDevice()
  const { mutate: setPushPref, isPending: settingPreference } = useUpdatePushPreferences()
  const { requestNotifications, setRequestNotifications, setRequestNotificationPreferenceScreen } =
    useNotificationContext()

  const onUseNotifications = (): void => {
    AsyncStorage.setItem(NOTIFICATION_COMPLETED_KEY, FIRST_NOTIFICATION_STORAGE_VAL)
    setRequestNotificationPreferenceScreen(false)
    //This actually triggers the notification manager code to request via OS.
    setRequestNotifications(true)
  }

  const openSettings = () => {
    queryClient.invalidateQueries({
      queryKey: [notificationKeys.systemSettings],
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
    if (requestNotifications) {
      const endpoint_sid = await AsyncStorage.getItem(DEVICE_ENDPOINT_SID)
      const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY)

      if (endpoint_sid && deviceToken) {
        refetchPushPreferences()
      } else {
        Notifications.events().registerRemoteNotificationsRegistered((event) => {
          const registerParams = {
            deviceToken: event.deviceToken,
            userID: personalInformation?.id,
          }
          const mutateOptions: MutateOptions<
            PushRegistrationResponse | undefined,
            Error,
            RegisterDeviceParams,
            unknown
          > = {
            onSettled: () => {
              refetchPushPreferences()
            },
          }
          registerDevice(registerParams, mutateOptions)
        })
        Notifications.events().registerRemoteNotificationsRegistrationFailed(() => {
          const registerParams = {
            deviceToken: undefined,
            userID: undefined,
          }
          const mutateOptions: MutateOptions<
            PushRegistrationResponse | undefined,
            Error,
            RegisterDeviceParams,
            unknown
          > = {
            onSettled: () => {
              refetchPushPreferences()
            },
          }
          registerDevice(registerParams, mutateOptions)
        })
        Notifications.registerRemoteNotifications()
      }
    }
  }

  useOnResumeForeground(fetchPreferences)
  useOnResumeForeground(refetchSystemNotificationSettings)

  const preferenceList = (): ReactNode => {
    if (!pushPreferences) return <></>

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

  const loadingCheck = loadingPreferences || loadingSystemNotification || registeringDevice || settingPreference

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      backLabelTestID="backToSettingsScreenID"
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
          {!requestNotifications ? (
            <AlertWithHaptics
              variant="info"
              description={t('requestNotifications.getNotified')}
              primaryButton={{
                label: t('requestNotifications.turnOn'),
                onPress: onUseNotifications,
              }}
              testID="TurnOnNotificationsID"
            />
          ) : systemNotificationData?.systemNotificationsOn ? (
            <>
              <TextView variant={'MobileBody'} mx={gutter}>
                {t('notifications.settings.personalize.text.systemNotificationsOn')}
              </TextView>
              {preferenceList()}
            </>
          ) : (
            <AlertWithHaptics
              variant="info"
              description={t('notifications.settings.alert.text')}
              primaryButton={{
                label: t('notifications.settings.alert.openSettings'),
                onPress: goToSettings,
              }}
            />
          )}
          <TextView variant={'TableFooterLabel'} mx={gutter} mt={condensedMarginBetween}>
            {t('notifications.settings.privacy')}
          </TextView>
          <Box mx={gutter}>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_VA_NOTIFICATIONS}
              text={t('notifications.settings.link.text')}
              a11yLabel={a11yLabelVA(t('notifications.settings.link.text'))}
              testID="noficationSettingsLinkID"
            />
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default NotificationsSettingsScreen
