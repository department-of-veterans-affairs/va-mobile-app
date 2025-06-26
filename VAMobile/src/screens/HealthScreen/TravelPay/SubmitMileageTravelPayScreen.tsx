import React from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { AppointmentData } from 'api/types'
import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import { TravelPayError } from 'constants/travelPay'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'

import { HealthStackParamList } from '../HealthStackScreens'
import {
  AddressScreen,
  BeneficiaryTravelAgreement,
  BurdenStatement,
  InterstitialScreen,
  MileageScreen,
  ReviewClaimScreen,
  SMOCErrorScreen,
  SubmitSuccessScreen,
  TravelClaimHelpScreen,
  VehicleScreen,
} from './SubmitTravelPayFlowSteps'

export type SubmitTravelPayFlowModalStackParamList = WebviewStackParams & {
  InterstitialScreen: undefined
  MileageScreen: undefined
  VehicleScreen: undefined
  AddressScreen: undefined
  ReviewClaimScreen: {
    appointment: AppointmentData
    appointmentRouteKey: string
    smocFlowStartDate: string
  }
  SubmitSuccessScreen: {
    appointmentDateTime: string
    facilityName: string
    status: string
  }
  SMOCErrorScreen: {
    error: TravelPayError
  }
  TravelClaimHelpScreen: undefined
}

export type TravelPayStack = WebviewStackParams & {
  FlowSteps: {
    appointment: AppointmentData
    appointmentRouteKey: string
    smocFlowStartDate: string
  }
  BurdenStatementScreen: undefined
  BeneficiaryTravelAgreementScreen: undefined
  TravelClaimHelpScreen: undefined
}

type SubmitMileageTravelPayScreenProps = StackScreenProps<HealthStackParamList, 'SubmitTravelPayClaimScreen'>

const TravelPayStack = createStackNavigator<TravelPayStack>()
const TravelPayMultiStepStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

const FlowSteps = ({ route }: StackScreenProps<TravelPayStack, 'FlowSteps'>) => {
  const { appointment, appointmentRouteKey, smocFlowStartDate } = route.params
  const { attributes } = appointment

  return (
    <MultiStepSubtask<SubmitTravelPayFlowModalStackParamList>
      stackNavigator={TravelPayMultiStepStack}
      navigationMultiStepCancelScreen={1}>
      <TravelPayMultiStepStack.Screen
        key="InterstitialScreen"
        name="InterstitialScreen"
        component={InterstitialScreen}
      />
      <TravelPayMultiStepStack.Screen key="MileageScreen" name="MileageScreen" component={MileageScreen} />
      <TravelPayMultiStepStack.Screen key="VehicleScreen" name="VehicleScreen" component={VehicleScreen} />
      <TravelPayMultiStepStack.Screen key="AddressScreen" name="AddressScreen" component={AddressScreen} />
      <TravelPayMultiStepStack.Screen
        key="ReviewClaimScreen"
        name="ReviewClaimScreen"
        component={ReviewClaimScreen}
        initialParams={{ appointment, appointmentRouteKey, smocFlowStartDate }}
      />
      <TravelPayMultiStepStack.Screen
        key="SubmitSuccessScreen"
        name="SubmitSuccessScreen"
        component={SubmitSuccessScreen}
        options={{
          // Disable gesture navigation to prevent the user from going back to the previous screen
          gestureEnabled: false,
        }}
        initialParams={{ appointmentDateTime: attributes.startDateUtc, facilityName: attributes.location.name }}
      />
      <TravelPayMultiStepStack.Screen key="SMOCErrorScreen" name="SMOCErrorScreen" component={SMOCErrorScreen} />
    </MultiStepSubtask>
  )
}

function SubmitMileageTravelPayScreen({ route }: SubmitMileageTravelPayScreenProps) {
  const { appointment, appointmentRouteKey, smocFlowStartDate } = route.params

  return (
    <TravelPayStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FlowSteps">
      <TravelPayStack.Screen
        name="FlowSteps"
        component={FlowSteps}
        initialParams={{ appointment, appointmentRouteKey, smocFlowStartDate }}
      />
      <TravelPayStack.Screen
        key={'TravelClaimHelpScreen'}
        name="TravelClaimHelpScreen"
        component={TravelClaimHelpScreen}
        options={LARGE_PANEL_OPTIONS}
      />
      <TravelPayStack.Screen
        key={'BurdenStatementScreen'}
        name="BurdenStatementScreen"
        component={BurdenStatement}
        options={LARGE_PANEL_OPTIONS}
      />
      <TravelPayStack.Screen
        key={'BeneficiaryTravelAgreementScreen'}
        name="BeneficiaryTravelAgreementScreen"
        component={BeneficiaryTravelAgreement}
        options={LARGE_PANEL_OPTIONS}
      />
    </TravelPayStack.Navigator>
  )
}

export default SubmitMileageTravelPayScreen
