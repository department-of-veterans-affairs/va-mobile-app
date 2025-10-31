import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { getCommonSubtaskProps } from 'utils/travelPay'

function MileageScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  useSubtaskProps(getCommonSubtaskProps(t, navigateTo, 'InterstitialScreen', 'VehicleScreen'))

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="mileageQuestionID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.mileageQuestion')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default MileageScreen
