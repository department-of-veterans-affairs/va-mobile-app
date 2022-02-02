import { Share, StyleProp, ViewStyle } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { Box, ButtonDecoratorType, SignoutButton, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { getSupportedBiometricA11yLabel, getSupportedBiometricText } from 'utils/formattingUtils'

import { setBiometricsPreference } from 'store/slices/authSlice'
import { testIdProps } from 'utils/accessibility'

import { AuthState } from 'store/slices'
import { RootState } from 'store'
import { useAppDispatch, useExternalLink, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import getEnv from 'utils/env'

const { SHOW_DEBUG_MENU, LINK_URL_PRIVACY_POLICY, APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()

type SettingsScreenProps = StackScreenProps<ProfileStackParamList, 'Settings'>

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const { canStoreWithBiometric, shouldStoreWithBiometric, supportedBiometric } = useSelector<RootState, AuthState>((state) => state.auth)

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
    decoratorProps: { on: shouldStoreWithBiometric },
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

  const onDebug = navigateTo('Debug')

  const onShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: t('shareApp.text', { appleStoreLink: APPLE_STORE_LINK, googlePlayLink: GOOGLE_PLAY_LINK }),
      })
    } catch (e) {
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

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

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

  return (
    <VAScrollView {...testIdProps('Settings-page')} contentContainerStyle={mainViewStyle}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} flex={1}>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <SimpleList items={items} />
          {SHOW_DEBUG_MENU && debugMenu()}
        </Box>
        <Box px={theme.dimensions.gutter}>
          <SignoutButton />
        </Box>
      </Box>
      <AppVersionAndBuild />
    </VAScrollView>
  )
}

export default SettingsScreen
