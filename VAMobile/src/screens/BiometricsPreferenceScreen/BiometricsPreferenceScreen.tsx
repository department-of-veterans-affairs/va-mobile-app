import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getSupportedBiometricA11yLabel, getSupportedBiometricText, getSupportedBiometricTranslationTag } from 'utils/formattingUtils'

import { setBiometricsPreference, setDisplayBiometricsPreferenceScreen } from 'store/slices/authSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppSelector, useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>

const BiometricsPreferenceScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)

  const { supportedBiometric } = useAppSelector((state) => state.auth)
  const biometricsText = getSupportedBiometricText(supportedBiometric || '', t)
  const biometricsA11yLabel = getSupportedBiometricA11yLabel(supportedBiometric || '', t)
  const bodyText = t(`biometricsPreference.bodyText.${getSupportedBiometricTranslationTag(supportedBiometric || '')}`)

  const onSkip = (): void => {
    dispatch(setDisplayBiometricsPreferenceScreen(false))
  }

  const onUseBiometrics = (): void => {
    dispatch(setBiometricsPreference(true))
    dispatch(setDisplayBiometricsPreferenceScreen(false))
  }

  return (
    <VAScrollView {...testIdProps('Biometrics-preference-page')}>
      <Box mt={theme.dimensions.biometricsPreferenceMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="BitterBoldHeading" accessibilityRole="header" {...testIdProps(t('biometricsPreference.doYouWantToAllow.a11yLabel', { biometricsA11yLabel }))}>
          {t('biometricsPreference.doYouWantToAllow', { biometricsText })}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.textAndButtonLargeMargin}>
          {bodyText}
          {t('biometricsPreference.youCanAlwaysChangeThis')}
        </TextView>
        <VAButton
          onPress={onUseBiometrics}
          label={t('biometricsPreference.useBiometric', { biometricsText })}
          testID={t('biometricsPreference.useBiometric', { biometricsText })}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('biometricsPreference.useBiometricA11yHint')}
        />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            onPress={onSkip}
            label={t('biometricsPreference.skip')}
            testID={t('biometricsPreference.skip')}
            buttonType={ButtonTypesConstants.buttonSecondary}
            a11yHint={t('biometricsPreference.skipA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BiometricsPreferenceScreen
