import { FC } from 'react'
import React from 'react'

import { AppointmentTimeZone, AppointmentType, AppointmentTypeConstants, AppointmentTypeToID } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type AppointmentTypeAndDateProps = {
  appointmentType: AppointmentType
  startDateUtc: string
  timeZone: AppointmentTimeZone
  isAppointmentCanceled: boolean
}

const AppointmentTypeAndDate: FC<AppointmentTypeAndDateProps> = ({ appointmentType, startDateUtc, timeZone, isAppointmentCanceled }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()

  const appointmentTypeAndDateIsLastItem = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME

  return (
    <Box>
      <TextView variant="MobileBody" mb={theme.dimensions.marginBetween}>
        {t(AppointmentTypeToID[appointmentType])}
      </TextView>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)}
      </TextView>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {getFormattedTimeForTimeZone(startDateUtc, timeZone)}
      </TextView>

      {isAppointmentCanceled && (
        <TextView variant="MobileBodyBold" color="error" mt={theme.dimensions.marginBetween} mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.marginBetween}>
          {t('appointments.canceled')}
        </TextView>
      )}
    </Box>
  )
}

export default AppointmentTypeAndDate
