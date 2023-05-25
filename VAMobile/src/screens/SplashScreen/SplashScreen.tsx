import { Box, VAIcon, VAScrollView } from 'components'
import { VATheme } from 'styles/theme'
import { ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'styled-components'
import React, { FC } from 'react'

export type SplashScreenProps = Record<string, unknown>
const SplashScreen: FC<SplashScreenProps> = () => {
  const theme = useTheme() as VATheme
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }

  return (
    <VAScrollView {...testIdProps('Splash-page')} contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
      </Box>
    </VAScrollView>
  )
}

export default SplashScreen
