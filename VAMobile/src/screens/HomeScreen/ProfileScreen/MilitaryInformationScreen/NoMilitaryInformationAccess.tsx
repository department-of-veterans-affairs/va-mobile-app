import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

function NoMilitaryInformationAccess() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
        {t('militaryInformation.noMilitaryInfoAccess.title')}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant="MobileBody"
        textAlign="center"
        my={theme.dimensions.standardMarginBetween}
        accessibilityLabel={t('militaryInformation.noMilitaryInfoAccess.body.a11yLabel')}
        testID="noMilitaryAccessTestID">
        {t('militaryInformation.noMilitaryInfoAccess.body')}
      </TextView>
    </Box>
  )
}

export default NoMilitaryInformationAccess
