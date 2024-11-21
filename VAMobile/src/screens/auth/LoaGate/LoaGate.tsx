import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FullScreenSubtask, TextView, TextViewProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { useStartAuth } from 'utils/hooks/auth'

type LoaGateProps = Record<string, unknown>

function LoaGate({}: LoaGateProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const startAuth = useStartAuth()
  const navigation = useNavigation()

  const bodyTextProps: TextViewProps = {
    variant: 'MobileBody',
  }

  const titleTextProps: TextViewProps = {
    variant: 'MobileBodyBold',
  }

  return (
    <FullScreenSubtask
      leftButtonText={t('close')}
      title={t('loaGate.signInWithVerifiedAccount')}
      onLeftButtonPress={navigation.goBack}
      showCrisisLineButton={true}>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <TextView mb={theme.dimensions.standardMarginBetween} {...bodyTextProps}>
          {t('loaGate.p1')}
        </TextView>
        <TextView mb={theme.dimensions.standardMarginBetween} {...bodyTextProps}>
          <TextView {...titleTextProps}>{t('loaGate.p2.noVerifiedAccount')}</TextView>
          {t('loaGate.p2')}
        </TextView>
        <TextView {...bodyTextProps}>
          <TextView {...titleTextProps}>{t('loaGate.p3.notSureOfAccount')}</TextView>
          {t('loaGate.p3')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <Button onPress={startAuth} label={t('continueToSignin')} testID={t('continueToSignin')} />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default LoaGate
