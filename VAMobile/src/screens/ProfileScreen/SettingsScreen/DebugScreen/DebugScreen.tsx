import { ScrollView } from 'react-native'
import { pick } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'
import React, { FC } from 'react'

import { AuthState, AuthorizedServicesState, StoreState } from 'store/reducers'
import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton } from 'components'
import { debugResetFirstTimeLogin } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<StoreState, AuthState>((state) => state.auth)
  const authorizedServices = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()
  const dispatch = useDispatch()

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

  return (
    <Box {...props} {...testIdProps('Debug-page')}>
      <ScrollView>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <VAButton onPress={onResetFirstTimeLogin} label={'Reset first time login'} buttonType={ButtonTypesConstants.buttonPrimary} />
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
      </ScrollView>
    </Box>
  )
}

export default DebugScreen
