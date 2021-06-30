import { Box, VAIcon, VAScrollView } from 'components'
import { ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { utils } from '@react-native-firebase/app'
import React, { FC, useEffect } from 'react'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
import getEnv from 'utils/env'

const { ENVIRONMENT } = getEnv()
export type SplashScreenProps = Record<string, unknown>
const SplashScreen: FC<SplashScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }

  useEffect(() => {
    async function checkTestLab() {
      if (utils().isRunningInTestLab || ENVIRONMENT === 'staging') {
        await crashlytics().setCrashlyticsCollectionEnabled(false)
        await analytics().setAnalyticsCollectionEnabled(false)
      }
    }
    checkTestLab()
  })

  return (
    <VAScrollView {...testIdProps('Splash-page')} contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
      </Box>
    </VAScrollView>
  )
}

export default SplashScreen
