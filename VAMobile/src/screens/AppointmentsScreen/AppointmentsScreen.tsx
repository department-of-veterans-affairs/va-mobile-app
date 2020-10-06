import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { StyledSourceRegularText } from 'styles/common'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

type AppointmentsStackParamList = {
	Appointments: undefined
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({}) => {
	const { t } = useTranslation(NAMESPACE.APPOINTMENTS)

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Appointments-screen')}>
			<StyledSourceRegularText>{t('appointmentsText')}</StyledSourceRegularText>
		</View>
	)
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.APPOINTMENTS)

	return (
		<AppointmentsStack.Navigator>
			<AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('title') }} />
		</AppointmentsStack.Navigator>
	)
}

export default AppointmentsStackScreen
