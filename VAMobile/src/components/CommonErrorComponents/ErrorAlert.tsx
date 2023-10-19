import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

export type ErrorAlertProps = {
  /** Function called when the primary button is pressed */
  onTryAgain: () => void
  /** Title for the error AlertBox */
  title?: string
  /** Text to display in the error AlertBox  */
  text: string
}

const ErrorAlert: FC<ErrorAlertProps> = ({ onTryAgain, title, text }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
  }

  const containerStyles = {
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox border="error" title={title || t('errorAlert.title')} text={text}>
          <Box mt={theme.dimensions.standardMarginBetween} accessibilityRole="button">
            <VAButton onPress={onTryAgain} label={t('refresh')} buttonType={ButtonTypesConstants.buttonPrimary} testID={t('refresh')} />
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default ErrorAlert
