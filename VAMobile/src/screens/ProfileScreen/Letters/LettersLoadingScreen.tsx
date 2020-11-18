import { ActivityIndicator, ScrollView, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

/**
 * Displays loading screen when downloading/loading a letter
 */
const LettersLoadingScreen: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles} {...testIdProps('Letters-loading-screen')}>
      <ActivityIndicator size="large" color={theme.colors.icon.spinner} />
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.marginBetween}>
        <TextView textAlign={'center'} variant="MobileBody">
          {t('letters.loading')}
        </TextView>
      </Box>
    </ScrollView>
  )
}

export default LettersLoadingScreen
