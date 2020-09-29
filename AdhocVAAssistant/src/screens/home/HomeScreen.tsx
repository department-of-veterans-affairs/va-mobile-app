import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CrisisLineButton } from 'components'
import { StyledSourceRegularText } from 'styles/common'

const WrapperView = styled.View`
	width: 100%;
	align-items: center;
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
	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
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
			<WrapperView>
				<CrisisLineButton />
			</WrapperView>
			<WrapperView>
				<HomeNavButton title={'Claims and Appeals'} subText={'Check your claim or appeal status'} onPress={onClaimsAndAppeals} />
				<HomeNavButton title={'Appointments'} subText={'View your medical appointments'} onPress={onAppointments} />
			</WrapperView>
			<WrapperView>
				<WideButton title={'Find a VA Location'} />
				<WideButton title={'Contact VA'} onPress={onPress} />
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
		<View>
			<WrapperView>
				<CrisisLineButton />
			</WrapperView>
			<View style={viewStyle} {...testIdProps('Home-details-screen')}>
				<StyledSourceRegularText>Details Screen</StyledSourceRegularText>
			</View>
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
