import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

const NoRefills: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
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
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} accessibilityLabel={a11yLabelVA(t('prescriptions.noRefill.text'))}>
          {t('prescriptions.noRefill.text')}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NoRefills
