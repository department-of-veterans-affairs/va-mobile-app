import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type VehicleScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'VehicleScreen'>

function VehicleScreen({}: VehicleScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="vehicleQuestionID" variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.vehicleQuestion')}
        </TextView>
        <TextView testID="vehicleQualifierID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.vehicleQualifier')}
        </TextView>
        <TextView testID="referToPortalID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.referToPortal')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default VehicleScreen
