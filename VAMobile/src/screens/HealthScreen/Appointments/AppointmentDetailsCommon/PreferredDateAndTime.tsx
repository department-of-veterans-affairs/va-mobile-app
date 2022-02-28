import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentProposedTimesPeriodConstant } from 'store/api/types/AppointmentData'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme, useTranslation } from 'utils/hooks'

type PreferredDateAndTimeProps = {
  attributes: AppointmentAttributes
}

const PreferredDateAndTime: FC<PreferredDateAndTimeProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const { proposedTimes } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && !!proposedTimes?.length) {
    proposedTimes?.filter(({ date }) => {
      return !!date
    })

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {t('appointments.pending.preferredDateAndTime')}
        </TextView>
        {proposedTimes?.map(({ date, time }, index) => {
          const timeSlot = time === AppointmentProposedTimesPeriodConstant.AM ? t('appointments.pending.inMorning') : t('appointments.pending.inAfternoon')
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
