import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { useContactInformation } from 'api/contactInformation'
import { AddressData } from 'api/types'
import { Box, FullScreenSubtask } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useDestructiveActionSheet, useRouteNavigation } from 'utils/hooks'

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
  primaryButtonText: string | undefined
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
  const confirmAlert = useDestructiveActionSheet()

  const [screenListIndex, setScreenListIndex] = useState(2)
  const [notEligibleBackIndex, setNotEligibleBackIndex] = useState(2)
  const [error, setError] = useState<string | undefined>()

  useBeforeNavBackListener(navigation, (e) => {
    e.preventDefault()
    confirmAlert({
      title: t('travelPay.cancelClaim.title'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('travelPay.cancelClaim.continue'),
        },
        {
          text: t('travelPay.cancelClaim.cancel'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const contactInformationQuery = useContactInformation()

  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (contactInformationQuery.failureCount > 0) {
      setRetried(true)
    }

    if (retried && !contactInformationQuery.isLoading) {
      const retryStatus = contactInformationQuery.isError ? 'fail' : 'success'
      logAnalyticsEvent(Events.vama_react_query_retry(retryStatus))
    }
  }, [contactInformationQuery, retried])

  const address: AddressData | undefined | null = contactInformationQuery.data?.residentialAddress

  const navigateToNextScreen = (options = {}) => {
    const nextScreenIndex = screenListIndex + 1
    setScreenListIndex(nextScreenIndex)
    navigateTo(screenList[nextScreenIndex].name, options)
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
      primaryButtonText: contactInformationQuery.data && address ? t('yes') : t('cancel'),
      primaryButtonOnPress: contactInformationQuery.data && address ? navigateToNextScreen : navigation.goBack,
      secondaryButtonText: contactInformationQuery.data && address ? t('no') : undefined,
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
      onLeftButtonPress={navigation.goBack}
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
