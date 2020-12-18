import { Box, TextView } from 'components'
import React, { FC } from 'react'

export type SplashScreenProps = {}
const SplashScreen: FC<SplashScreenProps> = () => {
  return (
    <Box>
      <TextView>Splash Screen</TextView>
    </Box>
  )
}

export default SplashScreen
