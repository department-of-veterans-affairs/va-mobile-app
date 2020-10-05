import 'react-native-gesture-handler'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Linking, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen } from 'screens'
import { NavigationTabBar } from 'components'
import { TabBarState } from './store/reducers/tabBar'
import { ThemeProvider } from 'styled-components/native'
import { attemptAuthWithSavedCredentials, handleTokenCallbackUrl } from 'store/actions/auth'
import configureStore, { AuthState, StoreState } from './store'
import i18n from 'utils/i18n'
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

const linking = {
	prefixes: ['vamobile://'],
	config: {
		screens: {
			Login: 'login-success',
		},
	},
}

const App: FC = () => {
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<AuthGuard />
			</I18nextProvider>
		</Provider>
	)
}

const AuthGuard: FC = () => {
	const dispatch = useDispatch()
	const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { t } = useTranslation()
	console.log('initializing')
	useEffect(() => {
		dispatch(attemptAuthWithSavedCredentials())
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
	if (loggedIn) {
		content = <AuthedApp />
	} else {
		content = (
			<Stack.Navigator>
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: t('login') }} />
			</Stack.Navigator>
		)
	}

	return <NavigationContainer linking={linking}>{content}</NavigationContainer>
}

const AuthedApp: FC = () => {
	const { tabBarVisible } = useSelector<StoreState, TabBarState>((state) => state.tabBarVisible)
	const { t } = useTranslation()

	return (
		<>
			<ThemeProvider theme={theme}>
				<StatusBar barStyle="dark-content" />
				<TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} tabBarVisible={tabBarVisible} translation={t} />} initialRouteName="Home">
					<TabNav.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
					<TabNav.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />
					<TabNav.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('appointments.title') }} />
					<TabNav.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile.title') }} />
				</TabNav.Navigator>
			</ThemeProvider>
		</>
	)
}

export default App
