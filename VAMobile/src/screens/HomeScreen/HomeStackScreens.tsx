import { TFunction } from 'i18next'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
//import SecureMessaging from '../HealthScreen/SecureMessaging'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  ContactVA: undefined
  Claims: undefined
  Appointments: undefined
  SecureMessaging: undefined
  VeteransCrisisLine: undefined
  Covid19VaccinationsForm: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <HomeStack.Screen
      key={'VeteransCrisisLine'}
      name="VeteransCrisisLine"
      component={VeteransCrisisLineScreen}
      options={{ headerShown: false, presentation: 'modal', ...TransitionPresets.ModalTransition }}
    />,
  ]
}
