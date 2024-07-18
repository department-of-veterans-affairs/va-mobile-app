import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AlertWithHaptics, Box, VAScrollView } from 'components'
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
        <AlertWithHaptics
          variant="error"
          header={title || t('errorAlert.title')}
          description={text}
          primaryButton={{ label: t('refresh'), onPress: onTryAgain, testID: t('refresh') }}
        />
      </Box>
    </VAScrollView>
  )
}

export default ErrorAlert
