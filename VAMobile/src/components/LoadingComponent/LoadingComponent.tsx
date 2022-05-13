import { ViewStyle } from 'react-native'
import LottieView from 'lottie-react-native'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { useTheme } from 'utils/hooks'

export type LoadingComponentProps = {
  /**Text to be shown under the spinner */
  text?: string
  /** show only the spinner without the text */
  justSpinner?: boolean
  /** spinner height*/
  spinnerHeight?: number
  /** spinner width */
  spinnerWidth?: number
}

/**A common component to show a loading spinner */
const LoadingComponent: FC<LoadingComponentProps> = ({ text, justSpinner, spinnerHeight, spinnerWidth }) => {
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  const spinnerStyle: ViewStyle = {
    height: spinnerHeight || 50,
    width: spinnerWidth || 50,
    alignContent: 'center',
  }

  const getSpinner = () => {
    return <LottieView source={require('./va-spinner.json')} autoPlay loop style={spinnerStyle} speed={0.8} />
  }

  return (
    <>
      {justSpinner ? (
        <Box alignItems="center" justifyContent="center">
          {getSpinner()}
        </Box>
      ) : (
        <VAScrollView contentContainerStyle={scrollStyles}>
          <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
            {getSpinner()}
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <TextView textAlign={'center'} variant="MobileBody">
                {text}
              </TextView>
            </Box>
          </Box>
        </VAScrollView>
      )}
    </>
  )
}

export default LoadingComponent
