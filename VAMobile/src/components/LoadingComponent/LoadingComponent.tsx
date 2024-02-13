import React, { FC } from 'react'
import { ViewStyle } from 'react-native'

import LottieView from 'lottie-react-native'

import { Box, TextView, VAScrollView } from 'components'
import colors from 'styles/themes/VAColors'
import { useTheme } from 'utils/hooks'

export type LoadingComponentProps = {
  /** Text to be shown under the spinner */
  text?: string
  /** AccessibilityLabel for the text */
  a11yLabel?: string
  /** Param to show the spinner icon only and not the full page with text */
  justTheSpinnerIcon?: boolean
  /** Param to show the spinner with text, but no box */
  inlineSpinner?: boolean
  /** spinner height*/
  spinnerHeight?: number
  /** spinner width */
  spinnerWidth?: number
  /** Hex string to set the spinner color*/
  spinnerColor?: string
}

/**A common component to show a loading spinner */
const LoadingComponent: FC<LoadingComponentProps> = ({
  text,
  a11yLabel,
  justTheSpinnerIcon,
  spinnerHeight,
  spinnerWidth,
  spinnerColor,
  inlineSpinner,
}) => {
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
    return (
      <LottieView
        source={require('./va-spinner.json')}
        autoPlay
        loop
        style={spinnerStyle}
        speed={0.8}
        colorFilters={[
          {
            keypath: 'Shape Layer 9',
            color: spinnerColor || colors.primary,
          },
          {
            keypath: 'Shape Layer 11',
            color: spinnerColor || colors.primary,
          },
        ]}
      />
    )
  }

  return (
    <>
      {justTheSpinnerIcon ? (
        <Box alignItems="center" justifyContent="center">
          {getSpinner()}
        </Box>
      ) : inlineSpinner ? (
        <Box
          justifyContent="center"
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.contentMarginTop}
          mb={theme.dimensions.contentMarginBottom}
          alignItems={'center'}>
          {getSpinner()}
          <Box mt={theme.dimensions.condensedMarginBetween}>
            <TextView textAlign={'center'} variant="MobileBody" accessibilityLabel={a11yLabel}>
              {text}
            </TextView>
          </Box>
        </Box>
      ) : (
        <VAScrollView contentContainerStyle={scrollStyles}>
          <Box
            justifyContent="center"
            mx={theme.dimensions.gutter}
            mt={theme.dimensions.contentMarginTop}
            mb={theme.dimensions.contentMarginBottom}
            alignItems={'center'}>
            {getSpinner()}
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <TextView textAlign={'center'} variant="MobileBody" accessibilityLabel={a11yLabel}>
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
