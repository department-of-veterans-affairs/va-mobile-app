import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { FileOnlineComponent, TravelPayHelp } from './components'

type ErrorScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ErrorScreen'>

function ErrorScreen({}: ErrorScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.error.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.error.text')}
        </TextView>
        {/* <TextView>{route.params.error}</TextView> */}
        <FileOnlineComponent />
        <TravelPayHelp />
      </Box>
    </VAScrollView>
  )
}

export default ErrorScreen
