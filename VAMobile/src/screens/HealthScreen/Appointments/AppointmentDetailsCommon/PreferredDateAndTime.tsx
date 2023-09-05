import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentProposedTimesPeriodConstant } from 'store/api/types/AppointmentData'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type PreferredDateAndTimeProps = {
  attributes: AppointmentAttributes
}

const PreferredDateAndTime: FC<PreferredDateAndTimeProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { proposedTimes } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && !!proposedTimes?.length) {
    const filteredTimes = proposedTimes?.filter(({ date }) => {
      return !!date
    })

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('appointments.pending.preferredDateAndTime')}
        </TextView>
        {filteredTimes?.map(({ date, time }, index) => {
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
