import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonListItemObj, TextView } from 'components'
import { ButtonList } from 'components'
import { CtaButton } from 'components'
import { NAMESPACE, i18n_NS } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store/actions'
import { useHeaderStyles } from 'utils/hooks'
import HomeNavButton from './HomeNavButton'
import WebviewScreen from 'screens/WebviewScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

export type HomeStackParamList = WebviewStackParams & {
	Home: undefined
	HomeDetails: { detail: string }
	Claims: undefined
	Appointments: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

const CrisisLineCta: FC = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	return (
		<CtaButton>
			<TextView color="primaryContrast" variant="MobileBody">
				{t('component.crisisLine.talkToThe')}
			</TextView>
			<TextView color="primaryContrast" variant="MobileBodyBold">
				&nbsp;{t('component.crisisLine.veteranCrisisLine')}
			</TextView>
			<TextView color="primaryContrast" variant="MobileBody">
				&nbsp;{t('component.crisisLine.now')}
			</TextView>
		</CtaButton>
	)
}

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
		navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: 'va.gov' })
	}

	// TODO #14384
	const onScreeningTool = (): void => {}

	const { t } = useTranslation(NAMESPACE.HOME)

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textIDs: 'findLocation.title', a11yHintID: 'findLocation.a11yHint', onPress: onVALocation },
		{ textIDs: 'contactVA.title', a11yHintID: 'contactVA.a11yHint', onPress: onPress },
		{ textIDs: 'coronavirusFaqs.title', a11yHintID: 'coronavirusFaqs.a11yHint', onPress: onCoronaVirusFAQ },
		{ textIDs: 'screeningTool.title', a11yHintID: 'screeningTool.a11yHint', onPress: onScreeningTool },
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
					<ButtonList translationNameSpace={NAMESPACE.HOME as i18n_NS} items={buttonDataList} />
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
				<TextView variant="MobileBody">Details Screen</TextView>
			</View>
		</View>
	)
}

type HomeStackScreenProps = {}

const HomeStackScreen: FC<HomeStackScreenProps> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	const headerStyles = useHeaderStyles()

	return (
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="HomeDetails" component={HomeDetailsScreen} options={{ title: t('details.title') }} />
			<HomeStack.Screen name="Webview" component={WebviewScreen} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
