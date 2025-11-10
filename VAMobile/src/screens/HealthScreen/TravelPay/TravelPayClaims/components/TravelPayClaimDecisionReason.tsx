import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayClaimStatuses } from 'constants/travelPay'
import { useTheme } from 'utils/hooks'

type TravelPayClaimDecisionReasonProps = {
  /** The current claim status */
  claimStatus: string
  /** The decision letter reason details */
  decisionLetterReason: string
}

/**
 * Component that displays the reason for claim denial or partial payment
 * Following the same pattern as the web implementation
 */
function TravelPayClaimDecisionReason({ claimStatus, decisionLetterReason }: TravelPayClaimDecisionReasonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Determine the title based on claim status
  const getReasonTitle = (): string => {
    if (claimStatus === TravelPayClaimStatuses.Denied.name) {
      return t('travelPay.claimDetails.decisionReason.deniedHeader')
    }
    return t('travelPay.claimDetails.decisionReason.partialPaymentHeader')
  }

  return (
    <Box mt={theme.dimensions.condensedMarginBetween}>
      <TextView variant="MobileBodyBold" accessibilityRole="header" testID="travelPayClaimDecisionReasonTitleTestID">
        {getReasonTitle()}
      </TextView>
      <TextView
        variant="MobileBody"
        testID="travelPayClaimDecisionReasonDescriptionTestID"
        mt={theme.dimensions.condensedMarginBetween}
        mb={theme.dimensions.standardMarginBetween}>
        {decisionLetterReason}
      </TextView>
    </Box>
  )
}

export default TravelPayClaimDecisionReason
