import React from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { TravelPayError } from 'constants/travelPay'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'

import { HealthStackParamList } from '../HealthStackScreens'
import {
  AddressScreen,
  ErrorScreen,
  MileageScreen,
  ReviewClaimScreen,
  SubmitSuccessScreen,
  VehicleScreen,
} from './SubmitTravelPayFlowSteps'
import InterstitialScreen from './SubmitTravelPayFlowSteps/InterstitialScreen'

export type SubmitTravelPayFlowModalStackParamList = WebviewStackParams & {
  InterstitialScreen: undefined
  MileageScreen: undefined
  VehicleScreen: undefined
  AddressScreen: undefined
  ReviewClaimScreen: {
    appointmentDateTime: string
    facilityName: string
  }
  SubmitSuccessScreen: {
    appointmentDateTime: string
    facilityName: string
  }
  ErrorScreen: {
    error: TravelPayError
  }
}

type SubmitMileageTravelPayScreenProps = StackScreenProps<HealthStackParamList, 'SubmitTravelPayClaimScreen'> & {
  initialRouteIndex?: number
}

const TravelPayStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

function SubmitMileageTravelPayScreen({ route }: SubmitMileageTravelPayScreenProps) {
  const { appointmentDateTime, facilityName } = route.params

  return (
    <MultiStepSubtask<SubmitTravelPayFlowModalStackParamList>
      stackNavigator={TravelPayStack}
      navigationMultiStepCancelScreen={1}>
      <TravelPayStack.Screen key="InterstitialScreen" name="InterstitialScreen" component={InterstitialScreen} />
      <TravelPayStack.Screen key="MileageScreen" name="MileageScreen" component={MileageScreen} />
      <TravelPayStack.Screen key="VehicleScreen" name="VehicleScreen" component={VehicleScreen} />
      <TravelPayStack.Screen key="AddressScreen" name="AddressScreen" component={AddressScreen} />
      <TravelPayStack.Screen
        key="ReviewClaimScreen"
        name="ReviewClaimScreen"
        component={ReviewClaimScreen}
        initialParams={{ appointmentDateTime, facilityName }}
      />
      <TravelPayStack.Screen
        key="SubmitSuccessScreen"
        name="SubmitSuccessScreen"
        component={SubmitSuccessScreen}
        initialParams={{ appointmentDateTime, facilityName }}
      />
      <TravelPayStack.Screen key="ErrorScreen" name="ErrorScreen" component={ErrorScreen} />
    </MultiStepSubtask>
  )
}

export default SubmitMileageTravelPayScreen
