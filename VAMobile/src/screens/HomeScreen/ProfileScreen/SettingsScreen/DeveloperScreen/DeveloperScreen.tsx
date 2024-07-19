import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import { pick } from 'underscore'

import { useAuthSettings, useLogout } from 'api/auth'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, FeatureLandingTemplate, TextArea, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { AnalyticsState } from 'store/slices'
import { toggleFirebaseDebugMode } from 'store/slices/analyticsSlice'
import { DEVICE_ENDPOINT_SID, NotificationsState } from 'store/slices/notificationSlice'
import { debugResetFirstTimeLogin } from 'utils/auth'
import getEnv, { EnvVars } from 'utils/env'
import {
  FeatureConstants,
  getLocalVersion,
  getStoreVersion,
  getVersionSkipped,
  overrideLocalVersion,
  setVersionSkipped,
} from 'utils/homeScreenAlerts'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { resetReviewActionCount } from 'utils/inAppReviews'

type DeveloperScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'Developer'>

function DeveloperScreen({ navigation }: DeveloperScreenSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: userAuthSettings } = useAuthSettings()
  const authCredentials = userAuthSettings?.authCredentials
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const tokenInfo =
    (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const [localVersionName, setVersionName] = useState<string>()
  const [whatsNewLocalVersion, setWhatsNewVersion] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [whatsNewSkippedVersion, setWhatsNewSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
  const componentMounted = useRef(true)
  const queryClient = useQueryClient()
  const { mutate: logout } = useLogout()

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
  // helper function for anything saved in AsyncStorage
  const getAsyncStoredData = async (key: string, setStateFun: (val: string) => void) => {
    const asyncVal = (await AsyncStorage.getItem(key)) || ''
    setStateFun(asyncVal)
  }

  // push data
  const { deviceToken } = useSelector<RootState, NotificationsState>((state) => state.notifications)
  const { firebaseDebugMode } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const [deviceAppSid, setDeviceAppSid] = useState<string>('')
  getAsyncStoredData(DEVICE_ENDPOINT_SID, setDeviceAppSid)

  Object.keys(tokenInfo).forEach((key) => {
    console.log(`${key}:`)
    console.log(tokenInfo[key])
  })

  const envVars = getEnv()

  const onResetFirstTimeLogin = (): void => {
    debugResetFirstTimeLogin(logout, queryClient)
  }

  const resetInAppReview = (): void => {
    resetReviewActionCount()
  }

  const onClickFirebaseDebugMode = (): void => {
    dispatch(toggleFirebaseDebugMode())
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('debug.title')}
      testID="developerScreenTestID">
      <Box>
        <TextArea>
          <Button onPress={onResetFirstTimeLogin} label={'Reset first time login'} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <Button onPress={resetInAppReview} label={'Reset in-app review actions'} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <Button
            onPress={onClickFirebaseDebugMode}
            label={`${firebaseDebugMode ? 'Disable' : 'Enable'} Firebase debug mode`}
          />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <Button onPress={() => navigateTo('RemoteConfig')} label={'Remote Config'} />
        </TextArea>
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
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
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
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
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
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
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
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
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
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
