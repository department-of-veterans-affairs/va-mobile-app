import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks/useTheme'

const NoRefills: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
          {t('prescriptions.noRefill.header')}
        </TextView>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} accessibilityLabel={t('prescriptions.noRefill.text.a11yLabel')}>
          {t('prescriptions.noRefill.text')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NoRefills
