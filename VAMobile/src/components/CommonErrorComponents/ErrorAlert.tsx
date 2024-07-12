import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertBox, Box, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

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
            <Button onPress={onTryAgain} label={t('refresh')} testID={t('refresh')} />
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default ErrorAlert
