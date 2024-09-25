import React from 'react'

import { Box, TextView } from 'components'
import { useOrientation, useTheme } from 'utils/hooks'

function AddressScreen() {
  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <Box
      mb={theme.dimensions.contentMarginBottom}
      mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
      <TextView>Address screen</TextView>
    </Box>
  )
}

export default AddressScreen
