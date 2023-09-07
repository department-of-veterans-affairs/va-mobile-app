import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box } from 'components'
import { AppointmentAttributes } from 'store/api'
import { AppointmentStatusConstants, AppointmentStatusDetailTypeConsts } from 'store/api/types/AppointmentData'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type AppointmentAlertProps = {
  attributes: AppointmentAttributes
}

const AppointmentAlert: FC<AppointmentAlertProps> = ({ attributes }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { status, statusDetail, location } = attributes || ({} as AppointmentAttributes)
  const appointmentBooked = status === AppointmentStatusConstants.BOOKED
  const appointmentHidden = status === AppointmentStatusConstants.HIDDEN
  const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED

  // dont show alerts for booked or hidden appointments
  if (appointmentBooked || appointmentHidden) {
    return <></>
  }

  let title = t('appointments.pending.submitted.theTimeAndDate')

  // cancelled appointments
  if (appointmentCanceled) {
    // Default to you
    let who = t('appointments.canceled.whoCanceled.you')
    // if clinic then set to name of facility or default to Facility
    if (statusDetail === AppointmentStatusDetailTypeConsts.CLINIC || statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK) {
      who = location?.name || t('appointments.canceled.whoCanceled.facility')
    }

    title = t('appointments.pending.cancelled.theTimeAndDate', { who })
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertBox title={title} border={appointmentCanceled ? 'error' : 'warning'} />
    </Box>
  )
}

export default AppointmentAlert
