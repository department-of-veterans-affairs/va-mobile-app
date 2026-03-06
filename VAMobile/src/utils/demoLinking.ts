import AsyncStorage from '@react-native-async-storage/async-storage'

import { DEMO_USER } from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DeveloperScreen'
import { AppDispatch } from 'store'
import DemoUsers from 'store/api/demo/mocks/users'
import {
  ANDROID_FIRST_LOGIN_COMPLETED_KEY,
  FIRST_LOGIN_COMPLETED_KEY,
  FIRST_LOGIN_STORAGE_VAL,
  NEW_SESSION,
  NOTIFICATION_COMPLETED_KEY,
  checkFirstTimeLogin,
  checkRequestNotificationsPreferenceScreen,
  logInDemoMode,
} from 'store/slices'
import { updateDemoMode } from 'store/slices/demoSlice'
import getEnv from 'utils/env'
import { isAndroid } from 'utils/platform'

export async function handleDemoDeepLink(url: string, dispatch: AppDispatch): Promise<boolean> {
  try {
    const { DEMO_PASSWORD, IS_TEST } = getEnv()
    const isTestOrDev = IS_TEST === true || __DEV__
    if (!isTestOrDev || !url?.includes('demo=true')) {
      return false
    }

    const query = url.split('?')[1] || ''
    const params = query.split('&').reduce(
      (acc, part) => {
        const [key, value] = part.split('=')
        if (key) {
          acc[key] = decodeURIComponent(value || '')
        }
        return acc
      },
      {} as Record<string, string>,
    )

    const password = params.password
    const demoUserParam = params.demoUser
    const skipOnboarding = params.skipOnboarding !== 'false'
    const skipNotifications = params.skipNotifications !== 'false'
    const autoLogin = params.autoLogin !== 'false'

    if (DEMO_PASSWORD !== undefined && DEMO_PASSWORD !== '' && password !== DEMO_PASSWORD && !IS_TEST) {
      return false
    }

    const validDemoUserIds = Object.keys(DemoUsers)
    const demoUser = demoUserParam && validDemoUserIds.includes(demoUserParam) ? demoUserParam : 'kimberlyWashington'

    await Promise.all([AsyncStorage.setItem(DEMO_USER, demoUser), AsyncStorage.setItem(NEW_SESSION, 'true')])

    if (skipOnboarding) {
      if (isAndroid()) {
        await AsyncStorage.setItem(ANDROID_FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
      } else {
        await AsyncStorage.setItem(FIRST_LOGIN_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
      }
    }

    if (skipNotifications) {
      await AsyncStorage.setItem(NOTIFICATION_COMPLETED_KEY, FIRST_LOGIN_STORAGE_VAL)
    }

    // Activate demo mode so demoMode=true in store before re-checks
    await dispatch(updateDemoMode(true, demoUser))

    // Re-check with correct demoMode state
    if (IS_TEST) {
      await Promise.all([dispatch(checkFirstTimeLogin()), dispatch(checkRequestNotificationsPreferenceScreen())])
    }

    if (autoLogin) {
      await dispatch(logInDemoMode())
    }

    return true
  } catch (e) {
    console.error('handleDemoDeepLink error:', e)
    return false
  }
}
