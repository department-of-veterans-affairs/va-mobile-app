import React from 'react'

import { Box, TextView } from 'components'
import { useOrientation, useTheme } from 'utils/hooks'

function NotEligibleTypeScreen() {
  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <Box
      mb={theme.dimensions.contentMarginBottom}
      mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
      <TextView>We can't submit this type of claim</TextView>
    </Box>
  )
}

export default NotEligibleTypeScreen
