import AsyncStorage from '@react-native-async-storage/async-storage'
import analytics from '@react-native-firebase/analytics'

import { AppDispatch } from 'store'
import DemoUsers from 'store/api/demo/mocks/users'
import {
  ANDROID_FIRST_LOGIN_COMPLETED_KEY,
  DEMO_USER_STORAGE_KEY,
  FIRST_LOGIN_COMPLETED_KEY,
  FIRST_LOGIN_STORAGE_VAL,
  NEW_SESSION,
  NOTIFICATION_COMPLETED_KEY,
  checkFirstTimeLogin,
  checkRequestNotificationsPreferenceScreen,
  logInDemoMode,
} from 'store/slices/authSlice'
import { updateDemoMode } from 'store/slices/demoSlice'
import getEnv from 'utils/env'
import { isAndroid } from 'utils/platform'

export const NAVIGABLE_DEEP_LINK_PATHS = ['messages/', 'appointments/']

/**
 * Checks if a deep link URL is one that we want to navigate to after login.
 */
export function isNavigableDeepLink(url: string | null | undefined): boolean {
  if (!url) {
    return false
  }
  return NAVIGABLE_DEEP_LINK_PATHS.some((path) => url.includes(path))
}

/**
 * Logs campaign analytics if a deep link URL contains UTM parameters.
 */
export async function logCampaignAnalytics(url: string | null | undefined): Promise<void> {
  if (!url) {
    return
  }

  try {
    const { searchParams } = new URL(url.replace('vamobile://', 'https://'))
    const utm_campaign = searchParams.get('utm_campaign')
    const utm_medium = searchParams.get('utm_medium')
    const utm_source = searchParams.get('utm_source')
    const utm_term = searchParams.get('utm_term')

    if (utm_campaign || utm_medium || utm_source || utm_term) {
      await analytics().logCampaignDetails({
        campaign: utm_campaign || '',
        medium: utm_medium || '',
        source: utm_source || '',
        term: utm_term || undefined,
      })
    }
  } catch (e) {
    console.error('logCampaignAnalytics error:', e)
  }
}

/**
 * Handles special demo mode deep links that skip onboarding/login.
 */
export async function handleDemoDeepLink(url: string, dispatch: AppDispatch): Promise<boolean> {
  try {
    const { DEMO_PASSWORD, IS_TEST } = getEnv()
    const isTestOrDev = IS_TEST === true || __DEV__
    if (!isTestOrDev || !url?.includes('demo=true')) {
      return false
    }

    const { searchParams } = new URL(url.replace('vamobile://', 'https://'))
    const password = searchParams.get('password')
    const demoUserParam = searchParams.get('demoUser')
    const skipOnboarding = searchParams.get('skipOnboarding') !== 'false'
    const skipNotifications = searchParams.get('skipNotifications') !== 'false'
    const autoLogin = searchParams.get('autoLogin') !== 'false'

    if (DEMO_PASSWORD !== undefined && DEMO_PASSWORD !== '' && password !== DEMO_PASSWORD && !IS_TEST) {
      return false
    }

    const validDemoUserIds = Object.keys(DemoUsers)
    const demoUser = demoUserParam && validDemoUserIds.includes(demoUserParam) ? demoUserParam : 'kimberlyWashington'

    await Promise.all([
      AsyncStorage.setItem(DEMO_USER_STORAGE_KEY, demoUser),
      AsyncStorage.setItem(NEW_SESSION, 'true'),
    ])

    if (skipOnboarding) {
      const key = isAndroid() ? ANDROID_FIRST_LOGIN_COMPLETED_KEY : FIRST_LOGIN_COMPLETED_KEY
      await AsyncStorage.setItem(key, FIRST_LOGIN_STORAGE_VAL)
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

/**
 * Common entry point for deep link handling. Dispatches demo login,
 * stores navigable links for post-login redirection, and logs campaign analytics.
 */
export async function handleDeepLink(
  url: string,
  dispatch: AppDispatch,
  setInitialDeepLink: (url: string) => void,
): Promise<void> {
  const demoLoginHandled = await handleDemoDeepLink(url, dispatch)
  const isNavigableLink = isNavigableDeepLink(url)

  if (!demoLoginHandled || isNavigableLink) {
    setInitialDeepLink(url)
    await logCampaignAnalytics(url)
  }
}
