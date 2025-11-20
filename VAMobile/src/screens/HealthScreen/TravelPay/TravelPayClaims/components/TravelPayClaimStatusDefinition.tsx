import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayClaimStatuses } from 'constants/travelPay'
import { useTheme } from 'utils/hooks'
import { toPascalCase } from 'utils/travelPay'

type TravelPayClaimStatusDefinitionProps = {
  /** The current claim status */
  claimStatus: string
}

/**
 * Component that displays the status definition for a travel pay claim
 * Uses the definitions from TravelPayClaimStatuses constants
 */
function TravelPayClaimStatusDefinition({ claimStatus }: TravelPayClaimStatusDefinitionProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Handle null, undefined, or empty status
  if (!claimStatus || typeof claimStatus !== 'string') {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody">{t('travelPay.claimDetails.status.genericHelp')}</TextView>
      </Box>
    )
  }

  const statusKey = toPascalCase(claimStatus.trim()) as keyof typeof TravelPayClaimStatuses
  const statusInfo = TravelPayClaimStatuses[statusKey]

  // If no status definition found, show generic help text
  if (!statusInfo || !statusInfo.definitionKey) {
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody">{t('travelPay.claimDetails.status.genericHelp')}</TextView>
      </Box>
    )
  }

  return (
    <Box>
      <TextView variant="MobileBody" testID="travelPayClaimStatusDefinitionTestID">
        {t(statusInfo.definitionKey)}
      </TextView>
    </Box>
  )
}

export default TravelPayClaimStatusDefinition
