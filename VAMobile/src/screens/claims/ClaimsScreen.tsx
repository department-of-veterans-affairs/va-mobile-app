import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'

import { testIdProps } from 'utils/accessibility'
import React, { FC } from 'react'

type ClaimsStackParamList = {
	Claims: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
	const { t } = useTranslation()

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Claims-screen')}>
			<Text>{t('claims.claimsText')}</Text>
		</View>
	)
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
	const { t } = useTranslation()

	return (
		<ClaimsStack.Navigator>
			<ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />
		</ClaimsStack.Navigator>
	)
}

export default ClaimsStackScreen
