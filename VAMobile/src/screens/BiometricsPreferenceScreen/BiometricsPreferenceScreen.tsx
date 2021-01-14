import { Button, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { completeFirstTimeLogin } from 'store/actions'
import { useTheme } from 'utils/hooks'

export type SyncScreenProps = {}
const BiometricsPreferenceScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const dispatch = useDispatch()

  // TODO: build this screen

  const onSkip = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  return (
    <ScrollView>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <TextView justifyContent={'center'} ml={10} color="primary" alignItems={'center'} textAlign={'center'}>
          Biometrics screen
        </TextView>
        <Button onPress={onSkip} title={'Skip'} />
      </Box>
    </ScrollView>
  )
}

export default BiometricsPreferenceScreen
