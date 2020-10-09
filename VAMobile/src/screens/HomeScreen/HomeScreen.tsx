import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { WideButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { CrisisLineButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { StyledSourceRegularText, headerStyles } from 'styles/common'
import { updateTabBarVisible } from '../../store/actions'
import { useDispatch } from 'react-redux'
import WebviewScreen from 'screens/WebviewScreen'

const HomeNavButtonsView = styled.View`
	margin-horizontal: 20px;
`

const MiscLinksView = styled.View`
	margin-vertical: 40px;
`

export type HomeStackParamList = {
	Home: undefined
	HomeDetails: { detail: string }
	Claims: undefined
	Appointments: undefined
	CoronaFAQ: { url: string }
}

const HomeStack = createStackNavigator<HomeStackParamList>()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
	const dispatch = useDispatch()

	useFocusEffect(() => {
		dispatch(updateTabBarVisible(true))
	})

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
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

	// TODO added from #14163
	const onCoronaVirusFAQ = (): void => {
		navigation.navigate('CoronaFAQ', { url: 'http://www.google.com' })
	}

	// TODO #14384
	const onScreeningTool = (): void => {}

	const { t } = useTranslation(NAMESPACE.HOME)

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineButton />
			<ScrollView accessibilityRole={'menu'} alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
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
			</ScrollView>
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

type HomeStackScreenProps = {}

const HomeStackScreen: FC<HomeStackScreenProps> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)

	return (
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('details.title') }} />
			<HomeStack.Screen name="CoronaFAQ" component={WebviewScreen} options={{ headerShown: false }} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
