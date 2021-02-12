import { ScrollView, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

export type BasicErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
  /** message to display **/
  messageText: string
  /** hint for the try again button **/
  buttonA11yHint: string
}

const BasicError: FC<BasicErrorProps> = ({ onTryAgain, messageText, buttonA11yHint }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  const containerStyles = {
    flex: 1,
    mx: theme.dimensions.gutter,
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <Box accessibilityRole="header">
          <TextView textAlign="center">{messageText}</TextView>
        </Box>
        <Box mt={theme.dimensions.marginBetween} accessibilityRole="button">
          <VAButton onPress={onTryAgain} label={t('tryAgain')} textColor="primaryContrast" backgroundColor="button" a11yHint={buttonA11yHint} />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default BasicError
