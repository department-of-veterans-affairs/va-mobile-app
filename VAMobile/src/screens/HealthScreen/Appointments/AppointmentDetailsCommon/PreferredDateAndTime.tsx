import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme, useTranslation } from 'utils/hooks'

type PreferredDateAndTimeProps = {
  attributes: AppointmentAttributes
}

const TIME_AM = 'AM'

const PreferredDateAndTime: FC<PreferredDateAndTimeProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const { proposedTimes } = attributes || ({} as AppointmentAttributes)

  // TODO remove for integration - real date should return null
  const NoDateSelectedString = 'No Date Selected'

  if (isAppointmentPending) {
    const { optionDate1, optionTime1, optionDate2, optionTime2, optionDate3, optionTime3 } = proposedTimes || {}

    const preferredDateAndTimes = [
      {
        date: optionDate1,
        time: optionTime1,
      },
      {
        date: optionDate2,
        time: optionTime2,
      },
      {
        date: optionDate3,
        time: optionTime3,
      },
    ].filter(({ date }) => {
      return !!date && date !== NoDateSelectedString
    })
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {t('appointments.pending.preferredDateAndTime')}
        </TextView>
        {preferredDateAndTimes.map(({ date, time }, index) => {
          const timeSlot = time === TIME_AM ? t('appointments.pending.inMorning') : t('appointments.pending.inAfternoon')
          return (
            <TextView key={index} variant="MobileBody">
              {t('appointments.pending.dateInSlotTime', { optionDate: date, optionTime: timeSlot })}
            </TextView>
          )
        })}
      </Box>
    )
  }
  return <></>
}

export default PreferredDateAndTime
