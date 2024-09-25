import React from 'react'

import { Box, TextView } from 'components'
import { useOrientation, useTheme } from 'utils/hooks'

function MileageScreen() {
  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <Box
      mb={theme.dimensions.contentMarginBottom}
      mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
      <TextView>Mileage screen</TextView>
    </Box>
  )
}

export default MileageScreen
