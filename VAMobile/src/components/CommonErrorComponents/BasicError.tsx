import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type BasicErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
  /** message to display **/
  messageText: string
  /** text to appear in bold  **/
  headerText?: string
  /** accessibility hint for the header **/
  headerA11yLabel?: string
  /** hint for the try again button **/
  buttonA11yHint?: string
}

const BasicError: FC<BasicErrorProps> = ({ onTryAgain, messageText, buttonA11yHint, headerText, headerA11yLabel }) => {
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
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        {headerText && (
          <TextView {...testIdProps(headerA11yLabel ? headerA11yLabel : headerText)} variant="MobileBodyBold" accessibilityRole="header" textAlign="center">
            {headerText}
          </TextView>
        )}
        <TextView textAlign="center">{messageText}</TextView>
        <Box mt={theme.dimensions.standardMarginBetween} accessibilityRole="button">
          <VAButton onPress={onTryAgain} label={t('tryAgain')} buttonType={ButtonTypesConstants.buttonPrimary} a11yHint={buttonA11yHint} testID={t('tryAgain')} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BasicError
