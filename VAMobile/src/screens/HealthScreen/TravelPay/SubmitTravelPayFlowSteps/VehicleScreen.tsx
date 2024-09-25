import React from 'react'

import { Box, TextView } from 'components'
import { useOrientation, useTheme } from 'utils/hooks'

function VehicleScreen() {
  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <Box
      mb={theme.dimensions.contentMarginBottom}
      mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
      <TextView>Vehicle screen</TextView>
    </Box>
  )
}

export default VehicleScreen
