import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, ButtonListItemObj } from 'components'
import { ButtonList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles } from 'utils/hooks'
import DirectDepositScreen from './DirectDepositScreen'
import ProfileBanner from './ProfileBanner'
import SettingsScreen from './SettingsScreen'

type ProfileStackParamList = {
	Profile: undefined
	Settings: undefined
	Direct_Deposit: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
	const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

	const onPersonalAndContactInformation = (): void => {}

	const onMilitaryInformation = (): void => {}

	const onDirectDeposit = (): void => {
		navigation.navigate('Direct_Deposit')
	}

	const onLettersAndDocs = (): void => {}

	const onSettings = (): void => {
		navigation.navigate('Settings')
	}

	const buttonDataList: Array<ButtonListItemObj> = [
		{ textIDs: ['personalInformation.title'], a11yHintID: 'personalInformation.a11yHint', onPress: onPersonalAndContactInformation },
		{ textIDs: ['militaryInformation.title'], a11yHintID: 'militaryInformation.a11yHint', onPress: onMilitaryInformation },
		{ textIDs: ['directDeposit.title'], a11yHintID: 'directDeposit.a11yHint', onPress: onDirectDeposit },
		{ textIDs: ['lettersAndDocs.title'], a11yHintID: 'lettersAndDocs.a11yHint', onPress: onLettersAndDocs },
		{ textIDs: ['settings.title'], a11yHintID: 'settings.a11yHint', onPress: onSettings },
	]

	return (
		<ScrollView {...testIdProps('Profile-screen')}>
			<ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
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
			<ProfileStack.Screen name="Direct_Deposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
