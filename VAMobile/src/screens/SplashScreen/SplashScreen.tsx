import React from 'react'
import { Image, ViewStyle } from 'react-native'

import { Box, VAScrollView } from 'components'
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
      <Box
        justifyContent="center"
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        alignItems={'center'}>
        <Image
          style={{ width: 254, height: 57 }}
          source={
            theme.mode === 'dark'
              ? require('../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnDark.png')
              : require('../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnLight.png')
          }
        />
      </Box>
    </VAScrollView>
  )
}

export default SplashScreen
