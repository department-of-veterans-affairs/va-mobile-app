import React, { useEffect, useRef, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import { AppState, AppStateStatus, Linking, StatusBar } from 'react-native'
import 'react-native-gesture-handler'
import KeyboardManager from 'react-native-keyboard-manager'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import Toast from 'react-native-toast-notifications'
import ToastContainer from 'react-native-toast-notifications'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { Provider, useSelector } from 'react-redux'

import analytics from '@react-native-firebase/analytics'
import { utils } from '@react-native-firebase/app'
import crashlytics from '@react-native-firebase/crashlytics'
import performance from '@react-native-firebase/perf'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'

import queryClient from 'api/queryClient'
import { ClaimData } from 'api/types'
import { NavigationTabBar } from 'components'
import SnackBar from 'components/SnackBar'
import { CloseSnackbarOnNavigation, EnvironmentTypesConstants } from 'constants/common'
import { SnackBarConstants } from 'constants/common'
import { linking } from 'constants/linking'
import { NAMESPACE } from 'constants/namespaces'
import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import {
  BenefitsScreen,
  HealthScreen,
  HomeScreen,
  LoginScreen,
  PaymentsScreen,
  getBenefitsScreens,
  getHealthScreens,
  getHomeScreens,
  getPaymentsScreens,
} from 'screens'
import FileRequestSubtask from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestSubtask'
import SubmitEvidenceSubtask from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SubmitEvidenceSubtask'
import { profileAddressType } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import EditAddressScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/EditAddressScreen'
import BiometricsPreferenceScreen from 'screens/auth/BiometricsPreferenceScreen'
import RequestNotificationsScreen from 'screens/auth/RequestNotifications/RequestNotificationsScreen'
import store, { RootState } from 'store'
import { injectStore } from 'store/api/api'
import { AnalyticsState, AuthState, handleTokenCallbackUrl, initializeAuth } from 'store/slices'
import { SettingsState } from 'store/slices'
import {
  AccessibilityState,
  sendUsesLargeTextAnalytics,
  sendUsesScreenReaderAnalytics,
} from 'store/slices/accessibilitySlice'
import { fetchAndActivateRemoteConfig } from 'store/slices/settingsSlice'
import { SnackBarState } from 'store/slices/snackBarSlice'
import { useColorScheme } from 'styles/themes/colorScheme'
import theme, { getTheme, setColorScheme } from 'styles/themes/standardTheme'
import getEnv from 'utils/env'
import { useAppDispatch, useFontScale, useIsScreenReaderEnabled } from 'utils/hooks'
import { useHeaderStyles, useTopPaddingAsHeaderStyles } from 'utils/hooks/headerStyles'
import i18n from 'utils/i18n'
import { isIOS } from 'utils/platform'

import NotificationManager, { useNotificationContext } from './components/NotificationManager'
import VeteransCrisisLineScreen from './screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import OnboardingCarousel from './screens/OnboardingCarousel'
import EditDirectDepositScreen from './screens/PaymentsScreen/DirectDepositScreen/EditDirectDepositScreen'
import SplashScreen from './screens/SplashScreen/SplashScreen'
import { SyncScreen } from './screens/SyncScreen'
import WebviewScreen from './screens/WebviewScreen'
import { WebviewStackParams } from './screens/WebviewScreen/WebviewScreen'
import LoaGate from './screens/auth/LoaGate'
import { updateFontScale, updateIsVoiceOverTalkBackRunning } from './utils/accessibility'

const { ENVIRONMENT, IS_TEST } = getEnv()

enableScreens(true)
injectStore(store)

const Stack = createStackNavigator<StackNavParamList>()
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
  FileRequestSubtask: {
    claimID: string
    claim: ClaimData | undefined
  }
  SubmitEvidenceSubtask: {
    claimID: string
  }
  Tabs: undefined
}

