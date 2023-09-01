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
  const { reason } = attributes || ({} as AppointmentAttributes)
  const isPendingAppointment = isAPendingAppointment(attributes)

  if (isPendingAppointment || !reason) {
    return <></>
  } else {
    return (
      <Box my={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('upcomingAppointmentDetails.reason')}
        </TextView>
        <TextView variant="MobileBody">{reason}</TextView>
      </Box>
    )
  }
}

export default AppointmentReason
