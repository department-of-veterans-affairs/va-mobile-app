import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'

import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoMilitaryInformationAccess: FC = () => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
        {t('militaryInformation.noMilitaryInfoAccess.title')}
      </TextView>
      <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} {...testIdProps(t('militaryInformation.noMilitaryInfoAccess.body.a11yLabel'))}>
        {t('militaryInformation.noMilitaryInfoAccess.body')}
      </TextView>
    </Box>
  )
}

export default NoMilitaryInformationAccess
