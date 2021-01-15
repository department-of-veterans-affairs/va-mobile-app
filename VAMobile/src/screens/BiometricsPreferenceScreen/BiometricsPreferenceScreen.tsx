import { Button, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeFirstTimeLogin, setBiometricsPreference } from 'store/actions'
import { getSupportedBiometricText } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = {}
const BiometricsPreferenceScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)

  const { supportedBiometric } = useSelector<StoreState, AuthState>((s) => s.auth)
  const biometricsText = getSupportedBiometricText(supportedBiometric || '', t)

  // TODO: build this screen

  const onSkip = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  const onUseBiometrics = (): void => {
    dispatch(setBiometricsPreference(true))
    dispatch(completeFirstTimeLogin())
  }

  return (
    <ScrollView>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <TextView justifyContent={'center'} ml={10} color="primary" alignItems={'center'} textAlign={'center'}>
          Biometrics screen
        </TextView>
        <Button onPress={onSkip} title={'Skip'} />
        <Button onPress={onUseBiometrics} title={`Use ${biometricsText}`} />
      </Box>
    </ScrollView>
  )
}

export default BiometricsPreferenceScreen
