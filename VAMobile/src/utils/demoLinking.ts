import AsyncStorage from '@react-native-async-storage/async-storage'

import { DEMO_USER } from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DeveloperScreen'
import { AppDispatch } from 'store'
import DemoUsers from 'store/api/demo/mocks/users'
import { NEW_SESSION, logInDemoMode } from 'store/slices'
import { updateDemoMode } from 'store/slices/demoSlice'
import getEnv from 'utils/env'

const { DEMO_PASSWORD, IS_TEST } = getEnv()

export async function handleDemoDeepLink(url: string, dispatch: AppDispatch): Promise<boolean> {
  if (!(IS_TEST || __DEV__) || !url?.startsWith('vamobile://login?demo=true')) {
    return false
  }

  const parsed = new URL(url)
  const password = parsed.searchParams.get('password')
  const demoUserParam = parsed.searchParams.get('demoUser')

  if (!DEMO_PASSWORD || password !== DEMO_PASSWORD) {
    return false
  }

  const validDemoUserIds = Object.keys(DemoUsers)
  const demoUser = demoUserParam && validDemoUserIds.includes(demoUserParam) ? demoUserParam : 'kimberlyWashington'

  await AsyncStorage.setItem(DEMO_USER, demoUser)
  await AsyncStorage.setItem(NEW_SESSION, 'true')
  await dispatch(updateDemoMode(true, demoUser))
  dispatch(logInDemoMode())
  return true
}
