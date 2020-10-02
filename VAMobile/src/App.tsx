import { Linking, StatusBar } from 'react-native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import 'react-native-gesture-handler'
import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen } from 'screens'
import { NavigationContainer } from '@react-navigation/native'
import { NavigationTabBar } from 'components'
import { TabBarState } from './store/reducers/tabBar'
import { ThemeProvider } from 'styled-components/native'
import { attemptAuthWithSavedCredentials, handleTokenCallbackUrl } from 'store/actions/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import configureStore, { AuthState, StoreState } from './store'
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
	const { tabBarVisible } = useSelector<StoreState, TabBarState>((state) => state.tabBarVisible)
	return (
		<>
			<ThemeProvider theme={theme}>
				<StatusBar barStyle="dark-content" />
				<TabNav.Navigator
					screenOptions={{ tabBarVisible: tabBarVisible }}
					tabBar={(props): React.ReactNode => <NavigationTabBar {...props} tabBarVisible={tabBarVisible} />}
					initialRouteName="Home">
					<TabNav.Screen name="Home" component={HomeScreen} />
					<TabNav.Screen name="Claims" component={ClaimsScreen} />
					<TabNav.Screen name="Appointments" component={AppointmentsScreen} />
					<TabNav.Screen name="Profile" component={ProfileScreen} />
				</TabNav.Navigator>
			</ThemeProvider>
		</>
	)
}

export default App
