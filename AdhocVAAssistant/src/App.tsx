import { Linking, StatusBar } from 'react-native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import 'react-native-gesture-handler'
import { AppointmentsScreen, ClaimsScreen, HomeScreen, LoginScreen, ProfileScreen } from 'screens'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native'
import { ThemeProvider } from 'styled-components/native'
import { attemptAuthWithSavedCredentials, handleTokenCallbackUrl } from 'store/actions/auth'
import { createStackNavigator } from '@react-navigation/stack'
import configureStore, { AuthState, StoreState } from './store'
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

	return (
		<>
			<ThemeProvider theme={theme}>
				<StatusBar barStyle="dark-content" />
				<TabNav.Navigator
					initialRouteName="Home"
					screenOptions={screenOptions}
					tabBarOptions={{
						activeTintColor: theme.primaryBlue,
						inactiveTintColor: theme.lightBlue,
					}}>
					<TabNav.Screen name="Home" component={HomeScreen} />
					<TabNav.Screen name="Appointments" component={AppointmentsScreen} />
					<TabNav.Screen name="Claims" component={ClaimsScreen} />
					<TabNav.Screen name="Profile" component={ProfileScreen} />
				</TabNav.Navigator>
			</ThemeProvider>
		</>
	)
}

export default App
