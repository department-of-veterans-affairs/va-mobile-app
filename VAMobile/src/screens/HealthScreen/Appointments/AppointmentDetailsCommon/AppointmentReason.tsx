import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes, AppointmentTypeConstants } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentReasonProps = {
  attributes: AppointmentAttributes
}

function AppointmentReason({ attributes }: AppointmentReasonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { reason, phoneOnly, appointmentType, serviceCategoryName } = attributes || ({} as AppointmentAttributes)
  const isPendingAppointment = isAPendingAppointment(attributes)

  if (!phoneOnly && (isPendingAppointment || !reason)) {
    return <></>
  } else {
    const apptReason = reason || t('notNoted')
    return (
      <Box mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.condensedMarginBetween}>
          {phoneOnly ||
          (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
            ? t('upcomingAppointmentDetails.sharedProvider')
            : t('upcomingAppointmentDetails.reason')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={phoneOnly && isPendingAppointment}>
          {phoneOnly ||
          (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
            ? t('upcomingAppointmentDetails.reasonDetails', { reason: apptReason })
            : reason}
        </TextView>
      </Box>
    )
  }
}

export default AppointmentReason
