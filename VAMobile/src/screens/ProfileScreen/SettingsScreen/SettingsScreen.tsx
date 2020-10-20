import { Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'

import { AuthState, StoreState } from 'store'
import { Box, ButtonDecoratorType, ButtonList, ButtonListItemObj } from 'components'
import { ProfileStackParamList } from '../ProfileScreen'
import { StackScreenProps } from '@react-navigation/stack'
import { logout, setBiometricsPreference } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { SHOW_DEBUG_MENU } = getEnv()

type SettingsScreenProps = StackScreenProps<ProfileStackParamList, 'Settings'>

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const t = useTranslation('settings')
  const theme = useTheme()
  const { canStoreWithBiometric, shouldStoreWithBiometric } = useSelector<StoreState, AuthState>((s) => s.auth)
  const onLogout = (): void => {
    dispatch(logout())
  }

  const onNoop = (): void => {
    //noop TODO implement features
  }

  const onToggleTouchId = (): void => {
    // toggle the value from previous state
    const newPrefValue = !shouldStoreWithBiometric
    dispatch(setBiometricsPreference(newPrefValue))
  }

  const touchIdRow: ButtonListItemObj = {
    textIDs: 'touchId.title',
    a11yHintID: 'touchId.a11yHint',
    onPress: onToggleTouchId,
    decorator: ButtonDecoratorType.Switch,
    decoratorProps: { on: shouldStoreWithBiometric },
  }

  const onDebug = (): void => {
    navigation.navigate('Debug')
  }

  const items: Array<ButtonListItemObj> = _.flatten([
    { textIDs: 'manageAccount.title', a11yHintID: 'manageAccount.a11yHint', onPress: onNoop },
    // don't even show the biometrics option if it's not available
    canStoreWithBiometric ? touchIdRow : [],
    { textIDs: 'shareApp.title', a11yHintID: 'shareApp.a11yHint', onPress: onNoop },
    { textIDs: 'privacyPolicy.title', a11yHintID: 'privacyPolicy.a11yHint', onPress: onNoop },
  ])

  const showDebugMenu = (): ReactNode => {
    if (!SHOW_DEBUG_MENU) {
      return null
    }

    const debugButton: Array<ButtonListItemObj> = [
      {
        textIDs: 'debug.title',
        a11yHintID: 'debug.a11yHint',
        onPress: onDebug,
      },
    ]

    return (
      <Box mt={20}>
        <ButtonList items={debugButton} translationNameSpace={'settings'} />
      </Box>
    )
  }

  return (
    <View {...testIdProps('Settings-screen')}>
      <Box my={32}>
        <ButtonList items={items} translationNameSpace={'settings'} />
        {showDebugMenu()}
      </Box>
      <Button color={theme.colors.text.error} title={t('logout.title')} {...testIdProps('logout')} onPress={onLogout} />
    </View>
  )
}

export default SettingsScreen
