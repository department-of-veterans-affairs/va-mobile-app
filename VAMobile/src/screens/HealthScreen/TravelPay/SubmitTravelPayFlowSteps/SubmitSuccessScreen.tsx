import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

function SubmitSuccessScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <Box
      mb={theme.dimensions.contentMarginBottom}
      mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {t('travelPay.success.title')}
      </TextView>
      <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.success.text', { claimId: '12345' })}
      </TextView>
      <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.success.nextTitle')}
      </TextView>
      <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.success.nextText')}
      </TextView>
      <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.success.nextText2')}
      </TextView>
    </Box>
  )
}

export default SubmitSuccessScreen
