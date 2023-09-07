import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { ClaimType, ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

type NoClaimsAndAppealsProps = {
  claimType: ClaimType
}

const NoClaimsAndAppeals: FC<NoClaimsAndAppealsProps> = ({ claimType }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimsServiceError, appealsServiceError } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  let header = t('noClaims.youDontHaveAnyClaimsOrAppeals')
  let text = t('noClaims.appOnlyShowsCompletedClaimsAndAppeals')

  if (claimsServiceError) {
    header = t('noClaims.youDontHaveAnyAppeals')
    text = t('noClaims.appOnlyShowsCompletedAppeals')
  } else if (appealsServiceError) {
    header = t('noClaims.youDontHaveAnyClaims')
    text = t('noClaims.appOnlyShowsCompletedClaims')
  } else if (claimType === ClaimTypeConstants.CLOSED) {
    header = t('noClaims.youDontHaveAnyClosedClaimsOrAppeals')
    text = ''
  }

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} {...testIdProps('Claims: No-claims-page')} alignItems="center">
      <Box {...testIdProps(header)} accessible={true}>
        <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
          {header}
        </TextView>
      </Box>
      <Box {...testIdProps(text)} accessible={true}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween}>
          {text}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoClaimsAndAppeals
