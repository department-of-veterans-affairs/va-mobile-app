import { FC } from 'react'
import React from 'react'

import { AppointmentAttributes, AppointmentStatusConstants, AppointmentTypeToA11yLabel, AppointmentTypeToID } from 'store/api/types'
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
  const { appointmentType, startDateUtc, timeZone, isCovidVaccine, typeOfCare, status } = attributes || ({} as AppointmentAttributes)

  const isAppointmentPending = isAPendingAppointment(attributes)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const appointmentTypeLabel = t(AppointmentTypeToA11yLabel[appointmentType])

  const date = getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)
  const time = getFormattedTimeForTimeZone(startDateUtc, timeZone)
  const covid19Text = t('upcomingAppointments.covidVaccine')

  let content
  if (isAppointmentPending) {
    if (!typeOfCare) {
      return <></>
    }

    // pending
    const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED
    const title = appointmentCanceled ? 'appointments.pending.cancelled.pendingRequestTypeOfCare' : 'appointments.pending.submitted.pendingRequestTypeOfCare'
    content = (
      <TextView variant={'BitterBoldHeading'} selectable={true} color={'primaryTitle'}>
        {t(title, { typeOfCare })}
      </TextView>
    )
  } else if (isAppointmentCanceled) {
    // cancelled
    content = (
      <>
        <TextView variant={'BitterBoldHeading'} color={'primaryTitle'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.canceled.message', { date, time })}
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
