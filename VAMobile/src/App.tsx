import 'react-native-gesture-handler'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet'
import { AppState, AppStateStatus, Linking, StatusBar } from 'react-native'
import { I18nextProvider } from 'react-i18next'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'
import KeyboardManager from 'react-native-keyboard-manager'
import React, { FC, useEffect, useRef, useState } from 'react'
import ToastContainer from 'react-native-toast-notifications'
import analytics from '@react-native-firebase/analytics'
import i18n from 'utils/i18n'

import { ClaimsScreen, HealthScreen, HomeScreen, LoginScreen, ProfileScreen } from 'screens'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationTabBar } from 'components'
import { PhoneData, PhoneType } from 'store/api/types'
import { SnackBarConstants } from 'constants/common'
import { SyncScreen } from './screens/SyncScreen'
import { WebviewStackParams } from './screens/WebviewScreen/WebviewScreen'
import { getClaimsScreens } from './screens/ClaimsScreen/ClaimsStackScreens'
import { getHealthScreens } from './screens/HealthScreen/HealthStackScreens'
import { getHomeScreens } from './screens/HomeScreen/HomeStackScreens'
import { getProfileScreens } from './screens/ProfileScreen/ProfileStackScreens'
import { isIOS } from 'utils/platform'
import { profileAddressType } from './screens/ProfileScreen/AddressSummary'
import { updateFontScale, updateIsVoiceOverTalkBackRunning } from './utils/accessibility'
import { useHeaderStyles, useTopPaddingAsHeaderStyles, useTranslation } from 'utils/hooks'
import BiometricsPreferenceScreen from 'screens/BiometricsPreferenceScreen'
import EditAddressScreen from './screens/ProfileScreen/EditAddressScreen'
import EditDirectDepositScreen from './screens/ProfileScreen/DirectDepositScreen/EditDirectDepositScreen'
import EditEmailScreen from './screens/ProfileScreen/PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './screens/ProfileScreen/PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import LoaGate from './screens/auth/LoaGate'
import NotificationManger from './components/NotificationManger'
import OnboardingCarousel from './screens/OnboardingCarousel'
import SnackBar from 'components/SnackBar'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import Toast from 'react-native-toast-notifications'
import VeteransCrisisLineScreen from './screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WebviewLogin from './screens/auth/WebviewLogin'
import WebviewScreen from './screens/WebviewScreen'
import configureStore, {
  AccessibilityState,
  AuthState,
  SnackBarState,
  StoreState,
  handleTokenCallbackUrl,
  initializeAuth,
  sendUsesLargeTextAnalytics,
  sendUsesScreenReaderAnalytics,
} from 'store'
import theme from 'styles/themes/standardTheme'

enableScreens(true)
const store = configureStore()
const Stack = createStackNavigator()
const TabNav = createBottomTabNavigator<RootTabNavParamList>()
const RootNavStack = createStackNavigator<RootNavStackParamList>()

// configuring KeyboardManager styling for iOS
if (isIOS()) {
  KeyboardManager.setEnable(true)
  KeyboardManager.setKeyboardDistanceFromTextField(theme.dimensions.keyboardManagerDistanceFromTextField)
  KeyboardManager.setEnableAutoToolbar(false)
}

export type RootNavStackParamList = WebviewStackParams & {
  Home: undefined
  EditEmail: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  EditAddress: { displayTitle: string; addressType: profileAddressType }
  EditDirectDeposit: undefined
  Tabs: undefined
}

type RootTabNavParamList = {
  HomeTab: undefined
  HealthTab: undefined
  ClaimsTab: undefined
  ProfileTab: undefined
}
;`
  background-color: ${theme.colors.icon.active};
`

