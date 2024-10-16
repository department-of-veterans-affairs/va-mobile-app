import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

import { FileOnlineComponent, TravelPayHelp } from './components'

function NotEligibleTypeScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.cannotSubmitThisType')}
        </TextView>
        <FileOnlineComponent />
        <TravelPayHelp />
      </Box>
    </VAScrollView>
  )
}

export default NotEligibleTypeScreen
