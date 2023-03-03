import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { AlertBox, Box, ButtonDecoratorType, ErrorComponent, FeatureLandingTemplate, LoadingComponent, SimpleList, SimpleListItemObj, TextView, VAButton } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { Notifications } from 'react-native-notifications'
import { NotificationsState, loadPushPreferences, registerDevice, setPushPref } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { StackScreenProps } from '@react-navigation/stack'
import { useAppDispatch, useError, useOnResumeForeground, useTheme } from 'utils/hooks'
import React, { FC, ReactNode, useEffect } from 'react'

type NotificationsSettingsScreenProps = StackScreenProps<HomeStackParamList, 'NotificationsSettings'>

const NotificationsSettingsScreen: FC<NotificationsSettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const hasError = useError(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN)
  const theme = useTheme()
  const { gutter, contentMarginTop, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const { preferences, loadingPreferences, registeringDevice, systemNotificationsOn, settingPreference } = useSelector<RootState, NotificationsState>(
    (state) => state.notifications,
  )
  const goToSettings = () => {
    Linking.openSettings()
  }
  const { deviceToken } = useSelector<RootState, NotificationsState>((state) => state.notifications)
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
    dispatch(loadPushPreferences(ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN))
  }, [dispatch])

  const alert = (): ReactNode => {
    return (
      <AlertBox border={'informational'} title={t('notifications.settings.alert.title')} text={t('notifications.settings.alert.text')}>
        <Box mt={standardMarginBetween}>
          <VAButton onPress={goToSettings} label={t('notifications.settings.alert.openSettings')} buttonType={'buttonPrimary'} />
        </Box>
      </AlertBox>
    )
  }

  if (hasError) {
    return (
      <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('notifications.settings.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.NOTIFICATIONS_SETTINGS_SCREEN} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingPreferences || registeringDevice) {
    return <LoadingComponent text={t('notifications.loading')} />
  }

  if (settingPreference) {
    return <LoadingComponent text={t('notifications.saving')} />
  }

  const personalizeText = systemNotificationsOn
    ? t('notifications.settings.personalize.text.systemNotificationsOn')
    : t('notifications.settings.personalize.text.systemNotificationsOff')

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
  return (
    <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('notifications.settings.title')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        {!systemNotificationsOn && alert()}
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter} mt={standardMarginBetween}>
          {t('notifications.settings.personalize.heading')}
        </TextView>
        <TextView variant={'MobileBody'} accessibilityRole={'header'} mx={gutter} mt={condensedMarginBetween}>
          {personalizeText}
        </TextView>
        {preferenceList()}
        <TextView variant={'TableFooterLabel'} mx={gutter} mt={condensedMarginBetween}>
          {t('notifications.settings.privacy')}
        </TextView>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default NotificationsSettingsScreen
