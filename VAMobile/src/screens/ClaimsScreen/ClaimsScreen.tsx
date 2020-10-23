import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTranslation } from 'utils/hooks'

type ClaimsStackParamList = {
  Claims: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation('claims')

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
  const t = useTranslation('claims')
  const headerStyles = useHeaderStyles()

  return (
    <ClaimsStack.Navigator screenOptions={headerStyles}>
      <ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('title') }} />
    </ClaimsStack.Navigator>
  )
}

export default ClaimsStackScreen
