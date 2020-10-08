import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components/native'

import { NAMESPACE } from 'constants/namespaces'
import { ProfileState, StoreState } from 'store/reducers'
import { WideButtonShortBorder } from 'components'
import { getProfileData } from 'store/actions/profile'
import { headerStyles } from 'styles/common'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from './ProfileBanner'
import SettingsScreen from 'screens/SettingsScreen'

const StyledButtonView = styled.ScrollView`
    margin-top: 9px;
`

type ProfileStackParamList = {
	Profile: undefined
    Settings: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
	const { t } = useTranslation(NAMESPACE.PROFILE)
	const dispatch = useDispatch()

	const { profileData } = useSelector<StoreState, ProfileState>((state) => state.profile)

	useEffect(() => {
		dispatch(getProfileData())
	}, [])

	const onPersonalAndContactInformation = (): void => {}

    const onMilitaryInformation = (): void => {}

    const onDirectDeposit = (): void => {}

    const onLettersAndDocs = (): void => {}

    const onSettings = (): void => {
        navigation.navigate('Settings')
    }

	return (
		<ScrollView {...testIdProps('Profile-screen')}>
			<ProfileBanner {...profileData} />
			<StyledButtonView>
                <WideButtonShortBorder title={t('personalInformation.title')} a11yHint={t('personalInformation.a11yHint')} onPress={onPersonalAndContactInformation} isFirst={true}/>
                <WideButtonShortBorder title={t('militaryInformation.title')} a11yHint={t('militaryInformation.a11yHint')} onPress={onMilitaryInformation}/>
                <WideButtonShortBorder title={t('directDeposit.title')} a11yHint={t('directDeposit.a11yHint')} onPress={onDirectDeposit}/>
                <WideButtonShortBorder title={t('lettersAndDocs.title')} a11yHint={t('lettersAndDocs.a11yHint')} onPress={onLettersAndDocs}/>
                <WideButtonShortBorder title={t('settings.title')} a11yHint={t('settings.a11yHint')} onPress={onSettings} />
            </StyledButtonView>
		</ScrollView>
	)
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.PROFILE)

	return (
		<ProfileStack.Navigator screenOptions={headerStyles}>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
			<ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }}/>
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
