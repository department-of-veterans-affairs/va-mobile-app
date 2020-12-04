import 'react-native-gesture-handler'

import { ActivityIndicator, Linking, StatusBar } from 'react-native'
import { I18nextProvider } from 'react-i18next'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen, UnlockScreen } from 'screens'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationTabBar } from 'components'
import { PhoneData, PhoneType } from 'store/api/types'
import { WebviewStackParams } from './screens/WebviewScreen/WebviewScreen'
import { profileAddressType } from './screens/ProfileScreen/AddressSummary'
import { useHeaderStyles, useTranslation } from 'utils/hooks'
import EditAddressScreen from './screens/ProfileScreen/EditAddressScreen'
import EditDirectDepositScreen from './screens/ProfileScreen/DirectDepositScreen/EditDirectDepositScreen'
import EditEmailScreen from './screens/ProfileScreen/PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './screens/ProfileScreen/PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import WebviewScreen from './screens/WebviewScreen'
import configureStore, { AuthState, LOGIN_PROMPT_TYPE, StoreState, handleTokenCallbackUrl, initializeAuth } from 'store'
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

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
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
  )
}

export const AuthGuard: FC = () => {
  const dispatch = useDispatch()
  const { initializing, loggedIn, loginPromptType } = useSelector<StoreState, AuthState>((state) => state.auth)
  const t = useTranslation(NAMESPACE.LOGIN)

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
    //TODO style this better
    content = <ActivityIndicator animating={true} color="#00FF00" size="large" />
  } else if (loggedIn) {
    content = <AuthedApp />
  } else if (loginPromptType === LOGIN_PROMPT_TYPE.UNLOCK) {
    console.debug('App: unlock mode!')
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Unlock" component={UnlockScreen} options={{ headerShown: false, title: t('unlock') }} />
      </Stack.Navigator>
    )
  } else {
    content = (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: t('login') }} />
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

  return (
    <>
      <RootNavStack.Navigator screenOptions={headerStyles} initialRouteName="Home">
        <RootNavStack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
        <RootNavStack.Screen name="Webview" component={WebviewScreen} />
        <RootNavStack.Screen name="EditEmail" component={EditEmailScreen} options={{ title: t('profile:personalInformation.email') }} />
        <RootNavStack.Screen name="EditPhoneNumber" component={EditPhoneNumberScreen} />
        <RootNavStack.Screen name="EditAddress" component={EditAddressScreen} />
        <RootNavStack.Screen name={'EditDirectDeposit'} component={EditDirectDepositScreen} options={{ title: t('profile:directDeposit.title') }} />
      </RootNavStack.Navigator>
    </>
  )
}

export default App
