import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeFirstTimeLogin, setBiometricsPreference } from 'store/actions'
import { getSupportedBiometricText } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = {}

const BiometricsPreferenceScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)

  const { supportedBiometric } = useSelector<StoreState, AuthState>((s) => s.auth)
  const biometricsText = getSupportedBiometricText(supportedBiometric || '', t)

  const onSkip = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  const onUseBiometrics = (): void => {
    dispatch(setBiometricsPreference(true))
    dispatch(completeFirstTimeLogin())
  }

  return (
    <ScrollView {...testIdProps('Biometrics-preference-screen')}>
      <Box mt={theme.dimensions.biometricsPreferenceMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('biometricsPreference.doYouWantToAllow', { biometricsText })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween} mb={theme.dimensions.textAndButtonLargeMargin}>
          {t('biometricsPreference.youCanAlwaysChangeThis')}
        </TextView>
        <VAButton
          onPress={onUseBiometrics}
          label={t('biometricsPreference.useBiometric', { biometricsText })}
          testID={t('biometricsPreference.useBiometric', { biometricsText })}
          textColor="primaryContrast"
          backgroundColor="button"
          a11yHint={t('biometricsPreference.useBiometricA11yHint')}
        />
        <Box mt={theme.dimensions.marginBetween}>
          <VAButton
            onPress={onSkip}
            label={t('biometricsPreference.skip')}
            testID={t('biometricsPreference.skip')}
            textColor="altButton"
            backgroundColor="textBox"
            borderColor="secondary"
            a11yHint={t('biometricsPreference.skipA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default BiometricsPreferenceScreen
