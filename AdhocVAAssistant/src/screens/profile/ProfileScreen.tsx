import { Button, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { StyledSourceRegularText } from 'styles/common'
import { logout } from 'store/actions/auth'
import { testIdProps } from 'utils/accessibility'

type ProfileStackParamList = {
	Profile: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
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
			<StyledSourceRegularText>Profile Screen</StyledSourceRegularText>
			<Button title="Logout" onPress={onLogout} />
		</View>
	)
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="Profile" component={ProfileScreen} />
		</ProfileStack.Navigator>
	)
}

export default ProfileStackScreen
