import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function BurdenStatement() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('travelPay.privacyStatement.sheetTitle')}
      rightButtonText={t('close')}
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <TextView variant="MobileBodyBold">{t('travelPay.privacyStatement.header')}</TextView>
          <TextView mt={theme.dimensions.tinyMarginBetween} variant="MobileBody">
            {t('travelPay.privacyStatement.description')}
          </TextView>
          <TextView mt={theme.dimensions.standardMarginBetween} variant="MobileBodyBold">
            {t('travelPay.privacyAct.header')}
          </TextView>
          <TextView mt={theme.dimensions.tinyMarginBetween} variant="MobileBody">
            {t('travelPay.privacyAct.description')}
          </TextView>
        </Box>
      }
    />
  )
}

export default BurdenStatement
