import { Linking, Share } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { AuthState, StoreState } from 'store'
import { Box, ButtonDecoratorType, List, ListItemObj, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { getSupportedBiometricText } from 'utils/formattingUtils'
import { logout, setBiometricsPreference } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { SHOW_DEBUG_MENU, LINK_URL_PRIVACY_POLICY, APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()

type SettingsScreenProps = StackScreenProps<ProfileStackParamList, 'Settings'>

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { canStoreWithBiometric, shouldStoreWithBiometric, supportedBiometric } = useSelector<StoreState, AuthState>((s) => s.auth)
  const onLogout = (): void => {
    dispatch(logout())
  }

  const onToggleTouchId = (): void => {
    // toggle the value from previous state
    const newPrefValue = !shouldStoreWithBiometric
    dispatch(setBiometricsPreference(newPrefValue))
  }

  const supportedBiometricText = getSupportedBiometricText(supportedBiometric || '', t)

  const biometricRow: ListItemObj = {
    textLines: t('biometric.title', { biometricType: supportedBiometricText }),
    a11yHintText: t('biometric.a11yHint', { biometricType: supportedBiometricText }),
    onPress: onToggleTouchId,
    decorator: ButtonDecoratorType.Switch,
    decoratorProps: { on: shouldStoreWithBiometric },
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
    await Linking.openURL(LINK_URL_PRIVACY_POLICY)
  }

  const items: Array<ListItemObj> = _.flatten([
    { textLines: t('manageAccount.title'), a11yHintText: t('manageAccount.a11yHint'), onPress: navigateTo('ManageYourAccount') },
    // don't even show the biometrics option if it's not available
    canStoreWithBiometric ? biometricRow : [],
    { textLines: t('shareApp.title'), a11yHintText: t('shareApp.a11yHint'), onPress: onShare },
    { textLines: t('privacyPolicy.title'), a11yHintText: t('privacyPolicy.a11yHint'), onPress: onPrivacyPolicy },
  ])

  const debugMenu = (): ReactNode => {
    const debugButton: Array<ListItemObj> = [
      {
        textLines: t('debug.title'),
        a11yHintText: t('debug.a11yHint'),
        onPress: onDebug,
      },
    ]

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <List items={debugButton} />
      </Box>
    )
  }

  const logoutButton = (): ReactNode => {
    const logoutButtonData: Array<ListItemObj> = [
      {
        textLines: [
          {
            text: t('logout.title'),
            color: 'error',
            textAlign: 'center',
            variant: 'MobileBody',
          },
        ],
        a11yHintText: t('logout.title'),
        decorator: ButtonDecoratorType.None,
        testId: 'logout',
        onPress: onLogout,
      },
    ]

    return <List items={logoutButtonData} />
  }

  return (
    <VAScrollView {...testIdProps('Settings-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <List items={items} />
          {SHOW_DEBUG_MENU && debugMenu()}
        </Box>
        {logoutButton()}
      </Box>
    </VAScrollView>
  )
}

export default SettingsScreen
