import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types'
import { isAPendingAppointment } from 'utils/appointments'
import { getAllFieldsThatExist } from 'utils/common'
import { useTheme } from 'utils/hooks'

type ProviderNameProps = {
  attributes: AppointmentAttributes
}

function ProviderName({ attributes }: ProviderNameProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const isAppointmentPending = isAPendingAppointment(attributes)
  const {
    appointmentType,
    practitioner,
    healthcareProvider,
    friendlyLocationName,
    location,
    phoneOnly,
    serviceCategoryName,
  } = attributes || ({} as AppointmentAttributes)

  if (
    phoneOnly ||
    (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
  ) {
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('upcomingAppointmentDetails.provider')}
        </TextView>
        <TextView>{healthcareProvider || t('appointments.noProvider')}</TextView>
      </Box>
    )
  }

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
    practitionerName = getAllFieldsThatExist([
      practitioner.firstName || '',
      practitioner.middleName || '',
      practitioner.lastName || '',
    ])
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
