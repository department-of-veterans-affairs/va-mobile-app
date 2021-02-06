import { ScrollView, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export type GenericOnboardingProps = {
  header: string
  text: string
}

const GenericOnboarding: FC<GenericOnboardingProps> = ({ header, text }) => {
  const theme = useTheme()

  const containerStyle: ViewStyle = {
    height: '100%',
    backgroundColor: theme.colors.background.splashScreen,
    justifyContent: 'center',
  }

  return (
    <ScrollView {...testIdProps('')} contentContainerStyle={containerStyle}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" color="primaryContrast" accessibilityRole="header">
          {header}
        </TextView>
        <TextView variant="MobileBody" color="primaryContrast" mt={theme.dimensions.marginBetween}>
          {text}
        </TextView>
      </Box>
    </ScrollView>
  )
}

export default GenericOnboarding
