import { Box, VAIcon, VAScrollView } from 'components'
import { ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useOrientation, useTheme } from 'utils/hooks'
import React, { FC } from 'react'

export type SplashScreenProps = Record<string, unknown>
const SplashScreen: FC<SplashScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
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
        <VAIcon name={'Logo'} />
      </Box>
    </VAScrollView>
  )
}

export default SplashScreen
