import { ScrollView } from 'react-native'
import { pick } from 'underscore'
import { useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, BoxProps, TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import getEnv, { EnvVars } from 'utils/env'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<StoreState, AuthState>((state) => state.auth)
  const tokenInfo = (pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}

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
        <TextArea>
          <TextView variant="BitterBoldHeading">Auth Tokens</TextView>
        </TextArea>
        {Object.keys(tokenInfo).map((key) => {
          const val = tokenInfo[key]
          return (
            <TextArea
              key={key}
              onPress={(): void => {
                onCopy(val)
              }}>
              <TextView variant="MobileBodyBold">{key}</TextView>
              <TextView>{val}</TextView>
            </TextArea>
          )
        })}
        <TextArea>
          <TextView variant="BitterBoldHeading">Environment Variables</TextView>
        </TextArea>
        {Object.keys(envVars).map((key: string) => {
          const val = envVars[key as keyof EnvVars]
          return (
            <TextArea
              key={key}
              onPress={(): void => {
                onCopy(val)
              }}>
              <TextView variant="MobileBodyBold">{key}</TextView>
              <TextView>{val}</TextView>
            </TextArea>
          )
        })}
      </ScrollView>
    </Box>
  )
}

export default DebugScreen
