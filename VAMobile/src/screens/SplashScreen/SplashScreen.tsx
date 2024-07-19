import React from 'react'
import { StatusBar, ViewStyle } from 'react-native'

import { Box, VALogo, VAScrollView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useOrientation, useTheme } from 'utils/hooks'

export type SplashScreenProps = Record<string, unknown>
function SplashScreen({}: SplashScreenProps) {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.loginScreen,
  }
  const isPortrait = useOrientation()

  return (
    <VAScrollView {...testIdProps('Splash-page')} contentContainerStyle={splashStyles} removeInsets={true}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <Box
        justifyContent="center"
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        alignItems={'center'}>
        <VALogo />
      </Box>
    </VAScrollView>
  )
}

export default SplashScreen
