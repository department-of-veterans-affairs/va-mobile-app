import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'
import React, { FC } from 'react'
import _ from 'underscore'

import { AuthState, StoreState } from 'store/reducers'
import { Box, BoxProps, TextArea, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'

const DebugScreen: FC = ({}) => {
  const { authCredentials } = useSelector<StoreState, AuthState>((state) => state.auth)
  const tokenInfo = (_.pick(authCredentials, ['access_token', 'refresh_token', 'id_token']) as { [key: string]: string }) || {}

  const props: BoxProps = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }

  const onCopy = (copy: string): void => {
    Clipboard.setString(copy)
  }

  _.map(Object.keys(tokenInfo), (key) => {
    console.log(`${key}:`)
    console.log(tokenInfo[key])
  })

  return (
    <Box {...props} {...testIdProps('Debug-screen')}>
      <ScrollView>
        {_.map(Object.keys(tokenInfo), (key) => {
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
      </ScrollView>
    </Box>
  )
}

export default DebugScreen
