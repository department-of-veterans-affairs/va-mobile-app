import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { FC } from 'react'

import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import AppointmentFlowStep1 from './AppointmentFlow/AppointmentFlowStep1'
import AppointmentFlowStep2 from './AppointmentFlow/AppointmentFlowStep2'
import AppointmentFlowStep3 from './AppointmentFlow/AppointmentFlowStep3'

export type AppointmentFlowModalStackParamList = WebviewStackParams & {
  AppointmentFlowStep1: undefined
  AppointmentFlowStep2: undefined
  AppointmentFlowStep3: undefined
}

const Stack = createStackNavigator<AppointmentFlowModalStackParamList>()

/** Component that will be launch as a modal and house the appointment request flow steps */
const AppointmentFlowModal: FC = () => {
  return (
    <Stack.Navigator initialRouteName="AppointmentFlowStep1" screenOptions={{ headerShown: false, animationEnabled: true, ...TransitionPresets.SlideFromRightIOS }}>
      <Stack.Screen name="AppointmentFlowStep1" component={AppointmentFlowStep1} />
      <Stack.Screen name="AppointmentFlowStep2" component={AppointmentFlowStep2} />
      <Stack.Screen name="AppointmentFlowStep3" component={AppointmentFlowStep3} />
    </Stack.Navigator>
  )
}

export default AppointmentFlowModal