const MainApp: FC = () => {
  const navigationRef = useNavigationContainerRef()
  const routeNameRef = useRef('')

  /**
   * Used by the navigation container to initialize the first route.
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
    snackBar.hideAll()

    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName || ''
  }

  const snackBarProps: Partial<ToastProps> = {
    duration: SnackBarConstants.duration,
    animationDuration: SnackBarConstants.animationDuration,
    renderType: {
      custom_snackbar: (toast) => <SnackBar {...toast} />,
    },
    swipeEnabled: false,
  }

  return (
    <>
      <ActionSheetProvider>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NavigationContainer ref={navigationRef} onReady={navOnReady} onStateChange={onNavStateChange}>
                <NotificationManger>
                  <SafeAreaProvider>
                    <StatusBar barStyle="light-content" backgroundColor={theme.colors.icon.active} />
                    <AuthGuard />
                  </SafeAreaProvider>
                </NotificationManger>
              </NavigationContainer>
            </I18nextProvider>
          </Provider>
        </ThemeProvider>
      </ActionSheetProvider>
    </>
  )
}

export const AuthGuard: FC = () => {
  const dispatch = useDispatch()
  const { initializing, loggedIn, syncing, firstTimeLogin, canStoreWithBiometric, displayBiometricsPreferenceScreen } = useSelector<StoreState, AuthState>((state) => state.auth)
  const { fontScale, isVoiceOverTalkBackRunning } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)
  const { bottomOffset } = useSelector<StoreState, SnackBarState>((state) => state.snackBar)
  const t = useTranslation(NAMESPACE.LOGIN)
  const headerStyles = useHeaderStyles()
  // This is to simulate SafeArea top padding through the header for technically header-less screens (no title, no back buttons)
  const topPaddingAsHeaderStyles = useTopPaddingAsHeaderStyles()
  const [currNewState, setCurrNewState] = useState('active')

  const snackBarProps: Partial<ToastProps> = {
    duration: SnackBarConstants.duration,
    animationDuration: SnackBarConstants.animationDuration,
    renderType: {
      custom_snackbar: (toast) => <SnackBar {...toast} />,
    },
    swipeEnabled: false,
  }
  useEffect(() => {
    // Listener for the current app state, updates the font scale when app state is active and the font scale has changed
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void => updateFontScale(newState, fontScale, dispatch))
    return (): void => sub.remove()
  }, [dispatch, fontScale])

  useEffect(() => {
    // Updates the value of isVoiceOverTalkBackRunning on initial app load
    if (currNewState === 'active') {
      updateIsVoiceOverTalkBackRunning(currNewState, isVoiceOverTalkBackRunning, dispatch)
      setCurrNewState('inactive')
    }
  }, [isVoiceOverTalkBackRunning, dispatch, currNewState])

  useEffect(() => {
    // only run on app load
    dispatch(sendUsesLargeTextAnalytics())
    dispatch(sendUsesScreenReaderAnalytics())
  }, [dispatch])

  useEffect(() => {
    // Listener for the current app state, updates isVoiceOverTalkBackRunning when app state is active and voice over/talk back
    // was turned on or off
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): Promise<void> => updateIsVoiceOverTalkBackRunning(newState, isVoiceOverTalkBackRunning, dispatch))
    return (): void => sub.remove()
  }, [dispatch, isVoiceOverTalkBackRunning])

  useEffect(() => {
    console.debug('AuthGuard: initializing')
    dispatch(initializeAuth())
    const listener = (event: { url: string }): void => {
      if (event.url?.startsWith('vamobile://login-success?')) {
        dispatch(handleTokenCallbackUrl(event.url))
      }
    }
    const sub = Linking.addEventListener('url', listener)
    return (): void => {
      sub.remove()
    }
  }, [dispatch])

  let content
  if (initializing) {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ ...topPaddingAsHeaderStyles, title: 'SplashScreen' }} />
      </Stack.Navigator>
    )
  } else if (syncing && firstTimeLogin && canStoreWithBiometric && displayBiometricsPreferenceScreen) {
    content = (
      <Stack.Navigator initialRouteName="BiometricsPreference">
        <Stack.Screen name="BiometricsPreference" component={BiometricsPreferenceScreen} options={{ ...topPaddingAsHeaderStyles, title: 'SplashScreen' }} />
      </Stack.Navigator>
    )
  } else if (syncing) {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Sync" component={SyncScreen} options={{ ...topPaddingAsHeaderStyles, title: 'sync' }} />
      </Stack.Navigator>
    )
  } else if (firstTimeLogin && loggedIn) {
    content = <OnboardingCarousel />
  } else if (loggedIn) {
    content = (
      <>
        <AuthedApp />
        <Toast {...snackBarProps} ref={(ref) => ((global.snackBar as ToastContainer | null) = ref)} offsetBottom={bottomOffset} />
      </>
    )
  } else {
    content = (
      <Stack.Navigator screenOptions={headerStyles} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ ...topPaddingAsHeaderStyles, title: t('login') }} />
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
      <TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} translation={t} />} initialRouteName="HomeTab" screenOptions={{ headerShown: false }}>
        <TabNav.Screen name="HomeTab" component={HomeScreen} options={{ title: t('home:title') }} />
        <TabNav.Screen name="ClaimsTab" component={ClaimsScreen} options={{ title: t('claims:title') }} />
        <TabNav.Screen name="HealthTab" component={HealthScreen} options={{ title: t('health:title') }} />
        <TabNav.Screen name="ProfileTab" component={ProfileScreen} options={{ title: t('profile:title') }} />
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
  const healthScreens = getHealthScreens(useTranslation(NAMESPACE.HEALTH))

  return (
    <>
      <RootNavStack.Navigator screenOptions={{ ...headerStyles, detachPreviousScreen: false }} initialRouteName="Tabs">
        <RootNavStack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false, animationEnabled: false }} />
        <RootNavStack.Screen name="Webview" component={WebviewScreen} />
        <RootNavStack.Screen name="EditEmail" component={EditEmailScreen} options={{ title: t('profile:personalInformation.email') }} />
        <RootNavStack.Screen name="EditPhoneNumber" component={EditPhoneNumberScreen} />
        <RootNavStack.Screen name="EditAddress" component={EditAddressScreen} />
        <RootNavStack.Screen name={'EditDirectDeposit'} component={EditDirectDepositScreen} options={{ title: t('profile:directDeposit.title') }} />
        {homeScreens}
        {profileScreens}
        {claimsScreens}
        {healthScreens}
      </RootNavStack.Navigator>
    </>
  )
}

const App = connectActionSheet(MainApp)

export default App
