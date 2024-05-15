import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes, AppointmentProposedTimesPeriodConstant } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type PreferredDateAndTimeProps = {
  attributes: AppointmentAttributes
}

function PreferredDateAndTime({ attributes }: PreferredDateAndTimeProps) {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { proposedTimes, phoneOnly } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && !!proposedTimes?.length) {
    const filteredTimes = proposedTimes?.filter(({ date }) => {
      return !!date
    })

    return (
      <Box mt={phoneOnly ? undefined : theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('appointments.pending.preferredDateAndTime')}
        </TextView>
        {filteredTimes?.map(({ date, time }, index) => {
          const timeSlot =
            time === AppointmentProposedTimesPeriodConstant.AM
              ? t('appointments.pending.inMorning')
              : t('appointments.pending.inAfternoon')
          return (
            <TextView
              key={index}
              variant="MobileBodySmall"
              paragraphSpacing={phoneOnly && index === filteredTimes.length - 1}
              testID="preferredDateAndTimeTestID">
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
