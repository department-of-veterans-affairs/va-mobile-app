import React, { FC } from 'react'

import { AppointmentPractitioner, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAllFieldsThatExist } from 'utils/common'
import { useTheme, useTranslation } from 'utils/hooks'

type ProviderNameProps = {
  /* The type of appointment */
  appointmentType: AppointmentType
  /* The practitioner name object*/
  practitioner: AppointmentPractitioner | undefined
  /* The provider name string  */
  healthcareProvider: string | null
}

const ProviderName: FC<ProviderNameProps> = ({ appointmentType, practitioner, healthcareProvider }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
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
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('upcomingAppointmentDetails.provider')}
          </TextView>
          <TextView variant="MobileBody">{practitionerName}</TextView>
        </Box>
      )}
    </>
  )
}

export default ProviderName
