import 'react-native-gesture-handler'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { Linking, StatusBar } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TabBarState } from 'store/reducers/tabBar'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect } from 'react'
import i18n from 'utils/i18n'
import styled, { ThemeProvider } from 'styled-components/native'

import { BackButton, NavigationTabBar } from 'components'
import { attemptAuthWithSavedCredentials, handleTokenCallbackUrl } from 'store/actions/auth'
import { headerStyles } from 'styles/common'
import AppointmentsScreen from 'screens/AppointmentsScreen'
import ClaimsScreen from 'screens/ClaimsScreen'
import HomeScreen from 'screens/HomeScreen'
import LoginScreen from 'screens/LoginScreen'
import ProfileScreen from 'screens/ProfileScreen'
import configureStore, { AuthState, StoreState } from 'store'
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
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<SafeAreaProvider>
					<AuthGuard />
				</SafeAreaProvider>
			</I18nextProvider>
		</Provider>
	)
}

export const AuthGuard: FC = () => {
	const dispatch = useDispatch()
	const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)

	const { t } = useTranslation(NAMESPACE.LOGIN)

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

	return <NavigationContainer>{content}</NavigationContainer>
}

export const AuthedApp: FC = () => {
	const { tabBarVisible } = useSelector<StoreState, TabBarState>((state) => state.tabBar)
	const { t } = useTranslation()

	headerStyles.headerLeft = (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} translation={t} />

	return (
		<>
			<ThemeProvider theme={theme}>
				<StyledSafeAreaView edges={['top']}>
					<StatusBar barStyle="light-content" backgroundColor={theme.activeBlue} />
				</StyledSafeAreaView>
				<TabNav.Navigator tabBar={(props): React.ReactNode => <NavigationTabBar {...props} tabBarVisible={tabBarVisible} translation={t} />} initialRouteName="Home">
					<TabNav.Screen name="Home" component={HomeScreen} options={{ title: t('home:title') }} />
					<TabNav.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('appointments:title') }} />
					<TabNav.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims:title') }} />
					<TabNav.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile:title') }} />
				</TabNav.Navigator>
			</ThemeProvider>
		</>
	)
}

export default App
