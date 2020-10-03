import { Button, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { StyledSourceRegularText } from 'styles/common'
import { logout } from 'store/actions/auth'
import { testIdProps } from 'utils/accessibility'
import React, { FC } from 'react'

type ProfileStackParamList = {
	Profile: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({}) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const onLogout = (): void => {
		dispatch(logout())
	}

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Profile-screen')}>
			<StyledSourceRegularText>{t('profile.profileText')}</StyledSourceRegularText>
			<Button title="Logout" onPress={onLogout} />
		</View>
	)
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
	const { t } = useTranslation()

	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile.title') }} />
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
