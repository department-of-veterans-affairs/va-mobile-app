import 'react-native-gesture-handler'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Linking, StatusBar } from 'react-native'
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen, UnlockScreen } from 'screens'
import configureStore, { AuthState, LOGIN_PROMPT_TYPE, StoreState, handleTokenCallbackUrl, initializeAuth } from 'store'
import i18n from 'utils/i18n'
import theme from 'styles/theme'

import Appointments_Selected from 'images/navIcon/appointments_selected.svg'
import Appointments_Unselected from 'images/navIcon/appointments_unselected.svg'
import Claims_Selected from 'images/navIcon/claims_selected.svg'
import Claims_Unselected from 'images/navIcon/claims_unselected.svg'
import Home_Selected from 'images/navIcon/home_selected.svg'
import Home_Unselected from 'images/navIcon/home_unselected.svg'
import Profile_Selected from 'images/navIcon/profile_selected.svg'
import Profile_Unselected from 'images/navIcon/profile_unselected.svg'

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

const App: FC = () => {
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<NavigationContainer>
					<AuthGuard />
				</NavigationContainer>
			</I18nextProvider>
		</Provider>
	)
}

export const AuthGuard: FC = () => {
	const dispatch = useDispatch()
	const { loggedIn, loginPromptType } = useSelector<StoreState, AuthState>((state) => state.auth)
	const { t } = useTranslation()

	useEffect(() => {
		console.log('initializing')
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
	if (loggedIn) {
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
	type RouteParams = {
		route: RouteProp<ParamListBase, string>
	}

	const screenOptions = ({ route }: RouteParams): BottomTabNavigationOptions => ({
		tabBarIcon: ({ focused }: { focused: boolean }): React.ReactNode => {
			switch (route.name) {
				case 'Appointments':
					return focused ? <Appointments_Selected /> : <Appointments_Unselected />
				case 'Claims':
					return focused ? <Claims_Selected /> : <Claims_Unselected />
				case 'Profile':
					return focused ? <Profile_Selected /> : <Profile_Unselected />
				case 'Home':
					return focused ? <Home_Selected /> : <Home_Unselected />
				default:
					return ''
			}
		},
	})

	const { t } = useTranslation()

	return (
		<>
			<ThemeProvider theme={theme}>
				<StatusBar barStyle="dark-content" />
				<TabNav.Navigator
					initialRouteName="Home"
					screenOptions={screenOptions}
					tabBarOptions={{
						activeTintColor: theme.activeBlue,
						inactiveTintColor: theme.inactiveBlue,
					}}>
					<TabNav.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
					<TabNav.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('appointments.title') }} />
					<TabNav.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />
					<TabNav.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile.title') }} />
				</TabNav.Navigator>
			</ThemeProvider>
		</>
	)
}

export default App
