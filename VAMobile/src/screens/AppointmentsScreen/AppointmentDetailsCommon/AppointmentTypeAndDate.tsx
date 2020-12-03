import { FC } from 'react'
import React from 'react'

import { AppointmentTimeZone, AppointmentType, AppointmentTypeToID } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type AppointmentTypeAndDateProps = {
  appointmentType: AppointmentType
  startTime: string
  timeZone: AppointmentTimeZone
  isAppointmentCanceled: boolean
}

const AppointmentTypeAndDate: FC<AppointmentTypeAndDateProps> = ({ appointmentType, startTime, timeZone, isAppointmentCanceled }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()

  return (
    <Box>
      <TextView variant="MobileBody" mb={theme.dimensions.marginBetween}>
        {t(AppointmentTypeToID[appointmentType])}
      </TextView>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {getFormattedDateWithWeekdayForTimeZone(startTime, timeZone)}
      </TextView>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {getFormattedTimeForTimeZone(startTime, timeZone)}
      </TextView>

      {isAppointmentCanceled && (
        <TextView variant="MobileBodyBold" color="error" mt={theme.dimensions.marginBetween}>
          {t('appointments.canceled')}
        </TextView>
      )}
    </Box>
  )
}

export default AppointmentTypeAndDate
