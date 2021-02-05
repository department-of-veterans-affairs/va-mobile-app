import 'react-native-gesture-handler'

import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet'
import { I18nextProvider } from 'react-i18next'
import { Linking, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { NavigationContainerRef } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect, useRef } from 'react'
import analytics from '@react-native-firebase/analytics'

import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen } from 'screens'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationTabBar } from 'components'
import { PhoneData, PhoneType } from 'store/api/types'
import { SyncScreen } from './screens/SyncScreen'
import { WebviewStackParams } from './screens/WebviewScreen/WebviewScreen'
import { getAppointmentScreens } from './screens/AppointmentsScreen/AppointmentStackScreens'
import { getClaimsScreens } from './screens/ClaimsScreen/ClaimsStackScreens'
import { getHomeScreens } from './screens/HomeScreen/HomeStackScreens'
import { getProfileScreens } from './screens/ProfileScreen/ProfileStackScreens'
import { profileAddressType } from './screens/ProfileScreen/AddressSummary'
import { useHeaderStyles, useTranslation } from 'utils/hooks'
import BiometricsPreferenceScreen from 'screens/BiometricsPreferenceScreen'
import EditAddressScreen from './screens/ProfileScreen/EditAddressScreen'
import EditDirectDepositScreen from './screens/ProfileScreen/DirectDepositScreen/EditDirectDepositScreen'
import EditEmailScreen from './screens/ProfileScreen/PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './screens/ProfileScreen/PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import LoaGate from './screens/auth/LaoGate'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import VeteransCrisisLineScreen from './screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WebviewLogin from './screens/auth/WebviewLogin'
import WebviewScreen from './screens/WebviewScreen'
import configureStore, { AuthState, StoreState, handleTokenCallbackUrl, initializeAuth } from 'store'
import i18n from 'utils/i18n'
import styled, { ThemeProvider } from 'styled-components/native'
import theme from 'styles/themes/standardTheme'

const store = configureStore()

declare const global: { HermesInternal: null | {} }

const Stack = createStackNavigator()
const TabNav = createBottomTabNavigator<RootTabNavParamList>()
const RootNavStack = createStackNavigator<RootNavStackParamList>()

export type RootNavStackParamList = WebviewStackParams & {
  Home: undefined
  EditEmail: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  EditAddress: { displayTitle: string; addressType: profileAddressType }
  EditDirectDeposit: undefined
  Tabs: undefined
}

type RootTabNavParamList = {
  Home: undefined
  Appointments: undefined
  Claims: undefined
  Profile: undefined
}

const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${theme.colors.icon.active};
`

const MainApp: FC = () => {
  const navigationRef = useRef<NavigationContainerRef>(null)
  const routeNameRef = useRef('')

  /**
   * Used by the navigation container to initialize the first route
   */
  const navOnReady = (): void => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name || ''
  }

  /**
   * When the nav state changes, track the screen view using firebase analytics
   */
  const onNavStateChange = async (): Promise<void> => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name

    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      })
    }

    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName || ''
  }

  return (
    <ActionSheetProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NavigationContainer ref={navigationRef} onReady={navOnReady} onStateChange={onNavStateChange}>
              <SafeAreaProvider>
                <StyledSafeAreaView edges={['top']}>
                  <StatusBar barStyle="light-content" backgroundColor={theme.colors.icon.active} />
                </StyledSafeAreaView>
                <AuthGuard />
              </SafeAreaProvider>
            </NavigationContainer>
          </I18nextProvider>
        </Provider>
      </ThemeProvider>
    </ActionSheetProvider>
  )
}

export const AuthGuard: FC = () => {
  const dispatch = useDispatch()
  const { initializing, loggedIn, syncing, firstTimeLogin, canStoreWithBiometric } = useSelector<StoreState, AuthState>((state) => state.auth)
  const t = useTranslation(NAMESPACE.LOGIN)
  const headerStyles = useHeaderStyles()

  useEffect(() => {
    console.debug('AuthGuard: initializing')
    dispatch(initializeAuth())
    const listener = (event: { url: string }): void => {
      if (event.url?.startsWith('vamobile://login-success?')) {
        dispatch(handleTokenCallbackUrl(event.url))
      }
    }
    Linking.addEventListener('url', listener)
    return (): void => {
      Linking.removeEventListener('url', listener)
    }
  }, [dispatch])

  let content
  if (initializing) {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false, title: 'SplashScreen' }} />
      </Stack.Navigator>
    )
  } else if (syncing && firstTimeLogin && canStoreWithBiometric) {
    content = (
      <Stack.Navigator screenOptions={headerStyles} initialRouteName="BiometricsPreference">
        <Stack.Screen name="BiometricsPreference" component={BiometricsPreferenceScreen} options={{ headerShown: false, title: 'SplashScreen' }} />
      </Stack.Navigator>
    )
  } else if (syncing) {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Sync" component={SyncScreen} options={{ headerShown: false, title: 'sync' }} />
      </Stack.Navigator>
    )
  } else if (loggedIn) {
    content = <AuthedApp />
  } else {
    content = (
      <Stack.Navigator screenOptions={headerStyles} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: t('login') }} />
        <Stack.Screen name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={{ title: t('home:veteransCrisisLine.title') }} />
        <Stack.Screen name="Webview" component={WebviewScreen} />
        <Stack.Screen name="WebviewLogin" component={WebviewLogin} options={{ title: t('signin') }} />
        <Stack.Screen name="LoaGate" component={LoaGate} options={{ title: t('signin') }} />
      </Stack.Navigator>
    )
  }

  return content
}

export const AppTabs: FC = () => {
  const t = useTranslation()

  return (
    <>
      <TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} translation={t} />} initialRouteName="Home">
        <TabNav.Screen name="Home" component={HomeScreen} options={{ title: t('home:title') }} />
        <TabNav.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims:title') }} />
        <TabNav.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('appointments:title') }} />
        <TabNav.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile:title') }} />
      </TabNav.Navigator>
    </>
  )
}

export const AuthedApp: FC = () => {
  const t = useTranslation()
  const headerStyles = useHeaderStyles()

  const homeScreens = getHomeScreens(useTranslation(NAMESPACE.HOME))
  const profileScreens = getProfileScreens(useTranslation(NAMESPACE.PROFILE))
  const claimsScreens = getClaimsScreens(useTranslation(NAMESPACE.CLAIMS))
  const appointmentScreens = getAppointmentScreens(useTranslation(NAMESPACE.APPOINTMENTS))

  return (
    <>
      <RootNavStack.Navigator screenOptions={headerStyles} initialRouteName="Tabs">
        <RootNavStack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false, animationEnabled: false }} />
        <RootNavStack.Screen name="Webview" component={WebviewScreen} />
        <RootNavStack.Screen name="EditEmail" component={EditEmailScreen} options={{ title: t('profile:personalInformation.email') }} />
        <RootNavStack.Screen name="EditPhoneNumber" component={EditPhoneNumberScreen} />
        <RootNavStack.Screen name="EditAddress" component={EditAddressScreen} />
        <RootNavStack.Screen name={'EditDirectDeposit'} component={EditDirectDepositScreen} options={{ title: t('profile:directDeposit.title') }} />
        {homeScreens}
        {profileScreens}
        {claimsScreens}
        {appointmentScreens}
      </RootNavStack.Navigator>
    </>
  )
}

const App = connectActionSheet(MainApp)

export default App
