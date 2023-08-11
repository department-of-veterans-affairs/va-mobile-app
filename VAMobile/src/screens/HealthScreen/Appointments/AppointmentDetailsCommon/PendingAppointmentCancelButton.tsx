import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { Box, ButtonTypesConstants, VAButton } from 'components'
import { DateTime } from 'luxon'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { cancelAppointment } from 'store/slices'
import { isAPendingAppointment } from 'utils/appointments'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveActionSheet, useTheme } from 'utils/hooks'

type PendingAppointmentCancelButtonProps = {
  attributes: AppointmentAttributes
  appointmentID?: string
}

const PendingAppointmentCancelButton: FC<PendingAppointmentCancelButtonProps> = ({ attributes, appointmentID }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const confirmAlert = useDestructiveActionSheet()

  const { cancelId, status } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && cancelId && status !== AppointmentStatusConstants.CANCELLED) {
    let apiStatus: string | undefined
    const isPendingAppointment = attributes.isPending && (attributes.status === AppointmentStatusConstants.SUBMITTED || attributes.status === AppointmentStatusConstants.CANCELLED)
    if (attributes.status === AppointmentStatusConstants.CANCELLED) {
      apiStatus = 'Canceled'
    } else if (attributes.status === AppointmentStatusConstants.BOOKED) {
      apiStatus = 'Confirmed'
    } else if (isPendingAppointment) {
      apiStatus = 'Pending'
    }
    const apptDate = Math.floor(DateTime.fromISO(attributes.startDateUtc).toMillis() / (1000 * 60 * 60 * 24))
    const nowDate = Math.floor(DateTime.now().toMillis() / (1000 * 60 * 60 * 24))
    const days = apptDate - nowDate

    const onPress = () => {
      logAnalyticsEvent(Events.vama_apt_cancel_clicks(appointmentID || '', apiStatus || '', attributes.appointmentType.toString(), days, 'confirm'))
      dispatch(cancelAppointment(cancelId, appointmentID, true, apiStatus, attributes.appointmentType.toString(), days))
    }

    const onCancel = () => {
      logAnalyticsEvent(Events.vama_apt_cancel_clicks(appointmentID || '', apiStatus || '', attributes.appointmentType.toString(), days, 'start'))
      confirmAlert({
        title: tc('appointments.cancelRequest'),
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        buttons: [
          {
            text: tc('cancelRequest'),
            onPress: onPress,
          },
          {
            text: tc('keepRequest'),
          },
        ],
      })
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton
          onPress={onCancel}
          label={t('appointments.pending.cancelRequest')}
          a11yHint={t('appointments.pending.cancelRequest.a11yHint')}
          buttonType={ButtonTypesConstants.buttonDestructive}
          {...testIdProps(t('appointments.pending.cancelRequest'))}
        />
      </Box>
    )
  }

  return <></>
}

export default PendingAppointmentCancelButton
