import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, TextViewProps, VAIcon, VAScrollView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type GenericOnboardingProps = {
  header: string
  headerA11yLabel?: string
  text: string
  testID: string
  displayLogo?: boolean
}

const GenericOnboarding: FC<GenericOnboardingProps> = ({ header, text, testID, displayLogo, headerA11yLabel }) => {
  const theme = useTheme()

  const headerProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
    accessibilityRole: 'header',
    mt: displayLogo ? theme.dimensions.standardMarginBetween : 0,
  }

  const containerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.splashScreen,
    justifyContent: 'center',
  }

  return (
    <VAScrollView {...testIdProps(testID)} contentContainerStyle={containerStyle}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {displayLogo && (
          <Box my={theme.dimensions.standardMarginBetween}>
            <VAIcon name="Logo" />
          </Box>
        )}
        <TextView {...headerProps} {...testIdProps(headerA11yLabel || header)}>
          {header}
        </TextView>
        <TextView variant="MobileBody" color="primaryContrast" mt={theme.dimensions.standardMarginBetween}>
          {text}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default GenericOnboarding
