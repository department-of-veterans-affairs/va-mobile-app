import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { Box, FullScreenSubtask, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { useRouteNavigation } from 'utils/hooks'

import { HealthStackParamList } from '../HealthStackScreens'
import {
  AddressScreen,
  ErrorScreen,
  MileageScreen,
  NotEligibleTypeScreen,
  ReviewClaimScreen,
  SubmitSuccessScreen,
  VehicleScreen,
} from './SubmitTravelPayFlowSteps'

type ScreenListObj = {
  name: string
  backButtonOnPress: (() => void) | undefined
  leftButtonText: string
  primaryButtonOnPress: (() => void) | undefined
  primaryButtonText: string
  secondaryButtonText: string | undefined
  secondaryButtonOnPress: (() => void) | undefined
}

export type SubmitTravelPayFlowModalStackParamList = WebviewStackParams & {
  MileageScreen: undefined
  VehicleScreen: undefined
  AddressScreen: undefined
  ReviewClaimScreen: undefined
  SubmitSuccessScreen: undefined
  NotEligibleTypeScreen: undefined
  ErrorScreen: {
    error: string | undefined
  }
}

type SubmitMileageTravelPayScreenProps = StackScreenProps<HealthStackParamList, 'SubmitTravelPayClaimScreen'>

function SubmitMileageTravelPayScreen({ navigation, route }: SubmitMileageTravelPayScreenProps) {
  const { appointmentDateTime } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const [screenListIndex, setScreenListIndex] = useState(2)
  const [notEligibleBackIndex, setNotEligibleBackIndex] = useState(2)
  const [error, setError] = useState<string | undefined>('This is a random error')

  const navigateToNextScreen = () => {
    const nextScreenIndex = screenListIndex + 1
    setScreenListIndex(nextScreenIndex)
    navigateTo(screenList[nextScreenIndex].name)
  }

  const submitTravelClaim = () => {
    if (error) {
      // Error screen is always index 1
      setScreenListIndex(1)
      navigateTo('ErrorScreen', { error })
    } else {
      navigateToNextScreen()
      console.log('Submitted!')
    }
  }

  const navigateToNoScreen = () => {
    setNotEligibleBackIndex(screenListIndex)
    // Not eligiblt type screen is always index 0
    setScreenListIndex(0)
    navigateTo('NotEligibleTypeScreen')
    console.log('not eligible!')
  }

  const notEligibleCloseOnPress = () => {
    console.info(notEligibleBackIndex)
    setScreenListIndex(notEligibleBackIndex)
    navigateTo(screenList[notEligibleBackIndex].name)
  }

  const TravelPayStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

  const screenList: Array<ScreenListObj> = [
    {
      name: 'NotEligibleTypeScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      primaryButtonText: t('close'),
      primaryButtonOnPress: notEligibleCloseOnPress,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
    {
      name: 'ErrorScreen',
      backButtonOnPress: navigation.goBack,
      leftButtonText: t('close'),
      primaryButtonText: t('close'),
      primaryButtonOnPress: navigation.goBack,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
    {
      name: 'MileageScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      primaryButtonText: t('yes'),
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToNoScreen,
    },
    {
      name: 'VehicleScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      primaryButtonText: t('yes'),
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToNoScreen,
    },
    {
      name: 'AddressScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      primaryButtonText: t('yes'),
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToNoScreen,
    },
    {
      name: 'ReviewClaimScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      primaryButtonText: t('submit'),
      primaryButtonOnPress: submitTravelClaim,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
    {
      name: 'SubmitSuccessScreen',
      backButtonOnPress: navigation.goBack,
      leftButtonText: t('close'),
      primaryButtonText: t('close'),
      primaryButtonOnPress: navigation.goBack,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
  ]

  return (
    <FullScreenSubtask
      leftButtonText={screenList[screenListIndex].leftButtonText}
      onLeftButtonPress={screenList[screenListIndex].backButtonOnPress}
      leftButtonA11yLabel={screenList[screenListIndex].leftButtonText}
      leftButtonTestID={screenList[screenListIndex].leftButtonText}
      scrollViewRef={null}
      // menuViewActions
      primaryContentButtonText={screenList[screenListIndex].primaryButtonText}
      onPrimaryContentButtonPress={screenList[screenListIndex].primaryButtonOnPress}
      primaryButtonTestID={screenList[screenListIndex].primaryButtonText}
      secondaryContentButtonText={screenList[screenListIndex].secondaryButtonText}
      onSecondaryContentButtonPress={screenList[screenListIndex].secondaryButtonOnPress}
      // navigationMultiStepCancelScreen={} // TODO maybe?
      testID={screenList[screenListIndex].name}>
      <Box flex={1} backgroundColor="main">
        <TravelPayStack.Navigator
          initialRouteName="MileageScreen"
          screenOptions={{ headerShown: false, detachPreviousScreen: true, ...TransitionPresets.SlideFromRightIOS }}>
          <TravelPayStack.Screen key={'MileageScreen'} name="MileageScreen" component={MileageScreen} />
          <TravelPayStack.Screen key={'VehicleScreen'} name="VehicleScreen" component={VehicleScreen} />
          <TravelPayStack.Screen key={'AddressScreen'} name="AddressScreen" component={AddressScreen} />
          <TravelPayStack.Screen
            key={'NotEligibleTypeScreen'}
            name="NotEligibleTypeScreen"
            component={NotEligibleTypeScreen}
          />
          <TravelPayStack.Screen key={'ReviewClaimScreen'} name="ReviewClaimScreen" component={ReviewClaimScreen} />
          <TravelPayStack.Screen
            key={'SubmitSuccessScreen'}
            name="SubmitSuccessScreen"
            component={SubmitSuccessScreen}
          />
          <TravelPayStack.Screen key={'ErrorScreen'} name="ErrorScreen" component={ErrorScreen} />
        </TravelPayStack.Navigator>
      </Box>
    </FullScreenSubtask>
  )
}

export default SubmitMileageTravelPayScreen
