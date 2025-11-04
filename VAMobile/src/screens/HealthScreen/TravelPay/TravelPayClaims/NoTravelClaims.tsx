import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView } from 'components'
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
        {t('travelPay.statusList.noClaims.youDontHave')}
      </TextView>
      <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} accessible={true}>
        {t('travelPay.statusList.noClaims.youCanFile')}
      </TextView>
      <LinkWithAnalytics
        type="custom"
        onPress={() => {}} // Go to past appointments list
        text={t('travelPay.statusList.noClaims.startNewClaim')}
        testID={`goToVAGovTravelClaimStatus`}
      />
    </Box>
  )
}

export default NoTravelClaims
