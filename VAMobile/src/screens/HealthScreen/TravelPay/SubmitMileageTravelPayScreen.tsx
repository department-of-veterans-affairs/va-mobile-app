import React from 'react'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import { TravelPayError } from 'constants/travelPay'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'

import { HealthStackParamList } from '../HealthStackScreens'
import {
  AddressScreen,
  BeneficiaryTravelAgreement,
  BurdenStatement,
  ErrorScreen,
  MileageScreen,
  ReviewClaimScreen,
  SubmitSuccessScreen,
  TravelClaimHelpScreen,
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
  TravelClaimHelpScreen: undefined
}

export type TravelPayStack = WebviewStackParams & {
  FlowSteps: {
    appointmentDateTime: string
    facilityName: string
  }
  BurdenStatementScreen: undefined
  BeneficiaryTravelAgreementScreen: undefined
  TravelClaimHelpScreen: undefined
}

type SubmitMileageTravelPayScreenProps = StackScreenProps<HealthStackParamList, 'SubmitTravelPayClaimScreen'>

const TravelPayStack = createStackNavigator<TravelPayStack>()
const TravelPayMultiStepStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

const FlowSteps = ({ route }: StackScreenProps<TravelPayStack, 'FlowSteps'>) => {
  const { appointmentDateTime, facilityName } = route.params

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
        initialParams={{ appointmentDateTime, facilityName }}
      />
      <TravelPayMultiStepStack.Screen
        key="SubmitSuccessScreen"
        name="SubmitSuccessScreen"
        component={SubmitSuccessScreen}
        initialParams={{ appointmentDateTime, facilityName }}
      />
      <TravelPayMultiStepStack.Screen key="ErrorScreen" name="ErrorScreen" component={ErrorScreen} />
    </MultiStepSubtask>
  )
}

function SubmitMileageTravelPayScreen({ route }: SubmitMileageTravelPayScreenProps) {
  const { appointmentDateTime, facilityName } = route.params

  return (
    <TravelPayStack.Navigator screenOptions={{ headerShown: false }}>
      <TravelPayStack.Screen
        name="FlowSteps"
        component={FlowSteps}
        initialParams={{ appointmentDateTime, facilityName }}
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
