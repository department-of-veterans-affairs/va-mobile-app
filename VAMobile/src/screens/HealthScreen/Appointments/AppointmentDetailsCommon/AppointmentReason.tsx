import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentReasonProps = {
  attributes: AppointmentAttributes
}

const AppointmentReason: FC<AppointmentReasonProps> = ({ attributes }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { reason, phoneOnly } = attributes || ({} as AppointmentAttributes)
  const isPendingAppointment = isAPendingAppointment(attributes)

  if (!phoneOnly && (isPendingAppointment || !reason)) {
    return <></>
  } else {
    const phoneApptReason = reason || t('notNoted')
    return (
      <Box mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.condensedMarginBetween}>
          {phoneOnly ? t('upcomingAppointmentDetails.sharedProvider') : t('upcomingAppointmentDetails.reason')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={phoneOnly && isPendingAppointment}>
          {phoneOnly ? t('upcomingAppointmentDetails.reasonDetails', { reason: phoneApptReason }) : reason}
        </TextView>
      </Box>
    )
  }
}

export default AppointmentReason
