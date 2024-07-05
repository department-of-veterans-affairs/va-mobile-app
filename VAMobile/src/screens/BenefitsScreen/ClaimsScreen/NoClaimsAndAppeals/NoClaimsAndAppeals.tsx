import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsErrorServiceTypesConstants } from 'api/types'
import { Box, TextView } from 'components'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type NoClaimsAndAppealsProps = {
  claimType: ClaimType
}

function NoClaimsAndAppeals({ claimType }: NoClaimsAndAppealsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [claimsServiceErrors, setClaimsServiceErrors] = useState(false)
  const [appealsServiceErrors, setAppealsServiceErrors] = useState(false)
  const { data: claimsAndAppealsListPayload } = useClaimsAndAppeals(claimType)

  useEffect(() => {
    const nonFatalErros = claimsAndAppealsListPayload?.meta.errors
    const claimsError = !!nonFatalErros?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsError = !!nonFatalErros?.find(
      (el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS,
    )
    setClaimsServiceErrors(claimsError)
    setAppealsServiceErrors(appealsError)
  }, [claimsAndAppealsListPayload, setClaimsServiceErrors, setAppealsServiceErrors])

  let header = t('noClaims.youDontHaveAnyClaimsOrAppeals')
  let text = t('noClaims.appOnlyShowsCompletedClaimsAndAppeals')

  if (claimsServiceErrors) {
    header = t('noClaims.youDontHaveAnyAppeals')
    text = t('noClaims.appOnlyShowsCompletedAppeals')
  } else if (appealsServiceErrors) {
    header = t('noClaims.youDontHaveAnyClaims')
    text = t('noClaims.appOnlyShowsCompletedClaims')
  } else if (claimType === ClaimTypeConstants.CLOSED) {
    header = t('noClaims.youDontHaveAnyClosedClaimsOrAppeals')
    text = ''
  }

  return (
    <Box
      flex={1}
      justifyContent="center"
      mx={theme.dimensions.gutter}
      {...testIdProps('Claims: No-claims-page')}
      alignItems="center">
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
