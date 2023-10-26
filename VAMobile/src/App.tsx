import 'react-native-gesture-handler'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet'
import { AppState, AppStateStatus, Linking, StatusBar } from 'react-native'
import { I18nextProvider } from 'react-i18next'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { Provider, useSelector } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { enableScreens } from 'react-native-screens'
import { useTranslation } from 'react-i18next'
import { utils } from '@react-native-firebase/app'
import KeyboardManager from 'react-native-keyboard-manager'
import React, { FC, useEffect, useRef, useState } from 'react'
import Toast, { useToast } from 'react-native-toast-notifications'
import ToastContainer from 'react-native-toast-notifications'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
import i18n from 'utils/i18n'
import performance from '@react-native-firebase/perf'

import { AccessibilityState, sendUsesLargeTextAnalytics, sendUsesScreenReaderAnalytics } from 'store/slices/accessibilitySlice'
import { AnalyticsState, AuthState, NotificationsState, handleTokenCallbackUrl, initializeAuth } from 'store/slices'
import { BenefitsScreen, HealthScreen, HomeScreen, LoginScreen, PaymentsScreen, getBenefitsScreens, getHealthScreens, getHomeScreens, getPaymentsScreens } from 'screens'
import { CloseSnackbarOnNavigation, EnvironmentTypesConstants } from 'constants/common'
import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationTabBar } from 'components'
import { SettingsState } from 'store/slices'
import { SnackBarConstants } from 'constants/common'
import { SnackBarState } from 'store/slices/snackBarSlice'
import { SyncScreen } from './screens/SyncScreen'
import { WebviewStackParams } from './screens/WebviewScreen/WebviewScreen'
import { fetchAndActivateRemoteConfig } from 'store/slices/settingsSlice'
import { injectStore } from 'store/api/api'
import { isIOS } from 'utils/platform'
import { linking } from 'constants/linking'
import { profileAddressType } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { updateFontScale, updateIsVoiceOverTalkBackRunning } from './utils/accessibility'
import { useAppDispatch, useFontScale, useIsScreenReaderEnabled } from 'utils/hooks'
import { useColorScheme } from 'styles/themes/colorScheme'
import { useHeaderStyles, useTopPaddingAsHeaderStyles } from 'utils/hooks/headerStyles'
import BiometricsPreferenceScreen from 'screens/BiometricsPreferenceScreen'
import EditAddressScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/EditAddressScreen'
import EditDirectDepositScreen from './screens/PaymentsScreen/DirectDepositScreen/EditDirectDepositScreen'
import LoaGate from './screens/auth/LoaGate'
import NotificationManager from './components/NotificationManager'
import OnboardingCarousel from './screens/OnboardingCarousel'
import SnackBar from 'components/SnackBar'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import VeteransCrisisLineScreen from './screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WebviewScreen from './screens/WebviewScreen'
import getEnv from 'utils/env'
import queryClient from 'api/queryClient'
import store, { RootState } from 'store'
import theme, { getTheme, setColorScheme } from 'styles/themes/standardTheme'

const { ENVIRONMENT, IS_TEST } = getEnv()

enableScreens(true)
injectStore(store)

const Stack = createStackNavigator()
const TabNav = createBottomTabNavigator<RootTabNavParamList>()
const RootNavStack = createStackNavigator<RootNavStackParamList>()

// configuring KeyboardManager styling for iOS
if (isIOS()) {
  KeyboardManager.setEnable(true)
  KeyboardManager.setKeyboardDistanceFromTextField(45)
  KeyboardManager.setEnableAutoToolbar(false)
}

export type RootNavStackParamList = WebviewStackParams & {
  Home: undefined
  EditAddress: { displayTitle: string; addressType: profileAddressType }
  EditDirectDeposit: {
    displayTitle: string
  }
  Tabs: undefined
}

type RootTabNavParamList = {
  HomeTab: undefined
  HealthTab: undefined
  BenefitsTab: undefined
  PaymentsTab: undefined
  ProfileTab: undefined
}
;`
  background-color: ${theme.colors.icon.active};
`

const MainApp: FC = () => {
  const navigationRef = useNavigationContainerRef()
  const routeNameRef = useRef('')

  const scheme = useColorScheme()
  setColorScheme(scheme)

  const currentTheme = getTheme()

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

    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName || ''
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <ThemeProvider theme={currentTheme}>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <NavigationContainer ref={navigationRef} linking={linking} onReady={navOnReady} onStateChange={onNavStateChange}>
                  <NotificationManager>
                    <SafeAreaProvider>
                      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={currentTheme.colors.background.main} />
                      <AuthGuard />
                    </SafeAreaProvider>
                  </NotificationManager>
                </NavigationContainer>
              </I18nextProvider>
            </Provider>
          </ThemeProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </>
  )
}

