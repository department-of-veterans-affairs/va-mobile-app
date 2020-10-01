import { Linking, StatusBar } from 'react-native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { attemptAuthWithSavedCredentials, handleTokenCallbackUrl } from 'store/actions/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import AppointmentsScreen from 'screens/appointments/AppointmentsScreen'
import ClaimsScreen from 'screens/claims/ClaimsScreen'
import HomeScreen from 'screens/home/HomeScreen'
import LoginScreen from 'screens/LoginScreen/LoginScreen'
import ProfileScreen from 'screens/profile/ProfileScreen'
import configureStore, { AuthState, StoreState } from './store'

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
			<AuthGuard />
		</Provider>
	)
}

const AuthGuard: FC = () => {
	const dispatch = useDispatch()
	const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)
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
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: 'Login' }} />
			</Stack.Navigator>
		)
	}

	return <NavigationContainer linking={linking}>{content}</NavigationContainer>
}

const AuthedApp: FC = () => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<TabNav.Navigator initialRouteName="Home">
				<TabNav.Screen name="Home" component={HomeScreen} />
				<TabNav.Screen name="Appointments" component={AppointmentsScreen} />
				<TabNav.Screen name="Claims" component={ClaimsScreen} />
				<TabNav.Screen name="Profile" component={ProfileScreen} />
			</TabNav.Navigator>
		</>
	)
}

export default App
