import React from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, TextView, VAScrollView } from 'components'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { FileOnlineComponent, TravelPayHelp } from './components'

type ErrorScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ErrorScreen'>

function ErrorScreen({ navigation, route }: ErrorScreenProps) {
  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView>Error screen</TextView>
        <TextView>{route.params.error}</TextView>
        <FileOnlineComponent />
        <TravelPayHelp />
      </Box>
    </VAScrollView>
  )
}

export default ErrorScreen
