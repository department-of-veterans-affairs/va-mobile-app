import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const HEALTH_TAB_INDEX = 1

function NoTravelClaims() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

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
        onPress={() =>
          navigateTo('HealthTab', { screen: 'Appointments', params: { tab: HEALTH_TAB_INDEX }, initial: false })
        }
        text={t('travelPay.statusList.noClaims.goToPastAppointments')}
        testID={`goToPastAppointmentsLinkID`}
      />
    </Box>
  )
}

export default NoTravelClaims
