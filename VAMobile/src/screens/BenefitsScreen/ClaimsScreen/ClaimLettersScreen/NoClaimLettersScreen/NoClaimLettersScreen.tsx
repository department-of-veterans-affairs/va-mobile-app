import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function NoClaimLettersScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <TextView variant="MobileBodyBold" textAlign={'center'} accessibilityRole="header">
          {t('claimLetters.noClaimLetters')}
        </TextView>
        <TextView variant="MobileBody" textAlign={'center'} py={6}>
          {t('claimLetters.youDontHaveAnyClaimLetters')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NoClaimLettersScreen
