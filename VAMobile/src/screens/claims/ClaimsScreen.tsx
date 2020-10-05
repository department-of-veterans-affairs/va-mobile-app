import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { StyledSourceRegularText, headerStyles } from 'styles/common'
import { testIdProps } from 'utils/accessibility'

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
			<StyledSourceRegularText>{t('claims.claimsText')}</StyledSourceRegularText>
		</View>
	)
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
	const { t } = useTranslation()

	return (
		<ClaimsStack.Navigator screenOptions={headerStyles}>
			<ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />
		</ClaimsStack.Navigator>
	)
}

export default ClaimsStackScreen
