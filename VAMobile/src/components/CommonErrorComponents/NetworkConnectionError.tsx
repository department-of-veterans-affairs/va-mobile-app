import { ScrollView, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type NetworkConnectionErrorProps = {
  /** function called when the Try again button is pressed */
  onTryAgain: () => void
}

const NetworkConnectionError: FC<NetworkConnectionErrorProps> = ({ onTryAgain }) => {
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
        <TextView {...testIdProps(t('errors.networkConnection.headerA11yHint'))} variant="MobileBodyBold" accessibilityRole="header" textAlign="center">
          {t('errors.networkConnection.header')}
        </TextView>
        <TextView textAlign="center">{t('errors.networkConnection.body')}</TextView>
        <Box mt={theme.dimensions.marginBetween} accessibilityRole="button">
          <VAButton
            onPress={onTryAgain}
            label={t('tryAgain')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('errors.networkConnection.a11yHint')}
            testID={t('tryAgain')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default NetworkConnectionError
