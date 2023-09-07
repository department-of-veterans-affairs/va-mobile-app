import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAllFieldsThatExist } from 'utils/common'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type ProviderNameProps = {
  attributes: AppointmentAttributes
}

const ProviderName: FC<ProviderNameProps> = ({ attributes }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const isAppointmentPending = isAPendingAppointment(attributes)

  const { appointmentType, practitioner, healthcareProvider, friendlyLocationName, location } = attributes || ({} as AppointmentAttributes)

  // pending appointments
  if (isAppointmentPending) {
    let header = friendlyLocationName
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE) {
      header = healthcareProvider || location.name || t('appointments.noProviderSelected')
    }

    // default to VA appointments
    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {header}
        </TextView>
      </Box>
    )
  }

  // Canceled and Booked appointments
  let practitionerName = ''
  if (appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE && practitioner) {
    practitionerName = getAllFieldsThatExist([practitioner.firstName || '', practitioner.middleName || '', practitioner.lastName || ''])
      .join(' ')
      .trim()
  } else if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE && healthcareProvider) {
    practitionerName = healthcareProvider
  }

  return (
    <>
      {!!practitionerName && (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.provider')}
          </TextView>
          <TextView variant="MobileBody">{practitionerName}</TextView>
        </Box>
      )}
    </>
  )
}

export default ProviderName
