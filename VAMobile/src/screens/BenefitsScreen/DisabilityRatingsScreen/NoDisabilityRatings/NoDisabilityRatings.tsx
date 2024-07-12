import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

function NoDisabilityRatings() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const bodyText = t('disabilityRating.noDisabilityRatings.body')

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

  return (
    <VAScrollView contentContainerStyle={mainViewStyle}>
      <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <TextView
          variant="MobileBodyBold"
          textAlign="center"
          accessibilityRole="header"
          accessibilityLabel={a11yLabelVA(t('disabilityRating.noDisabilityRatings.title'))}>
          {t('disabilityRating.noDisabilityRatings.title')}
        </TextView>
        <TextView
          variant="MobileBody"
          textAlign="center"
          my={theme.dimensions.standardMarginBetween}
          {...testIdProps(bodyText)}>
          {bodyText}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NoDisabilityRatings
