import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlertBox, Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentAttributes } from 'store/api'
import {
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
  AppointmentTypeConstants,
} from 'store/api/types/AppointmentData'
import { useTheme } from 'utils/hooks'

type AppointmentAlertProps = {
  attributes: AppointmentAttributes
}

function AppointmentAlert({ attributes }: AppointmentAlertProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { status, statusDetail, location, phoneOnly, appointmentType, serviceCategoryName } =
    attributes || ({} as AppointmentAttributes)
  const appointmentBooked = status === AppointmentStatusConstants.BOOKED
  const appointmentHidden = status === AppointmentStatusConstants.HIDDEN
  const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED

  // dont show alerts for booked or hidden appointments or phone appointments
  if (
    appointmentBooked ||
    appointmentHidden ||
    phoneOnly ||
    (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')
  ) {
    return <></>
  }

  let title = t('appointments.pending.submitted.theTimeAndDate')

  // cancelled appointments
  if (appointmentCanceled) {
    // Default to you
    let who = t('appointments.canceled.whoCanceled.you')
    // if clinic then set to name of facility or default to Facility
    if (
      statusDetail === AppointmentStatusDetailTypeConsts.CLINIC ||
      statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK
    ) {
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
