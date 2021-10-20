import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { StyleProp, ViewStyle } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoDisabilityRatings: FC = () => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const bodyText = t('disabilityRating.noDisabilityRatings.body')

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

  return (
    <VAScrollView contentContainerStyle={mainViewStyle}>
      <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
          {t('disabilityRating.noDisabilityRatings.title')}
        </TextView>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} {...testIdProps(bodyText)}>
          {bodyText}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default NoDisabilityRatings
