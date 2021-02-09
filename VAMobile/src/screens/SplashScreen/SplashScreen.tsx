import { Box, VAIcon } from 'components'
import { ScrollView, ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import React, { FC } from 'react'

export type SplashScreenProps = {}
const SplashScreen: FC<SplashScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  return (
    <ScrollView {...testIdProps('Splash-page')} contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
      </Box>
    </ScrollView>
  )
}

export default SplashScreen
