import { ButtonList } from 'components'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ButtonListItemObj } from 'components/ButtonList'
import { CtaButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { headerStyles } from 'styles/common'
import TextView from 'components/TextView'

const HomeNavButtonsView = styled.View`
	margin-horizontal: 20px;
`

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

const CrisisLineCta: FC = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	return (
		<CtaButton>
			{t('component.crisisLine.talkToThe')}
			<TextView variant="bold" fontSize={17}>
				&nbsp;{t('component.crisisLine.veteranCrisisLine')}
			</TextView>
			<TextView variant="regular" fontSize={17}>
				&nbsp;{t('component.crisisLine.now')}
			</TextView>
		</CtaButton>
	)
}

const HomeScreen: FC<IHomeScreen> = ({ navigation }) => {
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

	// TODO #14163
	const onCoronaVirusFAQ = (): void => {}

	// TODO #14384
	const onScreeningTool = (): void => {}

	const { t } = useTranslation(NAMESPACE.HOME)

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textID: 'findLocation.title', a11yHintID: 'findLocation.a11yHint', onPress: onVALocation },
		{ textID: 'contactVA.title', a11yHintID: 'contactVA.a11yHint', onPress: onPress },
		{ textID: 'coronavirusFaqs.title', a11yHintID: 'coronavirusFaqs.a11yHint', onPress: onCoronaVirusFAQ },
		{ textID: 'screeningTool.title', a11yHintID: 'screeningTool.a11yHint', onPress: onScreeningTool },
	]

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineCta />
			<ScrollView accessibilityRole={'menu'} alwaysBounceHorizontal={false} alwaysBounceVertical={false}>
				<HomeNavButtonsView>
					<HomeNavButton title={t('claimsAndAppeals.title')} subText={t('claimsAndAppeals.subText')} a11yHint={t('claimsAndAppeals.allyHint')} onPress={onClaimsAndAppeals} />
					<HomeNavButton title={t('appointments.title')} subText={t('appointments.subText')} a11yHint={t('appointments.allyHint')} onPress={onAppointments} />
				</HomeNavButtonsView>
				<MiscLinksView>
					<ButtonList translationNameSpace={NAMESPACE.HOME} items={buttonDataList} />
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
			<CrisisLineCta />
			<View style={viewStyle} {...testIdProps('Home-details-screen')}>
				<TextView variant="regular">Details Screen</TextView>
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
