import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type BasicErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
  /** message to display */
  messageText: string
  /** text to appear in bold  */
  headerText?: string
  /** accessibility hint for the header */
  headerA11yLabel?: string
  /** hint for the try again button */
  buttonA11yHint?: string
  /** label for button and accessibility title */
  label?: string
}

/**A common component to show an error*/
const BasicError: FC<BasicErrorProps> = ({
  onTryAgain,
  messageText,
  buttonA11yHint,
  headerText,
  headerA11yLabel,
  label,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const buttonText: string = label || t('tryAgain')

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
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
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView
            accessibilityLabel={headerA11yLabel}
            variant="MobileBodyBold"
            accessibilityRole="header"
            textAlign="center">
            {headerText}
          </TextView>
        )}
        <TextView paragraphSpacing={true} textAlign="center">
          {messageText}
        </TextView>
        <Box accessibilityRole="button">
          <Button onPress={onTryAgain} label={buttonText} a11yHint={buttonA11yHint} testID={buttonText} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BasicError
