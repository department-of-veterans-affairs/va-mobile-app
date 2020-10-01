import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CrisisLineButton } from 'components'
import { StyledSourceRegularText, headerStyles } from 'styles/common'

const WrapperView = styled.View`
	width: 100%;
	align-items: center;
`

const MiscLinksView = styled(WrapperView)`
	margin-bottom: 46px;
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
		justifyContent: 'space-between',
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

	// TODO added from #14163
	const onVALocation = (): void => {}

	// TODO added from #14163
	const onCoronaVirusFAQ = (): void => {}

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<WrapperView>
				<CrisisLineButton />
			</WrapperView>
			<WrapperView>
				<HomeNavButton title={'Claims and appeals'} subText={'Check your claim or appeal status'} onPress={onClaimsAndAppeals} />
				<HomeNavButton title={'Appointments'} subText={'View your medical appointments'} onPress={onAppointments} />
			</WrapperView>
			<MiscLinksView>
				<WideButton title={'Find a VA Location'} onPress={onVALocation} />
				<WideButton title={'Contact VA'} onPress={onPress} />
				<WideButton title={'Coronavirus FAQs'} onPress={onCoronaVirusFAQ} />
			</MiscLinksView>
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
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
