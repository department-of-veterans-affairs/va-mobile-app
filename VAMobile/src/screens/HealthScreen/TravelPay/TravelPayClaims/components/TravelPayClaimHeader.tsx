import React from 'react'
import { useTranslation } from 'react-i18next'

import { DateTime } from 'luxon'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateOrTimeWithFormatOption } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimHeaderProps = {
  /** The appointment date/time in ISO format */
  appointmentDate: string
  /** The claim number */
  claimNumber: string
  /** The current claim status */
  claimStatus: string
}

/**
 * Header component for Travel Pay Claim Details screen
 * Displays the main claim information including appointment date, claim number, and status
 */
function TravelPayClaimHeader({ appointmentDate, claimNumber, claimStatus }: TravelPayClaimHeaderProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Format the appointment date with weekday (e.g., "Tuesday, October 7, 2025")
  const formattedAppointmentDate = getFormattedDateOrTimeWithFormatOption(
    appointmentDate,
    DateTime.DATE_FULL,
    undefined,
    {
      weekday: 'long',
    },
  )

  return (
    <Box>
      {/* Main title with appointment date */}
      <TextView variant="MobileBody" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
        {t('travelPay.claimDetails.header.title', { appointmentDate: formattedAppointmentDate })}
      </TextView>

      {/* Claim number */}
      <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.condensedMarginBetween}>
        {t('travelPay.claimDetails.header.claimNumber', { claimNumber })}
      </TextView>

      {/* Claim status */}
      <TextView variant="MobileBodyBold" color="bodyText">
        {t('travelPay.claimDetails.header.claimStatus', { claimStatus })}
      </TextView>
    </Box>
  )
}

export default TravelPayClaimHeader
