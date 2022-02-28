import React, { FC } from 'react'

import { AlertBox, Box } from 'components'
import { AppointmentAttributes, AppointmentStatusDetailTypeConsts } from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { useTheme, useTranslation } from 'utils/hooks'

type PendingAppointmentAlertProps = {
  attributes: AppointmentAttributes
}

const PendingAppointmentAlert: FC<PendingAppointmentAlertProps> = ({ attributes }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const { status, statusDetail, location } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending) {
    const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED
    let title = t('appointments.pending.submitted.theTimeAndDate')
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
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
        <AlertBox title={title} border={appointmentCanceled ? 'error' : 'warning'} />
      </Box>
    )
  }
  return <></>
}

export default PendingAppointmentAlert
