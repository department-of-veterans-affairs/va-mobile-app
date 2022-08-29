import { pick } from 'underscore'
import Clipboard from '@react-native-community/clipboard'
import React, { FC, useState } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'

import { AnalyticsState } from 'store/slices'
import { AuthState, debugResetFirstTimeLogin } from 'store/slices/authSlice'
import { AuthorizedServicesState } from 'store/slices/authorizedServicesSlice'
import { DEVICE_ENDPOINT_SID, NotificationsState } from 'store/slices/notificationSlice'
import { FeatureToggleType, featureEnabled, getFeatureToggles, toggleFeature } from 'utils/remoteConfig'
import { RootState } from 'store'
import { logout } from 'store/slices'
import { resetReviewActionCount } from 'utils/inAppReviews'
import { testIdProps } from 'utils/accessibility'
import { toggleFirebaseDebugMode } from 'store/slices/analyticsSlice'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<RootState, AuthState>((state) => state.auth)
  const authorizedServices = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useAppDispatch()

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
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton onPress={onResetFirstTimeLogin} label={'Reset first time login'} buttonType={ButtonTypesConstants.buttonPrimary} />
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton onPress={resetInAppReview} label={'Reset in-app review actions'} buttonType={ButtonTypesConstants.buttonPrimary} />
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton
              onPress={onClickFirebaseDebugMode}
              label={`${firebaseDebugMode ? 'Disable' : 'Enable'} Firebase debug mode`}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
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
            <TextView variant="BitterBoldHeading">Remote Config</TextView>
          </TextArea>
        </Box>
        <Box mb={theme.dimensions.contentMarginBottom}>
          {getFeatureToggles().map((key: string) => {
            if (key === 'error') {
              return null
            }
            const val = featureEnabled(key as FeatureToggleType).toString()
            return (
              <Box key={key} mt={theme.dimensions.condensedMarginBetween}>
                <TextArea>
                  <TextView variant="MobileBodyBold">{key}</TextView>
                  <TextView>{val}</TextView>
                  {key === 'SIS' && (
                    <Box mt={theme.dimensions.contentMarginTop}>
                      <VAButton
                        onPress={() => {
                          toggleFeature('SIS')
                          dispatch(logout())
                        }}
                        label={`${featureEnabled('SIS') ? 'Disable' : 'Enable'} SIS`}
                        buttonType={ButtonTypesConstants.buttonPrimary}
                      />
                    </Box>
                  )}
                </TextArea>
              </Box>
            )
          })}
        </Box>
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
