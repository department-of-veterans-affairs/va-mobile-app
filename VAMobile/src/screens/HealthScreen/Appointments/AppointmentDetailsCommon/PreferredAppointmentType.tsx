import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentTypeConstants } from 'store/api/types/AppointmentData'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type PreferredAppointmentTypeProps = {
  attributes: AppointmentAttributes
}

const PreferredAppointmentType: FC<PreferredAppointmentTypeProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { appointmentType, phoneOnly } = attributes || ({} as AppointmentAttributes)

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
        preferredTypeofAppointment = phoneOnly ? t('appointments.pending.phoneCall') : t('appointments.pending.officeVisit')
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
