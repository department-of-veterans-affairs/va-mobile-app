import { ActivityIndicator, ScrollView } from 'react-native'
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

  return (
    <ScrollView {...testIdProps('Letters-loading-screen')}>
      <Box backgroundColor="main" justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop}>
        <ActivityIndicator size="large" color={theme.colors.icon.spinner} />
        <Box mt={theme.dimensions.marginBetween}>
          <TextView textAlign={'center'} variant="MobileBody">
            {t('letters.loading')}
          </TextView>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default LettersLoadingScreen
