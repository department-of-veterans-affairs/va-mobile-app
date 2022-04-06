import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { AppointmentTimeZone, AppointmentType, AppointmentTypeConstants, AppointmentTypeToA11yLabel, AppointmentTypeToID } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone, getTranslation } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type AppointmentTypeAndDateProps = {
  appointmentType: AppointmentType
  startDateUtc: string
  timeZone: AppointmentTimeZone
  isAppointmentCanceled: boolean
  whoCanceled?: string
  isCovidVaccine?: boolean
}

const AppointmentTypeAndDate: FC<AppointmentTypeAndDateProps> = ({ appointmentType, startDateUtc, timeZone, isAppointmentCanceled, whoCanceled, isCovidVaccine }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const appointmentTypeAndDateIsLastItem = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME
  const appointmentTypeLabel = getTranslation(AppointmentTypeToA11yLabel[appointmentType], t)

  const date = getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)
  const time = getFormattedTimeForTimeZone(startDateUtc, timeZone)
  const covid19Text = t('upcomingAppointments.covidVaccine')

  return (
    <Box>
      <TextView variant={'MobileBody'} mb={theme.dimensions.standardMarginBetween} {...testIdProps(isCovidVaccine ? covid19Text : appointmentTypeLabel)}>
        {getTranslation(isCovidVaccine ? covid19Text : AppointmentTypeToID[appointmentType], t)}
      </TextView>
      {isAppointmentCanceled ? (
        <>
          <TextView variant={'BitterBoldHeading'} color={'primaryTitle'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
            {t('appointments.canceled.whoCanceled', { whoCanceled })}
          </TextView>

          <TextView variant={'MobileBody'} mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
            {t('appointments.canceled.message', { dateTime: `${date} ${time}` })}
          </TextView>
        </>
      ) : (
        <Box {...testIdProps(`${date} ${time}`)} accessibilityRole={'header'} accessible={true}>
          <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
            {date}
          </TextView>
          <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
            {time}
          </TextView>
        </Box>
      )}
    </Box>
  )
}

export default AppointmentTypeAndDate
