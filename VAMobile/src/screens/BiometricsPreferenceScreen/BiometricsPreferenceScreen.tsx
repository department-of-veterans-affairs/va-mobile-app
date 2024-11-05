import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthSettings, useBiometricsSettings } from 'api/auth'
import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { setBiometricsPreference, setDisplayBiometricsPreferenceScreen } from 'utils/auth'
import {
  getSupportedBiometricA11yLabel,
  getSupportedBiometricText,
  getSupportedBiometricTranslationTag,
  getTranslation,
} from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>

function BiometricsPreferenceScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { data: userBiometricSettings } = useBiometricsSettings()
  const supportedBiometric = userBiometricSettings?.supportedBiometric
  const biometricsText = getSupportedBiometricText(supportedBiometric || '', t)
  const biometricsA11yLabel = getSupportedBiometricA11yLabel(supportedBiometric || '', t)
  const bodyText = getTranslation(
    `biometricsPreference.bodyText.${getSupportedBiometricTranslationTag(supportedBiometric || '')}`,
    t,
  )

  const onSkip = (): void => {
    setDisplayBiometricsPreferenceScreen(false)
  }

  const onUseBiometrics = (): void => {
    setBiometricsPreference(true)
    setDisplayBiometricsPreferenceScreen(false)
  }

  return (
    <VAScrollView>
      <Box mt={60} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView
          variant="BitterHeading"
          accessibilityRole="header"
          accessibilityLabel={t('biometricsPreference.doYouWantToAllow.a11yLabel', { biometricsA11yLabel })}>
          {t('biometricsPreference.doYouWantToAllow', { biometricsText })}
        </TextView>
        <TextView paragraphSpacing={true} variant="MobileBody" mt={theme.dimensions.textAndButtonLargeMargin}>
          {bodyText}
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
