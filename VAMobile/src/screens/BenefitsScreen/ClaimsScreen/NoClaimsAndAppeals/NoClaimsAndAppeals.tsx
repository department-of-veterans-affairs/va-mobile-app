import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'

import { Box, TextView } from 'components'
import { ClaimType, ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetDataMetaError } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useTheme } from 'utils/hooks'

type NoClaimsAndAppealsProps = {
  claimType: ClaimType
}

function NoClaimsAndAppeals({ claimType }: NoClaimsAndAppealsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { data: claimsAndAppeals } = useClaimsAndAppeals(claimType, 1)
  const claimsServiceErrors = claimsAndAppeals?.meta.errors as Array<ClaimsAndAppealsGetDataMetaError>
  const [header, setHeader] = useState(t('noClaims.youDontHaveAnyClaimsOrAppeals'))
  const [text, setText] = useState(t('noClaims.appOnlyShowsCompletedClaimsAndAppeals'))

  useEffect(() => {
    const claimsError = !!claimsServiceErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsError = !!claimsServiceErrors?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
    if (claimsError && !appealsError) {
      setHeader(t('noClaims.youDontHaveAnyAppeals'))
      setText(t('noClaims.appOnlyShowsCompletedAppeals'))
    } else if (appealsError && !claimsError) {
      setHeader(t('noClaims.youDontHaveAnyClaims'))
      setText(t('noClaims.appOnlyShowsCompletedClaims'))
    } else if (claimType === ClaimTypeConstants.CLOSED) {
      setHeader(t('noClaims.youDontHaveAnyClosedClaimsOrAppeals'))
      setText('')
    }
  }, [claimType, setText, setHeader, claimsServiceErrors, t])

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
      <Box accessible={true}>
        <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
          {header}
        </TextView>
      </Box>
      <Box accessible={true}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween}>
          {text}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoClaimsAndAppeals
