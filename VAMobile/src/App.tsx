import 'react-native-gesture-handler'

import { ActivityIndicator, Linking, StatusBar } from 'react-native'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack/lib/typescript/src/types'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect } from 'react'

import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen, UnlockScreen } from 'screens'
import configureStore, { AuthState, LOGIN_PROMPT_TYPE, StoreState, TabBarState, handleTokenCallbackUrl, initializeAuth } from 'store'
import i18n from 'utils/i18n'
import styled, { ThemeProvider } from 'styled-components/native'

import { BackButton, NavigationTabBar } from 'components'
import { headerStyles } from 'styles/common'
import theme from 'styles/theme'

const store = configureStore()

declare const global: { HermesInternal: null | {} }

const Stack = createStackNavigator()
const TabNav = createBottomTabNavigator<RootNavParamList>()

type RootNavParamList = {
	Home: undefined
	Appointments: undefined
	Claims: undefined
	Profile: undefined
}

const StyledSafeAreaView = styled(SafeAreaView)`
	background-color: ${theme.activeBlue};
`

const App: FC = () => {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<I18nextProvider i18n={i18n}>
					<NavigationContainer>
						<SafeAreaProvider>
							<StyledSafeAreaView edges={['top']}>
								<StatusBar barStyle="light-content" backgroundColor={theme.activeBlue} />
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
	const { t } = useTranslation(NAMESPACE.LOGIN)

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

export const AuthedApp: FC = () => {
	const { tabBarVisible } = useSelector<StoreState, TabBarState>((state) => state.tabBar)
	const { t } = useTranslation()

	headerStyles.headerLeft = (props: StackHeaderLeftButtonProps): ReactNode => (
		<BackButton onPress={props.onPress} canGoBack={props.canGoBack} displayText={'back'} showCarat={true} />
	)

	return (
		<>
			<TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} tabBarVisible={tabBarVisible} translation={t} />} initialRouteName="Home">
				<TabNav.Screen name="Home" component={HomeScreen} options={{ title: t('home:title') }} />
				<TabNav.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims:title') }} />
				<TabNav.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('appointments:title') }} />
				<TabNav.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile:title') }} />
			</TabNav.Navigator>
		</>
	)
}

export default App
