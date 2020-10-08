import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CrisisLineButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { StyledSourceRegularText, headerStyles } from 'styles/common'

const HomeNavButtonsView = styled.View`
	width: 90%;
	align-items: center;
`

const HomeScreenScrollView = styled.ScrollView.attrs(() => ({
	contentContainerStyle: {
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}))``

const MiscLinksView = styled.View`
	margin-vertical: 40px;
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
		justifyContent: 'flex-start',
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

	// TODO #14163
	const onVALocation = (): void => {}

	// TODO #14163
	const onCoronaVirusFAQ = (): void => {}

	// TODO #14384
	const onScreeningTool = (): void => {}

	const { t } = useTranslation(NAMESPACE.HOME)

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineButton />
			<View style={{ width: useWindowDimensions().width}}>
				<HomeScreenScrollView accessibilityRole={'menu'} alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
					<HomeNavButtonsView>
						<HomeNavButton title={t('claimsAndAppeals.title')} subText={t('claimsAndAppeals.subText')} a11yHint={t('claimsAndAppeals.allyHint')} onPress={onClaimsAndAppeals} />
						<HomeNavButton title={t('appointments.title')} subText={t('appointments.subText')} a11yHint={t('appointments.allyHint')} onPress={onAppointments} />
					</HomeNavButtonsView>
					<MiscLinksView>
						<WideButton title={t('findLocation.title')} a11yHint={t('findLocation.allyHint')} onPress={onVALocation} />
						<WideButton title={t('contactVA.title')} a11yHint={t('contactVA.allyHint')} onPress={onPress} />
						<WideButton title={t('coronavirusFaqs.title')} a11yHint={t('coronavirusFaq.allyHint')} onPress={onCoronaVirusFAQ} />
						<WideButton title={t('screeningTool.title')} a11yHint={t('screeningTool.allyHint')} onPress={onScreeningTool} />
					</MiscLinksView>
				</HomeScreenScrollView>
			</View>
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
			<CrisisLineButton />
			<View style={viewStyle} {...testIdProps('Home-details-screen')}>
				<StyledSourceRegularText>Details Screen</StyledSourceRegularText>
			</View>
		</View>
	)
}

type IHomeStackScreen = {}

const HomeStackScreen: FC<IHomeStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)

	return (
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('details.title') }} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
