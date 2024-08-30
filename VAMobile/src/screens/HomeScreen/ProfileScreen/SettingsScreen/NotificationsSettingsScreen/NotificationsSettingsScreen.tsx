import React, { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking } from 'react-native'
import { Notifications } from 'react-native-notifications'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

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
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { NotificationsState, loadPushPreferences, registerDevice, setPushPref } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useAppDispatch, useError, useOnResumeForeground, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

const { LINK_URL_VA_NOTIFICATIONS } = getEnv()

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

function NotificationsSettingsScreen({ navigation }: NotificationsSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const hasError = useError(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN)
  const theme = useTheme()
  const { gutter, contentMarginBottom, condensedMarginBetween } = theme.dimensions
  const { deviceToken, preferences, loadingPreferences, registeringDevice, systemNotificationsOn, settingPreference } =
    useSelector<RootState, NotificationsState>((state) => state.notifications)
  const goToSettings = () => {
    logAnalyticsEvent(Events.vama_click(t('notifications.settings.alert.openSettings'), t('notifications.title')))
    Alert.alert(t('leavingApp.title'), t('leavingApp.body.settings'), [
      {
        text: t('leavingApp.cancel'),
        style: 'cancel',
      },
      { text: t('leavingApp.ok'), onPress: () => Linking.openSettings(), style: 'default' },
    ])
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
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('notifications.title')}>
      {hasError ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN} />
      ) : loadingCheck ? (
        <LoadingComponent text={settingPreference ? t('notifications.saving') : t('notifications.loading')} />
      ) : (
        <Box mb={contentMarginBottom}>
          {systemNotificationsOn ? (
            <>
              <TextView variant={'MobileBody'} accessibilityRole={'header'} mx={gutter}>
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
            />
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default NotificationsSettingsScreen
