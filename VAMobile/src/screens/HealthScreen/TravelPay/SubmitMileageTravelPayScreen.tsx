import React from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import { TravelPayError } from 'constants/travelPay'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
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
} from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps'
import { TravelPayContextProvider } from 'screens/HealthScreen/TravelPay/containers/TravelPayContext'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'

export type SubmitTravelPayFlowModalStackParamList = WebviewStackParams & {
  InterstitialScreen: undefined
  MileageScreen: undefined
  VehicleScreen: undefined
  AddressScreen: undefined
  ReviewClaimScreen: undefined
  SubmitSuccessScreen: {
    appointmentDateTime: string
    facilityName: string
    status: string
  }
  SMOCErrorScreen: {
    error: TravelPayError
  }
  TravelClaimHelpScreen: { fromClaimDetails?: boolean }
}

export type TravelPayStack = WebviewStackParams & {
  FlowSteps: undefined
  BurdenStatementScreen: undefined
  BeneficiaryTravelAgreementScreen: undefined
  TravelClaimHelpScreen: { fromClaimDetails?: boolean }
}

type SubmitMileageTravelPayScreenProps = StackScreenProps<HealthStackParamList, 'SubmitTravelPayClaimScreen'>

const TravelPayStack = createStackNavigator<TravelPayStack>()
const TravelPayMultiStepStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

const FlowSteps = () => {
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
      <TravelPayMultiStepStack.Screen key="ReviewClaimScreen" name="ReviewClaimScreen" component={ReviewClaimScreen} />
      <TravelPayMultiStepStack.Screen
        key="SubmitSuccessScreen"
        name="SubmitSuccessScreen"
        component={SubmitSuccessScreen}
        options={{
          // Disable gesture navigation to prevent the user from going back to the previous screen
          gestureEnabled: false,
        }}
      />
      <TravelPayMultiStepStack.Screen key="SMOCErrorScreen" name="SMOCErrorScreen" component={SMOCErrorScreen} />
    </MultiStepSubtask>
  )
}

function SubmitMileageTravelPayScreen({ route }: SubmitMileageTravelPayScreenProps) {
  const { appointment, appointmentRouteKey } = route.params

  return (
    <TravelPayContextProvider appointment={appointment} appointmentRouteKey={appointmentRouteKey}>
      <TravelPayStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FlowSteps">
        <TravelPayStack.Screen name="FlowSteps" component={FlowSteps} />
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
    </TravelPayContextProvider>
  )
}

export default SubmitMileageTravelPayScreen
