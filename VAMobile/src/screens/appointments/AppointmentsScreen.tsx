import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { StyledSourceRegularText, headerStyles } from 'styles/common'
import { testIdProps } from 'utils/accessibility'

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
			<StyledSourceRegularText>Appointments Screen</StyledSourceRegularText>
		</View>
	)
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
	return (
		<AppointmentsStack.Navigator screenOptions={headerStyles}>
			<AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} />
		</AppointmentsStack.Navigator>
	)
}

export default AppointmentsStackScreen
