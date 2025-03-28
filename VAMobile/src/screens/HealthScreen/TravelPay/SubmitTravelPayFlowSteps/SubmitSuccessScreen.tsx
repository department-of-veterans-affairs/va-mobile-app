import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

function SubmitSuccessScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="successTitleID" variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.success.title')}
        </TextView>
        <TextView testID="successTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.text', { claimId: '12345' })}
        </TextView>
        <TextView testID="successNextTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.nextTitle')}
        </TextView>
        <TextView testID="successNextTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.nextText')}
        </TextView>
        <TextView testID="successNextText2ID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.nextText2')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default SubmitSuccessScreen
