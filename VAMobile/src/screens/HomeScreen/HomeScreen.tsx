import { ButtonList } from 'components'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'

import { Box, ButtonListItemObj, TextView } from 'components'
import { CtaButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useHeaderStyles } from 'utils/hooks'

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
			<TextView color="primaryContrast" variant="body">
				{t('component.crisisLine.talkToThe')}
			</TextView>
			<TextView color="primaryContrast" variant="bodyBold">
				&nbsp;{t('component.crisisLine.veteranCrisisLine')}
			</TextView>
			<TextView color="primaryContrast" variant="body">
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
				<Box mx={20}>
					<HomeNavButton title={t('claimsAndAppeals.title')} subText={t('claimsAndAppeals.subText')} a11yHint={t('claimsAndAppeals.allyHint')} onPress={onClaimsAndAppeals} />
					<HomeNavButton title={t('appointments.title')} subText={t('appointments.subText')} a11yHint={t('appointments.allyHint')} onPress={onAppointments} />
				</Box>
				<Box my={40}>
					<ButtonList translationNameSpace={NAMESPACE.HOME} items={buttonDataList} />
				</Box>
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
				<TextView variant="body">Details Screen</TextView>
			</View>
		</View>
	)
}

type IHomeStackScreen = {}

const HomeStackScreen: FC<IHomeStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	const headerStyles = useHeaderStyles()

	return (
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('details.title') }} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
