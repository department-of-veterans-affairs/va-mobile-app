import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import React, { FC } from 'react'

type ProfileStackParamList = {
	Profile: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Profile-screen')}>
			<Text>Profile Screen</Text>
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