export const AuthGuard: FC = () => {
  const dispatch = useAppDispatch()
  const { initializing, loggedIn, syncing, firstTimeLogin, canStoreWithBiometric, displayBiometricsPreferenceScreen } = useSelector<RootState, AuthState>((state) => state.auth)
  const { loadingRemoteConfig, remoteConfigActivated } = useSelector<RootState, SettingsState>((state) => state.settings)
  const { fontScale, isVoiceOverTalkBackRunning } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)
  const { bottomOffset } = useSelector<RootState, SnackBarState>((state) => state.snackBar)
  const { firebaseDebugMode } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const headerStyles = useHeaderStyles()
  // This is to simulate SafeArea top padding through the header for technically header-less screens (no title, no back buttons)
  const topPaddingAsHeaderStyles = useTopPaddingAsHeaderStyles()
  const [currNewState, setCurrNewState] = useState('active')
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const fontScaleFunction = useFontScale()
  const sendUsesLargeTextScal = fontScaleFunction(30)

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
    return (): void => sub?.remove()
  }, [dispatch, fontScale])

  useEffect(() => {
    // Updates the value of isVoiceOverTalkBackRunning on initial app load
    if (currNewState === 'active') {
      updateIsVoiceOverTalkBackRunning(currNewState, isVoiceOverTalkBackRunning, dispatch)
      setCurrNewState('inactive')
    }
  }, [isVoiceOverTalkBackRunning, dispatch, currNewState])

  useEffect(() => {
    dispatch(sendUsesScreenReaderAnalytics())
  }, [dispatch, screenReaderEnabled])

  useEffect(() => {
    dispatch(sendUsesLargeTextAnalytics())
  }, [dispatch, sendUsesLargeTextScal])

  useEffect(() => {
    // Listener for the current app state, updates isVoiceOverTalkBackRunning when app state is active and voice over/talk back
    // was turned on or off
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): Promise<void> => updateIsVoiceOverTalkBackRunning(newState, isVoiceOverTalkBackRunning, dispatch))
    return (): void => sub?.remove()
  }, [dispatch, isVoiceOverTalkBackRunning])

  useEffect(() => {
    // check if analytics for staging enabled, or check if staging or Google Pre-Launch test, staging or test and turn off analytics if that is the case
    const toggle = firebaseDebugMode || !(utils().isRunningInTestLab || ENVIRONMENT === EnvironmentTypesConstants.Staging || __DEV__ || IS_TEST)
    crashlytics().setCrashlyticsCollectionEnabled(toggle)
    analytics().setAnalyticsCollectionEnabled(toggle)
    performance().setPerformanceCollectionEnabled(toggle)
  }, [firebaseDebugMode])

  useEffect(() => {
    if (!remoteConfigActivated) {
      dispatch(fetchAndActivateRemoteConfig())
    }
  }, [dispatch, remoteConfigActivated])

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
      sub?.remove()
    }
  }, [dispatch])

  let content
  if (initializing || loadingRemoteConfig) {
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
        <Stack.Screen name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={LARGE_PANEL_OPTIONS} />
        <Stack.Screen name="Webview" component={WebviewScreen} />
        <Stack.Screen name="LoaGate" component={LoaGate} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }

  return content
}

export const AppTabs: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <>
      <TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} translation={t} />} initialRouteName="HomeTab" screenOptions={{ headerShown: false }}>
        <TabNav.Screen name="HomeTab" component={HomeScreen} options={{ title: t('home.title') }} />
        <TabNav.Screen name="BenefitsTab" component={BenefitsScreen} options={{ title: t('benefits.title') }} />
        <TabNav.Screen name="HealthTab" component={HealthScreen} options={{ title: t('health.title') }} />
        <TabNav.Screen name="PaymentsTab" component={PaymentsScreen} options={{ title: t('payments.title') }} />
      </TabNav.Navigator>
    </>
  )
}

export const AuthedApp: FC = () => {
  const headerStyles = useHeaderStyles()
  const toast = useToast()
  const [message, setMessage] = useState(null)
  const { initialUrl } = useSelector<RootState, NotificationsState>((state) => state.notifications)

  const homeScreens = getHomeScreens()
  const benefitsScreens = getBenefitsScreens()
  const healthScreens = getHealthScreens()
  const paymentsScreens = getPaymentsScreens()

  // When applicable, this will open the deep link from the notification that launched the app once sign in
  // is complete. Mapping the link to the appropriate screen is handled by the React Navigation linking config.
  useEffect(() => {
    if (initialUrl) {
      Linking.openURL(initialUrl)
    }
  }, [initialUrl])

  useEffect(() => {
    //initially Toast is set to null until it is first used. So when we call showsnackbar it calls hideall on a null reference. this should first set that reference
    if (message) {
      toast.show(message, {
        type: 'danger',
      })
      setMessage(null)
    }
  }, [toast])

  return (
    <>
      <RootNavStack.Navigator
        screenOptions={{ ...headerStyles, detachPreviousScreen: false }}
        initialRouteName="Tabs"
        screenListeners={{
          transitionStart: (e) => {
            if (e.data.closing) {
              CloseSnackbarOnNavigation(e.target)
            }
          },
          blur: (e) => {
            CloseSnackbarOnNavigation(e.target)
          },
        }}>
        <RootNavStack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false, animationEnabled: false }} />
        <RootNavStack.Screen name="Webview" component={WebviewScreen} />
        <RootNavStack.Screen name="EditAddress" component={EditAddressScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />
        <RootNavStack.Screen name="EditDirectDeposit" component={EditDirectDepositScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />
        {homeScreens}
        {paymentsScreens}
        {benefitsScreens}
        {healthScreens}
      </RootNavStack.Navigator>
    </>
  )
}

const App = connectActionSheet(MainApp)

export default App
