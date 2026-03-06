import AsyncStorage from '@react-native-async-storage/async-storage'

import { EnvironmentTypesConstants } from 'constants/common'
import { DEMO_USER } from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DeveloperScreen'
import { AppDispatch } from 'store'
import DemoUsers from 'store/api/demo/mocks/users'
import { NEW_SESSION, logInDemoMode } from 'store/slices'
import { updateDemoMode } from 'store/slices/demoSlice'
import getEnv from 'utils/env'

export async function handleDemoDeepLink(url: string, dispatch: AppDispatch): Promise<boolean> {
  try {
    const { DEMO_PASSWORD, ENVIRONMENT, IS_TEST } = getEnv()
    const isTestOrDev = IS_TEST === true || __DEV__
    if (!isTestOrDev || !url?.startsWith('vamobile://login?demo=true')) {
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

    // Check password if configured
    if (ENVIRONMENT !== EnvironmentTypesConstants.Production) {
      if (DEMO_PASSWORD !== undefined && password !== DEMO_PASSWORD) {
        return false
      }
    }

    const validDemoUserIds = Object.keys(DemoUsers)
    const demoUser = demoUserParam && validDemoUserIds.includes(demoUserParam) ? demoUserParam : 'kimberlyWashington'

    await AsyncStorage.setItem(DEMO_USER, demoUser)
    await AsyncStorage.setItem(NEW_SESSION, 'true')
    await dispatch(updateDemoMode(true, demoUser))
    dispatch(logInDemoMode())
    return true
  } catch (e) {
    console.error('handleDemoDeepLink error:', e)
    return false
  }
}
