import { ViewStyle } from 'react-native'
import LottieView from 'lottie-react-native'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { useTheme } from 'utils/hooks'

export type LoadingComponentProps = {
  /**Text to be shown under the spinner */
  text?: string
}

/**A common component to show a loading spinner */
const LoadingComponent: FC<LoadingComponentProps> = ({ text }) => {
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  const spinnerStyle: ViewStyle = {
    height: 53,
    width: 53,
    alignContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <LottieView source={require('./va-spinner.json')} autoPlay loop style={spinnerStyle} speed={0.8} />
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextView textAlign={'center'} variant="MobileBody">
            {text}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default LoadingComponent
