import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes, AppointmentProposedTimesPeriodConstant } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentDetailsSubType, AppointmentDetailsSubTypeConstants } from 'utils/appointments'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type AppointmentDateAndTimeProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function AppointmentDateAndTime({ attributes, subType }: AppointmentDateAndTimeProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { proposedTimes, startDateUtc, timeZone } = attributes || ({} as AppointmentAttributes)

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.PastPending:
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
      const filteredTimes = proposedTimes?.filter(({ date }) => {
        return !!date
      })
      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appointments.pending.preferredDateAndTimeFrame')}
          </TextView>
          {filteredTimes?.map(({ date, time }, index) => {
            const timeSlot =
              time === AppointmentProposedTimesPeriodConstant.AM
                ? t('appointments.pending.inMorning')
                : t('appointments.pending.inAfternoon')
            return (
              <TextView
                key={index}
                variant="MobileBody"
                mb={index === filteredTimes.length - 1 ? theme.dimensions.standardMarginBetween : undefined}
                testID="preferredDateAndTimeTestID">
                {t('appointments.pending.dateInSlotTime', { optionDate: date, optionTime: timeSlot })}
              </TextView>
            )
          })}
        </Box>
      )
    case AppointmentDetailsSubTypeConstants.Canceled:
    case AppointmentDetailsSubTypeConstants.Past:
    case AppointmentDetailsSubTypeConstants.Upcoming:
    default:
      const date = getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)
      const time = getFormattedTimeForTimeZone(startDateUtc, timeZone)
      return (
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          mb={
            subType === AppointmentDetailsSubTypeConstants.Upcoming ? undefined : theme.dimensions.standardMarginBetween
          }>
          {`${date}\n${time}`}
        </TextView>
      )
  }
}

export default AppointmentDateAndTime
