import { ActivityIndicator, ViewStyle } from 'react-native'
import { Box, TextView, VAScrollView } from 'components'
import { useTheme } from 'utils/hooks'
import React, { FC } from 'react'

export type LoadingComponentProps = {
  text?: string
}
const LoadingComponent: FC<LoadingComponentProps> = ({ text }) => {
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <ActivityIndicator size="large" color={theme.colors.icon.spinner} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextView textAlign={'center'} variant="MobileBody">
            {text}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default LoadingComponent
