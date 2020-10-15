import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import { Box, ButtonList, ButtonListItemObj } from 'components'
import { NAMESPACE, i18n_NS } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store/actions'
import { useHeaderStyles } from 'utils/hooks'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import CrisisLineCta from './CrisisLineCta'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import WebviewScreen from 'screens/WebviewScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

export type HomeStackParamList = WebviewStackParams & {
	Home: undefined
	ContactVA: undefined
	Claims: undefined
	Appointments: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
	const dispatch = useDispatch()
	const { t } = useTranslation(NAMESPACE.HOME)

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

	const onContactVA = (): void => {
		navigation.navigate('ContactVA')
	}

	const onFacilityLocator = (): void => {
		navigation.navigate('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') })
	}

	const onCoronaVirusFAQ = (): void => {
		navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('common:webview.vagov') })
	}

	// TODO #14384
	const onScreeningTool = (): void => {}

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textIDs: 'findLocation.title', a11yHintID: 'findLocation.a11yHint', onPress: onFacilityLocator },
		{ textIDs: 'contactVA.title', a11yHintID: 'contactVA.a11yHint', onPress: onContactVA },
		{ textIDs: 'coronavirusFaqs.title', a11yHintID: 'coronavirusFaqs.a11yHint', onPress: onCoronaVirusFAQ },
		{ textIDs: 'screeningTool.title', a11yHintID: 'screeningTool.a11yHint', onPress: onScreeningTool },
	]

	return (
		<View style={mainViewStyle} {...testIdProps('Home-screen')}>
			<CrisisLineCta />
			<ScrollView accessibilityRole={'menu'}>
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

type HomeStackScreenProps = {}

const HomeStackScreen: FC<HomeStackScreenProps> = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	const headerStyles = useHeaderStyles()

	return (
		<HomeStack.Navigator screenOptions={headerStyles}>
			<HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
			<HomeStack.Screen name="ContactVA" component={ContactVAScreen} options={{ title: t('details.title') }} />
			<HomeStack.Screen name="Webview" component={WebviewScreen} />
		</HomeStack.Navigator>
	)
}

export default HomeStackScreen