type StackNavParamList = WebviewStackParams & {
  Splash: undefined
  BiometricsPreference: undefined
  RequestNotifications: undefined
  Sync: undefined
  Login: undefined
  LoaGate: undefined
  VeteransCrisisLine: undefined
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

function MainApp() {
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
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  onReady={navOnReady}
                  onStateChange={onNavStateChange}>
                  <NotificationManager>
                    <SafeAreaProvider>
                      <StatusBar
                        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
                        backgroundColor={currentTheme.colors.background.main}
                      />
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

export function AuthGuard() {
  const dispatch = useAppDispatch()
  const {
    initializing,
    loggedIn,
    syncing,
    firstTimeLogin,
    canStoreWithBiometric,
    displayBiometricsPreferenceScreen,
    requestNotificationsPreferenceScreen,
  } = useSelector<RootState, AuthState>((state) => state.auth)
  const { tappedForegroundNotification, setTappedForegroundNotification } = useNotificationContext()
  const { loadingRemoteConfig, remoteConfigActivated } = useSelector<RootState, SettingsState>(
    (state) => state.settings,
  )
  const { fontScale, isVoiceOverTalkBackRunning } = useSelector<RootState, AccessibilityState>(
    (state) => state.accessibility,
  )
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
    const sub = AppState.addEventListener('change', (newState: AppStateStatus): void =>
      updateFontScale(newState, fontScale, dispatch),
    )
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
    const sub = AppState.addEventListener(
      'change',
      (newState: AppStateStatus): Promise<void> =>
        updateIsVoiceOverTalkBackRunning(newState, isVoiceOverTalkBackRunning, dispatch),
    )
    return (): void => sub?.remove()
  }, [dispatch, isVoiceOverTalkBackRunning])

  useEffect(() => {
    // check if analytics for staging enabled, or check if staging or Google Pre-Launch test,
    // staging or test and turn off analytics if that is the case
    const toggle =
      firebaseDebugMode ||
      !(utils().isRunningInTestLab || ENVIRONMENT === EnvironmentTypesConstants.Staging || __DEV__ || IS_TEST)
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
    if (loggedIn && tappedForegroundNotification) {
      console.debug('User tapped foreground notification. Skipping initializeAuth.')
      setTappedForegroundNotification(false)
    } else if (!loggedIn) {
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
    }
  }, [dispatch, loggedIn, tappedForegroundNotification, setTappedForegroundNotification])

  useEffect(() => {
    // Log campaign analytics if the app is launched by a campaign link
    const logCampaignAnalytics = async () => {
      const initialUrl = await Linking.getInitialURL()

      if (initialUrl) {
        const urlParts = decodeURIComponent(initialUrl).split('?')
        const queryString = urlParts[1]
        const queryParts = queryString?.split('&') || []

        const queryParams = queryParts.reduce(
          (params, queryPart) => {
            const [key, value] = queryPart.split('=')
            params[key] = value
            return params
          },
          {} as { [key: string]: string | undefined },
        )

        if (queryParams.utm_campaign || queryParams.utm_medium || queryParams.utm_source || queryParams.utm_term) {
          await analytics().logCampaignDetails({
            campaign: queryParams.utm_campaign || '',
            medium: queryParams.utm_medium || '',
            source: queryParams.utm_source || '',
            term: queryParams.utm_term,
          })
        }
      }
    }

    logCampaignAnalytics()
  }, [])

  let content
  if (initializing || loadingRemoteConfig) {
    content = (
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ ...topPaddingAsHeaderStyles, title: 'SplashScreen' }}
        />
      </Stack.Navigator>
    )
  } else if (syncing && firstTimeLogin && canStoreWithBiometric && displayBiometricsPreferenceScreen) {
    content = (
      <Stack.Navigator initialRouteName="BiometricsPreference">
        <Stack.Screen
          name="BiometricsPreference"
          component={BiometricsPreferenceScreen}
          options={{ ...topPaddingAsHeaderStyles, title: 'SplashScreen' }}
        />
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
  } else if (!firstTimeLogin && loggedIn && requestNotificationsPreferenceScreen) {
    content = (
      <Stack.Navigator>
        <Stack.Screen
          name="RequestNotifications"
          component={RequestNotificationsScreen}
          options={{ ...topPaddingAsHeaderStyles }}
        />
      </Stack.Navigator>
    )
  } else if (loggedIn) {
    content = (
      <>
        <AuthedApp />
        <Toast
          {...snackBarProps}
          ref={(ref) => ((global.snackBar as ToastContainer | null) = ref)}
          offsetBottom={bottomOffset}
        />
      </>
    )
  } else {
    content = (
      <Stack.Navigator screenOptions={headerStyles} initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ ...topPaddingAsHeaderStyles, title: t('login') }}
        />
        <Stack.Screen name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={LARGE_PANEL_OPTIONS} />
        <Stack.Screen name="Webview" component={WebviewScreen} />
        <Stack.Screen name="LoaGate" component={LoaGate} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }

  return content
}

export function AppTabs() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <>
      <TabNav.Navigator
        tabBar={(props): React.ReactNode => <NavigationTabBar {...props} translation={t} />}
        initialRouteName="HomeTab"
        screenOptions={{ headerShown: false }}>
        <TabNav.Screen name="HomeTab" component={HomeScreen} options={{ title: t('home.title') }} />
        <TabNav.Screen name="HealthTab" component={HealthScreen} options={{ title: t('health.title') }} />
        <TabNav.Screen name="BenefitsTab" component={BenefitsScreen} options={{ title: t('benefits.title') }} />
        <TabNav.Screen name="PaymentsTab" component={PaymentsScreen} options={{ title: t('payments.title') }} />
      </TabNav.Navigator>
    </>
  )
}

export function AuthedApp() {
  const headerStyles = useHeaderStyles()
  const { initialUrl } = useNotificationContext()
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
        <RootNavStack.Screen
          name="Tabs"
          component={AppTabs}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <RootNavStack.Screen name="Webview" component={WebviewScreen} />
        <RootNavStack.Screen name="EditAddress" component={EditAddressScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />
        <RootNavStack.Screen
          name="EditDirectDeposit"
          component={EditDirectDepositScreen}
          options={FULLSCREEN_SUBTASK_OPTIONS}
        />
        <RootNavStack.Screen
          name="SubmitEvidenceSubtask"
          component={SubmitEvidenceSubtask}
          options={FULLSCREEN_SUBTASK_OPTIONS}
        />
        <RootNavStack.Screen
          name="FileRequestSubtask"
          component={FileRequestSubtask}
          options={FULLSCREEN_SUBTASK_OPTIONS}
        />
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
