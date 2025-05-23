import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

function BurdenStatement() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('travelPay.privacyStatement.sheetTitle')}
      rightButtonText={t('close')}
      rightButtonTestID="closeButtonID"
      testID="burdenStatementScreenID"
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <TextView
            testID="burdenStatementTitleID"
            variant="MobileBodyBold"
            accessibilityLabel={a11yLabelVA(t('privacyStatement.header'))}>
            {t('travelPay.privacyStatement.header')}
          </TextView>
          <TextView
            testID="burdenStatementTextID"
            mt={theme.dimensions.tinyMarginBetween}
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('travelPay.privacyStatement.description'))}>
            {t('travelPay.privacyStatement.description')}
          </TextView>
          <TextView
            testID="burdenStatementActTitleID"
            mt={theme.dimensions.standardMarginBetween}
            variant="MobileBodyBold"
            accessibilityLabel={a11yLabelVA(t('travelPay.privacyAct.header'))}>
            {t('travelPay.privacyAct.header')}
          </TextView>
          <TextView
            testID="burdenStatementActTextID"
            mt={theme.dimensions.tinyMarginBetween}
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('travelPay.privacyAct.description'))}>
            {t('travelPay.privacyAct.description')}
          </TextView>
        </Box>
      }
    />
  )
}

export default BurdenStatement
