import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes, AppointmentTypeConstants } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type PreferredAppointmentTypeProps = {
  attributes: AppointmentAttributes
}

function PreferredAppointmentType({ attributes }: PreferredAppointmentTypeProps) {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { appointmentType, phoneOnly } = attributes || ({} as AppointmentAttributes)

  if (phoneOnly) {
    return <></>
  }

  if (isAppointmentPending) {
    let preferredTypeofAppointment = ''
    // preferred type of appointment
    switch (appointmentType) {
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE:
      case AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE:
        preferredTypeofAppointment = t('appointments.pending.video')
        break
      case AppointmentTypeConstants.COMMUNITY_CARE:
      case AppointmentTypeConstants.VA:
      default:
        preferredTypeofAppointment = t('appointments.pending.officeVisit')
        break
    }
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('appointments.pending.preferredTypeOfAppointment')}
        </TextView>
        <TextView variant="MobileBody">{preferredTypeofAppointment}</TextView>
      </Box>
    )
  }
  return <></>
}

export default PreferredAppointmentType
