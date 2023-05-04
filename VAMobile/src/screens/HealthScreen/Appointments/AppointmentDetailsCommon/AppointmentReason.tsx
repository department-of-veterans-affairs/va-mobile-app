import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentMessages } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentReasonProps = {
  attributes: AppointmentAttributes
}

const AppointmentReason: FC<AppointmentReasonProps> = ({ attributes }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { reason } = attributes || ({} as AppointmentAttributes)
  const isPendingAppointment = isAPendingAppointment(attributes)

  let text
  if (!isPendingAppointment) {
    // Confirmed appointments that are either booked or canceled
    if (!reason) {
      return <></>
    }
    text = reason
  }

  return (
    <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('upcomingAppointmentDetails.reason')}
      </TextView>
      <TextView variant="MobileBody">{text}</TextView>
    </Box>
  )
}

export default AppointmentReason
