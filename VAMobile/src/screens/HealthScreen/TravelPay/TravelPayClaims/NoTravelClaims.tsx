import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function NoTravelClaims() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box
      flex={1}
      justifyContent="center"
      mx={theme.dimensions.gutter}
      alignItems="center"
      mt={theme.dimensions.textAndButtonLargeMargin}>
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header" accessible={true}>
        {t('travelPay.statusList.youDontHave')}
      </TextView>
      <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} accessible={true}>
        {t('travelPay.statusList.youDontHaveForDates')}
      </TextView>
    </Box>
  )
}

export default NoTravelClaims
