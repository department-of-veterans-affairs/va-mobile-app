import { Button, PermissionsAndroid, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextView } from 'components'
import { addToCalendar, checkPermission, requestCameraPermission } from '../../utils/rnCalendar'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTranslation } from 'utils/hooks'

type ClaimsStackParamList = {
  Claims: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

  const mainViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const addAppointment = async (): Promise<void> => {
    const hasPermission = await checkPermission()
    console.log(`hasPermission: ${hasPermission}`)

    if (!hasPermission) {
      // need to request permission
      const granted = await requestCameraPermission()
      console.log(`granted2: ${granted}`)
      // if we ask and they decline then exit
      if (!granted) {
        return
      }
    }
    await addToCalendar('test', 1605553796, 1605554000, '1 federal drive, st paul, mn 55101')
  }

  return (
    <View style={mainViewStyle} {...testIdProps('Claims-screen')}>
      <TextView>{t('claimsText')}</TextView>
      <Button title={'calendar'} onPress={(): Promise<void> => addAppointment()} />
    </View>
  )
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const headerStyles = useHeaderStyles()

  return (
    <ClaimsStack.Navigator screenOptions={headerStyles}>
      <ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('title') }} />
    </ClaimsStack.Navigator>
  )
}

export default ClaimsStackScreen
