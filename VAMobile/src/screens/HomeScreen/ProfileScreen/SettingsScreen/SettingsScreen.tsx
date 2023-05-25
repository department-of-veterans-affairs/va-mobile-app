import { Share } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { AuthState, setBiometricsPreference } from 'store/slices'
import { Box, ButtonDecoratorType, FeatureLandingTemplate, LoadingComponent, SignoutButton, SimpleList, SimpleListItemObj } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { getSupportedBiometricA11yLabel, getSupportedBiometricText } from 'utils/formattingUtils'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import { useAppDispatch, useExternalLink, useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'styled-components'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import getEnv from 'utils/env'

const { SHOW_DEBUG_MENU, LINK_URL_PRIVACY_POLICY, APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()

type SettingsScreenProps = StackScreenProps<HomeStackParamList, 'Settings'>

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme() as VATheme
  const launchExternalLink = useExternalLink()
  const { canStoreWithBiometric, shouldStoreWithBiometric, settingBiometricPreference, supportedBiometric } = useSelector<RootState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)

  const onToggleTouchId = (): void => {
    // toggle the value from previous state
    const newPrefValue = !shouldStoreWithBiometric
    dispatch(setBiometricsPreference(newPrefValue))
  }

  const supportedBiometricText = getSupportedBiometricText(supportedBiometric || '', t)
  const supportedBiometricA11yLabel = getSupportedBiometricA11yLabel(supportedBiometric || '', t)

  const biometricRow: SimpleListItemObj = {
    text: t('biometric.title', { biometricType: supportedBiometricText }),
    a11yHintText: t('biometric.a11yHint', { biometricType: supportedBiometricText }),
    onPress: onToggleTouchId,
    decorator: ButtonDecoratorType.Switch,
    decoratorProps: { on: shouldStoreWithBiometric, a11yHint: t('biometric.a11yHint', { biometricType: supportedBiometricText }) },
    testId: t('biometric.title', { biometricType: supportedBiometricA11yLabel }),
  }

  const onManage = () => {
    navigation.navigate('ManageYourAccount')
  }

  const notificationsRow: SimpleListItemObj = {
    text: t('notifications.title'),
    a11yHintText: t('notifications.a11yHint'),
    onPress: navigateTo('NotificationsSettings'),
  }

  const onDebug = navigateTo('Developer')

  const onShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: t('shareApp.text', { appleStoreLink: APPLE_STORE_LINK, googlePlayLink: GOOGLE_PLAY_LINK }),
      })
    } catch (e) {
      logNonFatalErrorToFirebase(e, 'onShare: Settings Error')
      console.error(e)
    }
  }

  const onPrivacyPolicy = async (): Promise<void> => {
    launchExternalLink(LINK_URL_PRIVACY_POLICY)
  }

  const items: Array<SimpleListItemObj> = _.flatten([
    { text: t('manageAccount.title'), a11yHintText: t('manageAccount.a11yHint'), onPress: onManage },
    // don't even show the biometrics option if it's not available
    canStoreWithBiometric ? biometricRow : [],
    notificationsRow,
    { text: t('shareApp.title'), a11yHintText: t('shareApp.a11yHint'), onPress: onShare },
    { text: t('privacyPolicy.title'), a11yHintText: t('privacyPolicy.a11yHint'), onPress: onPrivacyPolicy },
  ])

  const debugMenu = (): ReactNode => {
    const debugButton: Array<SimpleListItemObj> = [
      {
        text: t('debug.title'),
        a11yHintText: t('debug.a11yHint'),
        onPress: onDebug,
      },
    ]

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <SimpleList items={debugButton} />
      </Box>
    )
  }

  if (settingBiometricPreference) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('settings.title')}>
        <LoadingComponent text={t('biometricsPreference.saving')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('settings.title')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} flex={1}>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <SimpleList items={items} />
          {(SHOW_DEBUG_MENU || demoMode) && debugMenu()}
        </Box>
        <Box px={theme.dimensions.gutter}>
          <SignoutButton />
        </Box>
      </Box>
      <AppVersionAndBuild />
    </FeatureLandingTemplate>
  )
}

export default SettingsScreen
