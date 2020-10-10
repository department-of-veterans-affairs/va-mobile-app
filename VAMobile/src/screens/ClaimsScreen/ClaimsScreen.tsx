import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { headerStyles } from 'styles/common'
import { testIdProps } from 'utils/accessibility'
import TextView from 'components/TextView'

type ClaimsStackParamList = {
	Claims: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
	const { t } = useTranslation(NAMESPACE.CLAIMS)

	const mainViewStyle: StyleProp<ViewStyle> = {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<View style={mainViewStyle} {...testIdProps('Claims-screen')}>
			<TextView>{t('claimsText')}</TextView>
		</View>
	)
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
	const { t } = useTranslation(NAMESPACE.CLAIMS)

	return (
		<ClaimsStack.Navigator screenOptions={headerStyles}>
			<ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('title') }} />
		</ClaimsStack.Navigator>
	)
}

export default ClaimsStackScreen
