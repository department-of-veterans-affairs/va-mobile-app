import { Button, StyleProp, Text, View, ViewStyle } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { logout } from 'store/actions/auth'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import TButton from '../../TButton'

type HomeStackParamList = {
	Home: undefined
	HomeDetails: { detail: string }
}

type IHomeScreen = StackScreenProps<HomeStackParamList, 'Home'>

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeScreen: FC<IHomeScreen> = ({ navigation }) => {
	const { t } = useTranslation(NAMESPACE.HOME)

	const dispatch = useDispatch()
	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	const onLogout = (): void => {
		dispatch(logout())
	}

	const onPress = (): void => {
		navigation.navigate('HomeDetails', { detail: 'my detail' })
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<TButton testID="button" />
			<Text>{t('homeText')}</Text>
			<Button title="Go to Details" onPress={onPress} />
			<Button title="Logout" onPress={onLogout} />
		</View>
	)
}

const HomeDetailsScreen: FC = () => {
	const viewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={viewStyle} {...testIdProps('Home-details-screen')}>
			<Text>Details Screen</Text>
		</View>
	)
}

type IHomeStackScreen = {}

const HomeStackScreen: FC<IHomeStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)

	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('details.title') }} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
