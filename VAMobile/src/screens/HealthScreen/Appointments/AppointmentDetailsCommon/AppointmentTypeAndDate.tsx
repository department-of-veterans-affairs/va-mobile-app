import { FC } from 'react'
import React from 'react'

import {
  AppointmentAttributes,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
  AppointmentTypeConstants,
  AppointmentTypeToA11yLabel,
  AppointmentTypeToID,
} from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { isAPendingAppointment } from 'utils/appointments'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type AppointmentTypeAndDateProps = {
  attributes: AppointmentAttributes
}

const AppointmentTypeAndDate: FC<AppointmentTypeAndDateProps> = ({ attributes }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { appointmentType, startDateUtc, timeZone, isCovidVaccine, typeOfCare, status, statusDetail } = attributes || ({} as AppointmentAttributes)

  const isAppointmentPending = isAPendingAppointment(attributes)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const appointmentTypeAndDateIsLastItem = appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME
  const appointmentTypeLabel = t(AppointmentTypeToA11yLabel[appointmentType])

  const date = getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)
  const time = getFormattedTimeForTimeZone(startDateUtc, timeZone)
  const covid19Text = t('upcomingAppointments.covidVaccine')

  let content
  if (isAppointmentPending) {
    // pending
    const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED
    const title = appointmentCanceled ? 'appointments.pending.cancelled.pendingRequestTypeOfCare' : 'appointments.pending.submitted.pendingRequestTypeOfCare'
    content = (
      <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
        {t(title, { typeOfCare })}
      </TextView>
    )
  } else if (isAppointmentCanceled) {
    const whoCanceled =
      statusDetail === AppointmentStatusDetailTypeConsts.CLINIC || statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK
        ? t('appointments.canceled.whoCanceled.facility')
        : t('appointments.canceled.whoCanceled.you')

    // cancelled
    content = (
      <>
        <TextView variant={'BitterBoldHeading'} color={'primaryTitle'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.canceled.whoCanceled', { whoCanceled })}
        </TextView>

        <TextView variant={'MobileBody'} mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
          {t('appointments.canceled.message', { dateTime: `${date} ${time}` })}
        </TextView>
      </>
    )
  } else {
    // booked
    content = (
      <Box {...testIdProps(`${date} ${time}`)} accessibilityRole={'header'} accessible={true}>
        <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
          {date}
        </TextView>
        <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
          {time}
        </TextView>
      </Box>
    )
  }
  return (
    <Box>
      <TextView variant={'MobileBody'} mb={theme.dimensions.standardMarginBetween} {...testIdProps(isCovidVaccine ? covid19Text : appointmentTypeLabel)}>
        {t(isCovidVaccine ? covid19Text : AppointmentTypeToID[appointmentType])}
      </TextView>
      {content}
    </Box>
  )
}

export default AppointmentTypeAndDate
