import { Button, StyleProp, Text, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { TButton, WideButton } from 'components'
import { logout } from 'store/actions/auth'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

const WrapperView = styled.View`
	width: 100%;
	align-items: center;
`

const CrisisLineView = styled(WrapperView)`
	margin-bottom: 20px;
`

type HomeStackParamList = {
	Home: undefined
	HomeDetails: { detail: string }
	Claims: undefined
	Appointments: undefined
}

type IHomeScreen = StackScreenProps<HomeStackParamList, 'Home'>

const HomeStack = createStackNavigator<HomeStackParamList>()

const HomeScreen: FC<IHomeScreen> = ({ navigation }) => {
	const dispatch = useDispatch()
	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
	}

	const onLogout = (): void => {
		dispatch(logout())
	}

	const onClaimsAndAppeals = (): void => {
		navigation.navigate('Claims')
	}

	const onAppointments = (): void => {
		navigation.navigate('Appointments')
	}

	const onPress = (): void => {
		navigation.navigate('HomeDetails', { detail: 'my detail' })
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineView>
				<WideButton title={'Talk to the Veterans Crisis Line now'} />
			</CrisisLineView>
			<WrapperView>
				<HomeNavButton title={'Claims and Appeals'} subText={'Check your claim or appeal status'} onPress={onClaimsAndAppeals} />
				<HomeNavButton title={'Appointments'} subText={'View your medical appointments'} onPress={onAppointments} />
			</WrapperView>
			<WrapperView>
				<TButton testID="button" />
				<Text>Home Screen</Text>
				<Button title="Go to Details" onPress={onPress} />
				<Button title="Logout" onPress={onLogout} />
			</WrapperView>
			<WrapperView>
				<WideButton title={'Find a VA Location'} />
				<WideButton title={'Contact VA'} />
				<WideButton title={'Coronavirus FAQs'} />
			</WrapperView>
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
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name="Home" component={HomeScreen} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
