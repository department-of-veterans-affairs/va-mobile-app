import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { AuthState, setBiometricsPreference, setDisplayBiometricsPreferenceScreen } from 'store/slices'
import { getSupportedBiometricText, getSupportedBiometricTranslationTag, getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>

function BiometricsPreferenceScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { supportedBiometric } = useSelector<RootState, AuthState>((state) => state.auth)
  const biometricsText = getSupportedBiometricText(supportedBiometric || '', t)
  const bodyText = getTranslation(
    `biometricsPreference.bodyText.${getSupportedBiometricTranslationTag(supportedBiometric || '')}`,
    t,
  )

  const onSkip = (): void => {
    dispatch(setDisplayBiometricsPreferenceScreen(false))
  }

  const onUseBiometrics = (): void => {
    dispatch(setBiometricsPreference(true))
    dispatch(setDisplayBiometricsPreferenceScreen(false))
  }

  return (
    <VAScrollView>
      <Box mt={60} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="BitterHeading" accessibilityRole="header">
          {t('biometricsPreference.doYouWantToAllow', { biometricsText })}
        </TextView>
        <TextView
          variant="MobileBody"
          mt={theme.dimensions.textAndButtonLargeMargin}
          mb={theme.dimensions.standardMarginBetween}>
          {bodyText}
        </TextView>
        <TextView paragraphSpacing={true} variant="MobileBody">
          {t('biometricsPreference.youCanAlwaysChangeThis')}
        </TextView>
        <Button
          onPress={onUseBiometrics}
          label={t('biometricsPreference.useBiometric', { biometricsText })}
          testID={t('biometricsPreference.useBiometric', { biometricsText })}
          a11yHint={t('biometricsPreference.useBiometricA11yHint')}
        />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button
            onPress={onSkip}
            label={t('biometricsPreference.skip')}
            testID={t('biometricsPreference.skip')}
            buttonType={ButtonVariants.Secondary}
            a11yHint={t('biometricsPreference.skipA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BiometricsPreferenceScreen
