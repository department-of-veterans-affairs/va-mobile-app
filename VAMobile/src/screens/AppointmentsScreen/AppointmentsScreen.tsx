import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { StyleProp, View, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTranslation } from 'utils/hooks'

type AppointmentsStackParamList = {
  Appointments: undefined
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({}) => {
  const t = useTranslation('appointments')

  const mainViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <View style={mainViewStyle} {...testIdProps('Appointments-screen')}>
      <TextView variant="MobileBody">{t('appointmentsText')}</TextView>
    </View>
  )
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
  const t = useTranslation('appointments')
  const headerStyles = useHeaderStyles()

  return (
    <AppointmentsStack.Navigator screenOptions={headerStyles}>
      <AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('title') }} />
    </AppointmentsStack.Navigator>
  )
}

export default AppointmentsStackScreen
