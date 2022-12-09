import { pick } from 'underscore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Clipboard from '@react-native-community/clipboard'
import React, { FC, useEffect, useRef, useState } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'

import { AnalyticsState } from 'store/slices'
import { AuthState, debugResetFirstTimeLogin } from 'store/slices/authSlice'
import { AuthorizedServicesState } from 'store/slices/authorizedServicesSlice'
import { DEVICE_ENDPOINT_SID, NotificationsState } from 'store/slices/notificationSlice'
import { RootState } from 'store'
import { getEncourageUpdateLocalVersion, getStoreVersion, getVersionSkipped } from 'utils/encourageUpdate'
import { resetReviewActionCount } from 'utils/inAppReviews'
import { testIdProps } from 'utils/accessibility'
import { toggleFirebaseDebugMode } from 'store/slices/analyticsSlice'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<RootState, AuthState>((state) => state.auth)
  const authorizedServices = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const [localVersionName, setVersionName] = useState<string>()
  const [skippedVersion, setSkippedVersionHomeScreen] = useState<string>()
  const [storeVersion, setStoreVersionScreen] = useState<string>()
  const componentMounted = useRef(true)

  useEffect(() => {
    async function checkLocalVersion() {
      const version = await getEncourageUpdateLocalVersion()
      if (componentMounted.current) {
        setVersionName(version)
      }
    }

    async function checkSkippedVersion() {
      const version = await getVersionSkipped()
      if (componentMounted.current) {
        setSkippedVersionHomeScreen(version)
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
    checkLocalVersion()
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

  const props: BoxProps = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }

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
    <Box {...props} {...testIdProps('Debug-page')}>
      <VAScrollView>
        <Box>
          <TextArea>
            <VAButton onPress={navigateTo('Sandbox')} label={'Sandbox'} buttonType={ButtonTypesConstants.buttonPrimary} />
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
            <VAButton
              onPress={onClickFirebaseDebugMode}
              label={`${firebaseDebugMode ? 'Disable' : 'Enable'} Firebase debug mode`}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
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
          {Object.keys(authorizedServices).map((key: string) => {
            if (key === 'error') {
              return null
            }
            const val = (authorizedServices[key as keyof AuthorizedServicesState] || 'false').toString()
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
            <TextView variant="BitterBoldHeading">Encouraged Update Versions</TextView>
            <TextView variant="MobileBodyBold">Local Version</TextView>
            <TextView>{localVersionName}</TextView>
            <TextView variant="MobileBodyBold">Store Version</TextView>
            <TextView>{storeVersion}</TextView>
            <TextView variant="MobileBodyBold">Skipped Version</TextView>
            <TextView>{skippedVersion}</TextView>
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
      </VAScrollView>
    </Box>
  )
}

export default DebugScreen
