import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type MileageScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'MileageScreen'>

function MileageScreen({}: MileageScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.mileageQuestion')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.mileageQualifier')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.referToPortal')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default MileageScreen
