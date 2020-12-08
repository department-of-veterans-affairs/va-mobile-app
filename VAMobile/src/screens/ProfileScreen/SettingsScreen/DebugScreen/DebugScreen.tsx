import { ScrollView } from 'react-native'
import { pick } from 'underscore'
import { useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, BoxProps, TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<StoreState, AuthState>((state) => state.auth)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}
  const theme = useTheme()

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

  return (
    <Box {...props} {...testIdProps('Debug-screen')}>
      <ScrollView>
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <TextView variant="BitterBoldHeading">Auth Tokens</TextView>
          </TextArea>
        </Box>
        {Object.keys(tokenInfo).map((key) => {
          const val = tokenInfo[key]
          return (
            <Box mt={theme.dimensions.marginBetweenCards}>
              <TextArea
                key={key}
                onPress={(): void => {
                  onCopy(val)
                }}>
                <TextView variant="MobileBodyBold">{key}</TextView>
                <TextView>{val}</TextView>
              </TextArea>
            </Box>
          )
        })}
        <Box mt={theme.dimensions.marginBetweenCards}>
          <TextArea>
            <TextView variant="BitterBoldHeading">Environment Variables</TextView>
          </TextArea>
        </Box>
        <Box mb={theme.dimensions.contentMarginBottom}>
          {Object.keys(envVars).map((key: string) => {
            const val = envVars[key as keyof EnvVars].toString()
            return (
              <Box mt={theme.dimensions.marginBetweenCards}>
                <TextArea
                  key={key}
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
