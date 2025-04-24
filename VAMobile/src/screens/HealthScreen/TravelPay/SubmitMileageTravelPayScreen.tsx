import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useContactInformation } from 'api/contactInformation'
import { AddressData } from 'api/types'
import { Box, FullScreenSubtask } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayError } from 'constants/travelPay'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useDestructiveActionSheet, useRouteNavigation } from 'utils/hooks'

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

const helpIconProps: IconProps = { name: 'Help', fill: 'default' }

type ScreenListObj = {
  name: string
  backButtonOnPress: (() => void) | undefined
  leftButtonText: string | undefined
  leftButtonOnPress: (() => void) | undefined
  leftButtonTestID: string | undefined
  rightButtonText?: string
  rightIconProps?: IconProps
  rightButtonOnPress?: () => void
  rightButtonTestID?: string
  primaryButtonOnPress: (() => void) | undefined
  primaryButtonTestID: string | undefined
  primaryButtonText: string | undefined
  secondaryButtonText: string | undefined
  secondaryButtonOnPress: (() => void) | undefined
  params?: {
    appointmentDateTime?: string
    facilityName?: string
    loading?: boolean
  }
}

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
    loading: boolean
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

function SubmitMileageTravelPayScreen({ navigation, initialRouteIndex = 1, route }: SubmitMileageTravelPayScreenProps) {
  const { appointmentDateTime, facilityName } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const confirmAlert = useDestructiveActionSheet()

  const [loading, setLoading] = useState(true)
  const [screenListIndex, setScreenListIndex] = useState(initialRouteIndex)

  useBeforeNavBackListener(navigation, (e) => {
    if (
      screenList[screenListIndex].rightButtonText === t('close') ||
      screenList[screenListIndex].primaryButtonText === t('travelPay.continueToClaim')
    ) {
      return
    } else {
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
    }
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

  const navigateToErrorScreen = (error: TravelPayError = 'error') => {
    // Error screen is always index 0
    setScreenListIndex(0)
    navigateTo('ErrorScreen', { error })
  }

  const navigateToNextScreen = () => {
    const nextScreenIndex = screenListIndex + 1
    setScreenListIndex(nextScreenIndex)
    navigateTo(screenList[nextScreenIndex].name, screenList[nextScreenIndex].params)
  }

  const navigateToPreviousScreen = () => {
    const previousScreenIndex = screenListIndex - 1
    setScreenListIndex(previousScreenIndex)
    navigateTo(screenList[previousScreenIndex].name, screenList[previousScreenIndex].params)
  }

  const submitTravelClaim = async () => {
    setLoading(true)

    // Set a timeout to navigate to the error screen if the claim is not submitted in 30 seconds
    const timeout = setTimeout(() => {
      navigateToErrorScreen()
    }, 30000)
    try {
      // Mock a request to submit the claim
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      setLoading(false)
      navigateTo('SubmitSuccessScreen', {
        appointmentDateTime,
        facilityName,
        loading: false,
      })
      setScreenListIndex((prev) => prev + 1)
    } catch (error) {
      navigateToErrorScreen()
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const navigateToTravelClaimHelpScreen = () => {
    navigateTo('TravelClaimHelpScreen')
  }

  const navigateToUnsupportedTypeScreen = () => {
    navigateToErrorScreen('unsupportedType')
  }

  const navigateToNoAddressScreen = () => {
    navigateToErrorScreen('noAddress')
  }

  const TravelPayStack = createStackNavigator<SubmitTravelPayFlowModalStackParamList>()

  const screenList: Array<ScreenListObj> = [
    {
      name: 'ErrorScreen',
      backButtonOnPress: navigation.goBack,
      leftButtonText: undefined,
      leftButtonTestID: undefined,
      leftButtonOnPress: undefined,
      rightButtonText: t('close'),
      rightButtonOnPress: navigation.goBack,
      rightButtonTestID: 'rightCloseTestID',
      primaryButtonText: undefined,
      primaryButtonTestID: undefined,
      primaryButtonOnPress: undefined,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
    {
      name: 'InterstitialScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('cancel'),
      leftButtonTestID: 'leftCancelTestID',
      leftButtonOnPress: navigation.goBack,
      primaryButtonText: t('continue'),
      primaryButtonTestID: 'continueTestID',
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
    },
    {
      name: 'MileageScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('back'),
      leftButtonTestID: 'leftBackTestID',
      leftButtonOnPress: navigateToPreviousScreen,
      rightButtonText: t('help'),
      rightButtonTestID: 'rightHelpTestID',
      rightButtonOnPress: navigateToTravelClaimHelpScreen,
      rightIconProps: helpIconProps,
      primaryButtonText: t('yes'),
      primaryButtonTestID: 'yesTestID',
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToUnsupportedTypeScreen,
    },
    {
      name: 'VehicleScreen',
      backButtonOnPress: navigateToPreviousScreen,
      leftButtonText: t('back'),
      leftButtonTestID: 'leftBackTestID',
      leftButtonOnPress: navigateToPreviousScreen,
      rightButtonText: t('help'),
      rightButtonTestID: 'rightHelpTestID',
      rightButtonOnPress: navigateToTravelClaimHelpScreen,
      rightIconProps: helpIconProps,
      primaryButtonText: t('yes'),
      primaryButtonTestID: 'yesTestID',
      primaryButtonOnPress: address ? navigateToNextScreen : navigateToNoAddressScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToUnsupportedTypeScreen,
    },
    {
      name: 'AddressScreen',
      backButtonOnPress: navigateToPreviousScreen,
      leftButtonText: t('back'),
      leftButtonTestID: 'leftBackTestID',
      leftButtonOnPress: navigateToPreviousScreen,
      rightButtonText: t('help'),
      rightButtonTestID: 'rightHelpTestID',
      rightButtonOnPress: navigateToTravelClaimHelpScreen,
      rightIconProps: helpIconProps,
      primaryButtonText: t('yes'),
      primaryButtonTestID: 'yesTestID',
      primaryButtonOnPress: navigateToNextScreen,
      secondaryButtonText: t('no'),
      secondaryButtonOnPress: navigateToUnsupportedTypeScreen,
    },
    {
      name: 'ReviewClaimScreen',
      backButtonOnPress: undefined,
      leftButtonText: t('back'),
      leftButtonTestID: 'leftBackTestID',
      leftButtonOnPress: navigateToPreviousScreen,
      rightButtonText: t('help'),
      rightButtonTestID: 'rightHelpTestID',
      rightButtonOnPress: navigateToTravelClaimHelpScreen,
      rightIconProps: helpIconProps,
      primaryButtonText: undefined,
      primaryButtonTestID: undefined,
      primaryButtonOnPress: undefined,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
      params: {
        appointmentDateTime: appointmentDateTime,
        facilityName: facilityName,
      },
    },
    {
      name: 'SubmitSuccessScreen',
      backButtonOnPress: navigation.goBack,
      leftButtonText: undefined,
      leftButtonTestID: undefined,
      leftButtonOnPress: undefined,
      rightButtonText: t('close'),
      rightButtonOnPress: navigation.goBack,
      rightButtonTestID: 'rightCloseTestID',
      primaryButtonText: t('travelPay.continueToClaim'),
      primaryButtonTestID: 'continueToClaimTestID',
      primaryButtonOnPress: navigation.goBack,
      secondaryButtonText: undefined,
      secondaryButtonOnPress: undefined,
      params: {
        appointmentDateTime: appointmentDateTime,
        facilityName: facilityName,
        loading: loading,
      },
    },
  ]

  return (
    <FullScreenSubtask
      leftButtonText={screenList[screenListIndex].leftButtonText}
      onLeftButtonPress={screenList[screenListIndex].leftButtonOnPress}
      leftButtonA11yLabel={screenList[screenListIndex].leftButtonText}
      leftButtonTestID={screenList[screenListIndex].leftButtonTestID}
      rightButtonText={screenList[screenListIndex].rightButtonText}
      rightIconProps={screenList[screenListIndex].rightIconProps}
      onRightButtonPress={screenList[screenListIndex].rightButtonOnPress}
      rightButtonA11yLabel={screenList[screenListIndex].rightButtonText}
      rightButtonTestID={screenList[screenListIndex].rightButtonTestID}
      primaryContentButtonText={screenList[screenListIndex].primaryButtonText}
      onPrimaryContentButtonPress={screenList[screenListIndex].primaryButtonOnPress}
      primaryButtonTestID={screenList[screenListIndex].primaryButtonTestID}
      secondaryContentButtonText={screenList[screenListIndex].secondaryButtonText}
      onSecondaryContentButtonPress={screenList[screenListIndex].secondaryButtonOnPress}
      testID={screenList[screenListIndex].name}>
      <Box flex={1} backgroundColor="main">
        <TravelPayStack.Navigator
          initialRouteName="InterstitialScreen"
          screenOptions={{ headerShown: false, detachPreviousScreen: true, ...TransitionPresets.SlideFromRightIOS }}>
          <TravelPayStack.Screen key={'InterstitialScreen'} name="InterstitialScreen" component={InterstitialScreen} />
          <TravelPayStack.Screen key={'MileageScreen'} name="MileageScreen" component={MileageScreen} />
          <TravelPayStack.Screen key={'VehicleScreen'} name="VehicleScreen" component={VehicleScreen} />
          <TravelPayStack.Screen key={'AddressScreen'} name="AddressScreen" component={AddressScreen} />
          <TravelPayStack.Screen key={'ReviewClaimScreen'} name="ReviewClaimScreen" component={ReviewClaimScreen} />
          <TravelPayStack.Screen
            key={'SubmitSuccessScreen'}
            name="SubmitSuccessScreen"
            component={SubmitSuccessScreen}
            listeners={{
              focus: async () => {
                await submitTravelClaim()
              },
            }}
          />
          <TravelPayStack.Screen key={'ErrorScreen'} name="ErrorScreen" component={ErrorScreen} />
        </TravelPayStack.Navigator>
      </Box>
    </FullScreenSubtask>
  )
}

export default SubmitMileageTravelPayScreen
