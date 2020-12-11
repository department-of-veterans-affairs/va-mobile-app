import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoClaimsAndAppeals: FC = () => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} {...testIdProps('No-appointments-screen')} alignItems="center">
      <TextView variant="MobileBodyBold" selectable={true} textAlign="center" accessibilityRole="header">
        {t('noClaims.youDontHaveAny')}
      </TextView>
      <Box>
        <TextView variant="MobileBody" selectable={true} textAlign="center" my={theme.dimensions.marginBetween}>
          {t('noClaims.appOnlyShowsCompletedClaims')}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoClaimsAndAppeals
