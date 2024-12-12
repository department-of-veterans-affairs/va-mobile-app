import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { pick } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { DEVICE_ENDPOINT_SID, DEVICE_TOKEN_KEY } from 'api/notifications'
import {
  Box,
  ButtonDecoratorType,
  FeatureLandingTemplate,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
  VATextInput,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { AnalyticsState } from 'store/slices'
import { toggleFirebaseDebugMode } from 'store/slices/analyticsSlice'
import { AuthState, debugResetFirstTimeLogin } from 'store/slices/authSlice'
import getEnv, { EnvVars } from 'utils/env'
import {
  FeatureConstants,
  getLocalVersion,
  getStoreVersion,
  getVersionSkipped,
  overrideLocalVersion,
  setVersionSkipped,
} from 'utils/homeScreenAlerts'
import { useAlert, useAppDispatch, useGiveFeedback, useRouteNavigation, useTheme } from 'utils/hooks'
import { STORAGE_REVIEW_EVENT_KEY, resetReviewActionCount } from 'utils/inAppReviews'

type DeveloperScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'Developer'>

function DeveloperScreen({ navigation }: DeveloperScreenSettingsScreenProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { authCredentials } = useSelector<RootState, AuthState>((state) => state.auth)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const tokenInfo =
    (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const resetFirstTimeLoginAlert = useAlert()
  const inAppFeedback = useGiveFeedback()
  const [localVersionName, setVersionName] = useState<string>()
  const [whatsNewLocalVersion, setWhatsNewVersion] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [whatsNewSkippedVersion, setWhatsNewSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
  const [reviewCount, setReviewCount] = useState<string>()
  const componentMounted = useRef(true)

  async function checkEncourageUpdateLocalVersion() {
    const version = await getLocalVersion(FeatureConstants.ENCOURAGEUPDATE, true)
    if (componentMounted.current) {
      setVersionName(version)
    }
  }

  async function checkWhatsNewLocalVersion() {
    const version = await getLocalVersion(FeatureConstants.WHATSNEW, true)
    if (componentMounted.current) {
      setWhatsNewVersion(version)
    }
  }

  useEffect(() => {
    async function checkSkippedVersion() {
      const version = await getVersionSkipped(FeatureConstants.ENCOURAGEUPDATE)
      if (componentMounted.current) {
        setSkippedVersionHomeScreen(version)
      }
    }
    async function checkWhatsNewSkippedVersion() {
      const version = await getVersionSkipped(FeatureConstants.WHATSNEW)
      if (componentMounted.current) {
        setWhatsNewSkippedVersionHomeScreen(version)
      }
    }
    async function checkStoreVersion() {
      const result = await getStoreVersion()
      if (componentMounted.current) {
        setStoreVersionScreen(result)
      }
    }
    checkStoreVersion()
    checkSkippedVersion()
    checkWhatsNewSkippedVersion()
    checkEncourageUpdateLocalVersion()
    checkWhatsNewLocalVersion()
    return () => {
      componentMounted.current = false
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getAsyncStoredData(STORAGE_REVIEW_EVENT_KEY, setReviewCount)
    }, []),
  )
  // helper function for anything saved in AsyncStorage
  const getAsyncStoredData = async (key: string, setStateFun: (val: string) => void) => {
    const asyncVal = (await AsyncStorage.getItem(key)) || ''
    setStateFun(asyncVal)
  }

  // push data
  const { firebaseDebugMode } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const [deviceAppSid, setDeviceAppSid] = useState<string>('')
  const [deviceToken, setDeviceToken] = useState<string>('')
  getAsyncStoredData(DEVICE_TOKEN_KEY, setDeviceToken)
  getAsyncStoredData(DEVICE_ENDPOINT_SID, setDeviceAppSid)

  Object.keys(tokenInfo).forEach((key) => {
    console.log(`${key}:`)
    console.log(tokenInfo[key])
  })

  const envVars = getEnv()

  const onResetFirstTimeLogin = (): void => {
    resetFirstTimeLoginAlert({
      title: t('areYouSure'),
      message: 'This will clear all session activity and redirect you back to the login screen.',
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('reset'),
          onPress: () => {
            console.debug('Resetting first time login flag')
            dispatch(debugResetFirstTimeLogin())
          },
        },
      ],
    })
  }

  const resetInAppReview = async () => {
    try {
      await resetReviewActionCount()
      getAsyncStoredData(STORAGE_REVIEW_EVENT_KEY, setReviewCount)
      snackbar.show('In app review actions reset')
    } catch {
      snackbar.show('Failed to reset in app review actions', { isError: true, onActionPressed: resetInAppReview })
    }
  }

  const firebaseList: Array<SimpleListItemObj> = [
    {
      text: 'Firebase debug mode',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: firebaseDebugMode,
      },
      onPress: () => dispatch(toggleFirebaseDebugMode()),
    },
    {
      text: 'Remote Config',
      decorator: ButtonDecoratorType.Navigation,
      onPress: () => navigateTo('RemoteConfig'),
      testId: 'Remote Config',
    },
  ]

  const onFeedback = () => {
    //logAnalyticsEvent(Events.vama_feedback_page_entered())
    inAppFeedback('Developer')
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('debug.title')}
      testID="developerScreenTestID">
      <TextView
        variant={'MobileBodyBold'}
        accessibilityRole={'header'}
        mx={theme.dimensions.gutter}
        mb={theme.dimensions.standardMarginBetween}>
        Reset options
      </TextView>
      <Box>
        <TextArea>
          <Button onPress={onResetFirstTimeLogin} label={'Reset first time login'} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <Button onPress={resetInAppReview} label={'Reset in-app review actions'} />
          <Box mt={theme.dimensions.condensedMarginBetween} flexDirection="row" alignItems="flex-end">
            <TextView variant={'MobileBody'}>In-App Review Count:</TextView>
            <TextView ml={theme.dimensions.standardMarginBetween}>
              {reviewCount ? parseInt(reviewCount, 10) : 0}
            </TextView>
          </Box>
        </TextArea>
        <TextArea>
          <Button onPress={onFeedback} label={'In App Feedback Screen'} />
        </TextArea>
      </Box>
      <Box>
        <TextView
          variant={'MobileBodyBold'}
          accessibilityRole={'header'}
          mx={theme.dimensions.gutter}
          my={theme.dimensions.standardMarginBetween}>
          Firebase
        </TextView>
        <SimpleList items={firebaseList} />
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextArea>
          <Button onPress={() => navigateTo('OverrideAPI')} label={'Override Api Calls'} />
        </TextArea>
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Auth Tokens
          </TextView>
        </TextArea>
      </Box>
      {Object.keys(tokenInfo).map((key: string) => {
        const val = tokenInfo[key]
        return (
          <Box key={key} mt={theme.dimensions.condensedMarginBetween}>
            <TextArea>
              <TextView variant="MobileBodyBold">{key}</TextView>
              <TextView selectable={true}>{val}</TextView>
            </TextArea>
          </Box>
        )
      })}
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Authorized Services
          </TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {userAuthorizedServices
          ? Object.entries(userAuthorizedServices).map((key) => {
              return (
                <Box key={key[0]} mt={theme.dimensions.condensedMarginBetween}>
                  <TextArea>
                    <TextView variant="MobileBodyBold">{key}</TextView>
                    <TextView selectable={true}>{key[1].toString()}</TextView>
                  </TextArea>
                </Box>
              )
            })
          : undefined}
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Environment Variables
          </TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {Object.keys(envVars).map((key: string) => {
          const val = (envVars[key as keyof EnvVars] || '').toString()
          return (
            <Box key={key} mt={theme.dimensions.condensedMarginBetween}>
              <TextArea>
                <TextView variant="MobileBodyBold">{key}</TextView>
                <TextView selectable={true}>{val}</TextView>
              </TextArea>
            </Box>
          )
        })}
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Encouraged Update and What's New Versions
          </TextView>
          <TextView variant="MobileBodyBold">Encourage Update Local Version</TextView>
          <TextView>{localVersionName}</TextView>
          <TextView variant="MobileBodyBold">What's New Local Version</TextView>
          <TextView>{whatsNewLocalVersion}</TextView>
          <TextView variant="MobileBodyBold">Store Version</TextView>
          <TextView>{storeVersion}</TextView>
          <TextView variant="MobileBodyBold">Encourage Update Skipped Version</TextView>
          <TextView>{skippedVersion}</TextView>
          <TextView variant="MobileBodyBold">Whats New Skipped Version</TextView>
          <TextView>{whatsNewSkippedVersion}</TextView>
          <TextView variant="MobileBodyBold">Override Encourage Update Local Version</TextView>
          <VATextInput
            inputType={'none'}
            onChange={(val) => {
              if (val.length >= 1) {
                overrideLocalVersion(FeatureConstants.ENCOURAGEUPDATE, val)
                setVersionName(val)
              } else {
                overrideLocalVersion(FeatureConstants.ENCOURAGEUPDATE, undefined)
                checkEncourageUpdateLocalVersion()
              }
            }}
          />
          <TextView variant="MobileBodyBold">Override What's New Local Version</TextView>
          <VATextInput
            inputType={'none'}
            onChange={(val) => {
              if (val.length >= 1) {
                overrideLocalVersion(FeatureConstants.WHATSNEW, val)
                setWhatsNewVersion(val)
              } else {
                overrideLocalVersion(FeatureConstants.WHATSNEW, undefined)
                checkWhatsNewLocalVersion()
              }
            }}
          />
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <Button
              onPress={() => {
                setSkippedVersionHomeScreen('0.0')
                setWhatsNewSkippedVersionHomeScreen('0.0')
                setVersionSkipped(FeatureConstants.ENCOURAGEUPDATE, '0.0')
                setVersionSkipped(FeatureConstants.WHATSNEW, '0.0')
                overrideLocalVersion(FeatureConstants.WHATSNEW, undefined)
                overrideLocalVersion(FeatureConstants.ENCOURAGEUPDATE, undefined)
                checkEncourageUpdateLocalVersion()
                checkWhatsNewLocalVersion()
              }}
              label={'Reset Versions'}
            />
          </Box>
        </TextArea>
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Push Notifications
          </TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">Device Token</TextView>
            <TextView selectable={true}>{deviceToken}</TextView>
          </TextArea>
        </Box>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">Endpoint SID</TextView>
            <TextView selectable={true}>{deviceAppSid}</TextView>
          </TextArea>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DeveloperScreen
