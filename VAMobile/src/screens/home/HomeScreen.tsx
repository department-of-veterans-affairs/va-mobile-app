import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CrisisLineButton } from 'components'
import { StyledSourceRegularText } from 'styles/common'

const WrapperView = styled.View`
	width: 100%;
	align-items: center;
`

const MiscLinksView = styled.View`
	width: 100%;
	align-items: center;
	margin-bottom: 40px;
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

	const { t } = useTranslation()

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineButton />
			<WrapperView accessibilityRole={'menu'}>
				<HomeNavButton
					title={t('home.claimsAndAppeals.title')}
					subText={t('home.claimsAndAppeals.subText')}
					a11yHint={t('home.claimsAndAppeals.allyHint')}
					onPress={onClaimsAndAppeals}
				/>
				<HomeNavButton title={t('home.appointments.title')} subText={t('home.appointments.subText')} a11yHint={t('home.appointments.allyHint')} onPress={onAppointments} />
			</WrapperView>
			<MiscLinksView accessibilityRole={'menu'}>
				<WideButton title={t('home.findLocation.title')} a11yHint={t('home.findLocation.allyHint')} onPress={onVALocation} />
				<WideButton title={t('home.contactVA.title')} a11yHint={t('home.contactVA.allyHint')} onPress={onPress} />
				<WideButton title={t('home.coronavirusFaqs.title')} a11yHint={t('home.coronavirusFaq.allyHint')} onPress={onCoronaVirusFAQ} />
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
	const { t } = useTranslation()

	return (
		<HomeStack.Navigator>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('home.details.title') }} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
