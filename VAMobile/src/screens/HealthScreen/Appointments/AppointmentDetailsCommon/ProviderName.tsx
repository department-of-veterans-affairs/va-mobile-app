import React, { FC } from 'react'

import { AppointmentPractitioner, AppointmentType, AppointmentTypeConstants } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAllFieldsThatExist } from 'utils/common'
import { useTheme, useTranslation } from 'utils/hooks'

type ProviderNameProps = {
  appointmentType: AppointmentType
  practitioner: AppointmentPractitioner | undefined
}

const ProviderName: FC<ProviderNameProps> = ({ appointmentType, practitioner }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  if (appointmentType !== AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE || !practitioner) {
    return <></>
  }

  const practitionerName = getAllFieldsThatExist([practitioner.firstName || '', practitioner.middleName || '', practitioner.lastName || ''])
    .join(' ')
    .trim()

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('upcomingAppointmentDetails.provider')}
      </TextView>
      <TextView variant="MobileBody">{practitionerName}</TextView>
    </Box>
  )
}

export default ProviderName
