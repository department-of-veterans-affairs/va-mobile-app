import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'

import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import React, { FC } from 'react'

type ProfileStackParamList = {
	Profile: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({}) => {
	const { t } = useTranslation(NAMESPACE.PROFILE)

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Profile-screen')}>
			<Text>{t('profileText')}</Text>
		</View>
	)
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.PROFILE)

	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
