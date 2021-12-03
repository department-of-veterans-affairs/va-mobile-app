import { pick } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'
import React, { FC, useState } from 'react'

import { AuthState, AuthorizedServicesState, NotificationsState, StoreState } from 'store/reducers'
import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { DEVICE_ENDPOINT_SID, debugResetFirstTimeLogin } from 'store/actions'
import { resetReviewActionCount } from 'utils/inAppReviews'
import { showSnackBar } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<StoreState, AuthState>((state) => state.auth)
  const authorizedServices = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useDispatch()

  // helper function for anything saved in AsyncStorage
  const getAsyncStoredData = async (key: string, setStateFun: (val: string) => void) => {
    const asyncVal = (await AsyncStorage.getItem(key)) || ''
    setStateFun(asyncVal)
  }

  // push data
  const { deviceToken } = useSelector<StoreState, NotificationsState>((state) => state.notifications)
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
    showSnackBar('test', dispatch)
  }

  return (
    <Box {...props} {...testIdProps('Debug-page')}>
      <VAScrollView>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton onPress={onResetFirstTimeLogin} label={'Reset First Time Login'} buttonType={ButtonTypesConstants.buttonPrimary} />
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton onPress={resetInAppReview} label={'Reset In-App Review Actions'} buttonType={ButtonTypesConstants.buttonPrimary} />
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
