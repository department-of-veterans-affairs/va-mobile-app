import { Linking, Share } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { AuthState, StoreState } from 'store'
import { Box, ButtonDecoratorType, List, ListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileScreen'
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

  console.log('SETTINGS ----')
  console.log('canStoreWithBiometric')
  console.log(canStoreWithBiometric)
  console.log('shouldStoreWithBiometric')
  console.log(shouldStoreWithBiometric)
  console.log('supportedBiometric')
  console.log(supportedBiometric)

  const onToggleTouchId = (): void => {
    // toggle the value from previous state
    const newPrefValue = !shouldStoreWithBiometric
    dispatch(setBiometricsPreference(newPrefValue))
  }

  const touchIdRow: ListItemObj = {
    textLines: t('biometric.title', { biometricType: supportedBiometric }),
    a11yHintText: t('biometric.a11yHint', { biometricType: supportedBiometric }),
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

  const onPrivacyPolicy = (): void => {
    Linking.openURL(LINK_URL_PRIVACY_POLICY)
  }

  const items: Array<ListItemObj> = _.flatten([
    { textLines: t('manageAccount.title'), a11yHintText: t('manageAccount.a11yHint'), onPress: navigateTo('ManageYourAccount') },
    // don't even show the biometrics option if it's not available
    canStoreWithBiometric ? touchIdRow : [],
    { textLines: t('shareApp.title'), a11yHintText: t('shareApp.a11yHint'), onPress: onShare },
    { textLines: t('privacyPolicy.title'), a11yHintText: t('privacyPolicy.a11yHint'), onPress: onPrivacyPolicy },
  ])

  const showDebugMenu = (): ReactNode => {
    if (!SHOW_DEBUG_MENU) {
      return null
    }

    const debugButton: Array<ListItemObj> = [
      {
        textLines: t('debug.title'),
        a11yHintText: t('debug.a11yHint'),
        onPress: onDebug,
      },
    ]

    return (
      <Box mt={theme.dimensions.marginBetween}>
        <List items={debugButton} />
      </Box>
    )
  }

  const createLogoutButton = (): ReactNode => {
    const logoutButton: Array<ListItemObj> = [
      {
        textLines: [
          {
            text: t('logout.title'),
            color: 'error',
            textAlign: 'center',
          },
        ],
        a11yHintText: t('logout.title'),
        decorator: ButtonDecoratorType.None,
        onPress: onLogout,
      },
    ]

    return <List items={logoutButton} />
  }

  return (
    <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} {...testIdProps('Settings-screen')}>
      <Box mb={theme.dimensions.marginBetween}>
        <List items={items} />
        {showDebugMenu()}
      </Box>
      {createLogoutButton()}
    </Box>
  )
}

export default SettingsScreen
