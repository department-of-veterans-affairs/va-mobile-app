import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { ButtonList } from 'components'
import { ButtonListItemObj } from 'components/ButtonList'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles } from 'utils/hooks'
import Box from 'components/Box'
import ProfileBanner from './ProfileBanner'
import SettingsScreen from 'screens/SettingsScreen'

type ProfileStackParamList = {
	Profile: undefined
	Settings: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

	const getFullName = (): string => {
		if (!profile) {
			return ''
		}

		const listOfNameComponents = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)

		const resultingName: Array<string> = []
		listOfNameComponents.map((nameComponent) => {
			resultingName.push(nameComponent.charAt(0).toUpperCase() + nameComponent.slice(1).toLowerCase())
		})

		return resultingName.join(' ').trim()
	}

	const onPersonalAndContactInformation = (): void => {}

	const onMilitaryInformation = (): void => {}

	const onDirectDeposit = (): void => {}

	const onLettersAndDocs = (): void => {}

	const onSettings = (): void => {
		navigation.navigate('Settings')
	}

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textID: 'personalInformation.title', a11yHintID: 'personalInformation.a11yHint', onPress: onPersonalAndContactInformation },
		{ textID: 'militaryInformation.title', a11yHintID: 'militaryInformation.a11yHint', onPress: onMilitaryInformation },
		{ textID: 'directDeposit.title', a11yHintID: 'directDeposit.a11yHint', onPress: onDirectDeposit },
		{ textID: 'lettersAndDocs.title', a11yHintID: 'lettersAndDocs.a11yHint', onPress: onLettersAndDocs },
		{ textID: 'settings.title', a11yHintID: 'settings.a11yHint', onPress: onSettings },
	]

	return (
		<ScrollView {...testIdProps('Profile-screen')}>
			<ProfileBanner name={getFullName()} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
			<Box mt={9}>
				<ButtonList items={buttonDataList} translationNameSpace={NAMESPACE.PROFILE} />
			</Box>
		</ScrollView>
	)
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.PROFILE)
	const headerStyles = useHeaderStyles()

	return (
		<ProfileStack.Navigator screenOptions={headerStyles}>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
			<ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
