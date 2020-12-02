import { FC } from 'react'
import React from 'react'

import { AppointmentTimeZone, AppointmentType, AppointmentTypeToID } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type AppointmentTypeAndDateDisplayedProps = {
  appointmentType: AppointmentType
  startTime: string
  timeZone: AppointmentTimeZone
}

const AppointmentTypeAndDateDisplayed: FC<AppointmentTypeAndDateDisplayedProps> = ({ appointmentType, startTime, timeZone }) => {
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
    </Box>
  )
}

export default AppointmentTypeAndDateDisplayed
