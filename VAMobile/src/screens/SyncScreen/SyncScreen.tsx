import { Box, TextView } from 'components'
import React, { FC } from 'react'

export type SyncScreenProps = {}
const SyncScreen: FC<SyncScreenProps> = () => {
  return (
    <Box>
      <TextView>Sync Screen</TextView>
    </Box>
  )
}

export default SyncScreen
