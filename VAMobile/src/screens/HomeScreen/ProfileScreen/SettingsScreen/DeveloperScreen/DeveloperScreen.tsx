import { pick } from 'underscore'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Clipboard from '@react-native-community/clipboard'
import React, { FC, useEffect, useRef, useState } from 'react'

import { Box, ButtonTypesConstants, FeatureLandingTemplate, TextArea, TextView, VAButton, VATextInput } from 'components'

import { AnalyticsState } from 'store/slices'
import { AuthState, debugResetFirstTimeLogin } from 'store/slices/authSlice'
import { DEVICE_ENDPOINT_SID, NotificationsState } from 'store/slices/notificationSlice'
import { FeatureConstants, getLocalVersion, getStoreVersion, getVersionSkipped, overrideLocalVersion, setVersionSkipped } from 'utils/homeScreenAlerts'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { StackScreenProps } from '@react-navigation/stack'
import { resetReviewActionCount } from 'utils/inAppReviews'
import { toggleFirebaseDebugMode } from 'store/slices/analyticsSlice'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useSelector } from 'react-redux'
import getEnv, { EnvVars } from 'utils/env'

type DeveloperScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'Developer'>

const DeveloperScreen: FC<DeveloperScreenSettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { authCredentials } = useSelector<RootState, AuthState>((state) => state.auth)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const [localVersionName, setVersionName] = useState<string>()
  const [whatsNewLocalVersion, setWhatsNewVersion] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [whatsNewSkippedVersion, setWhatsNewSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
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

  const onCopy = (copy: string): void => {
    Clipboard.setString(copy)
  }

  Object.keys(tokenInfo).forEach((key) => {
    console.log(`${key}:`)
    console.log(tokenInfo[key])
  })

  const envVars = getEnv()

  const onResetFirstTimeLogin = (): void => {
    console.debug('Resetting first time login flag')
    dispatch(debugResetFirstTimeLogin())
  }

  const resetInAppReview = (): void => {
    resetReviewActionCount()
  }

  const onClickFirebaseDebugMode = (): void => {
    dispatch(toggleFirebaseDebugMode())
  }

  return (
    <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('debug.title')}>
      <Box>
        <TextArea>
          <VAButton onPress={navigateTo('Sandbox')} label={'Sandbox'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <VAButton onPress={navigateTo('HapticsDemoScreen')} label={'haptics demo'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <VAButton onPress={onResetFirstTimeLogin} label={'Reset first time login'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <VAButton onPress={resetInAppReview} label={'Reset in-app review actions'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <VAButton onPress={onClickFirebaseDebugMode} label={`${firebaseDebugMode ? 'Disable' : 'Enable'} Firebase debug mode`} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box>
        <TextArea>
          <VAButton onPress={navigateTo('RemoteConfig')} label={'Remote Config'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </TextArea>
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">Auth Tokens</TextView>
        </TextArea>
      </Box>
      {Object.keys(tokenInfo).map((key: string) => {
        const val = tokenInfo[key]
        return (
          <Box key={key} mt={theme.dimensions.condensedMarginBetween}>
            <TextArea
              onPress={(): void => {
                onCopy(val)
              }}>
              <TextView variant="MobileBodyBold">{key}</TextView>
              <TextView>{val}</TextView>
            </TextArea>
          </Box>
        )
      })}
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">Authorized Services</TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {userAuthorizedServices
          ? Object.entries(userAuthorizedServices).map((key) => {
              return (
                <Box key={key[0]} mt={theme.dimensions.condensedMarginBetween}>
                  <TextArea
                    onPress={(): void => {
                      onCopy(key[1].toString())
                    }}>
                    <TextView variant="MobileBodyBold">{key}</TextView>
                    <TextView>{key[1].toString()}</TextView>
                  </TextArea>
                </Box>
              )
            })
          : undefined}
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">Environment Variables</TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {Object.keys(envVars).map((key: string) => {
          const val = (envVars[key as keyof EnvVars] || '').toString()
          return (
            <Box key={key} mt={theme.dimensions.condensedMarginBetween}>
              <TextArea
                onPress={(): void => {
                  onCopy(val)
                }}>
                <TextView variant="MobileBodyBold">{key}</TextView>
                <TextView>{val}</TextView>
              </TextArea>
            </Box>
          )
        })}
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">Encouraged Update and What's New Versions</TextView>
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
            <VAButton
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
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
          </Box>
        </TextArea>
      </Box>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="BitterBoldHeading">Push Notifications</TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea
            onPress={(): void => {
              onCopy(deviceToken || '')
            }}>
            <TextView variant="MobileBodyBold">Device Token</TextView>
            <TextView>{deviceToken}</TextView>
          </TextArea>
        </Box>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea
            onPress={(): void => {
              onCopy(deviceToken || '')
            }}>
            <TextView variant="MobileBodyBold">Endpoint SID</TextView>
            <TextView>{deviceAppSid}</TextView>
          </TextArea>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DeveloperScreen
