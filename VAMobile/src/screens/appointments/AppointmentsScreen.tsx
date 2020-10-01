import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import React, { FC } from 'react'

type AppointmentsStackParamList = {
	Appointments: undefined
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({ navigation }) => {
	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Appointments-screen')}>
			<Text>Appointments Screen</Text>
		</View>
	)
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
	return (
		<AppointmentsStack.Navigator>
			<AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} />
		</AppointmentsStack.Navigator>
	)
}

export default AppointmentsStackScreen
