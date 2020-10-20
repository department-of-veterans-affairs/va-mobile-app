import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
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

  _.map(Object.keys(tokenInfo), (key) => {
    console.log(`${key}:`)
    console.log(tokenInfo[key])
  })

  return (
    <Box {...props} {...testIdProps('Debug-screen')}>
      <ScrollView>
        {_.map(Object.keys(tokenInfo), (key) => {
          return (
            <TextArea key={key}>
              <TextView variant="MobileBodyBold">{key}</TextView>
              <TextView>{tokenInfo[key]}</TextView>
            </TextArea>
          )
        })}
      </ScrollView>
    </Box>
  )
}

export default DebugScreen
