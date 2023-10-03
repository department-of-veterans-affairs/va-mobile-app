import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { Box, ButtonTypesConstants, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { cancelAppointment } from 'store/slices'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus, isAPendingAppointment } from 'utils/appointments'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveActionSheet, useTheme } from 'utils/hooks'

type PendingAppointmentCancelButtonProps = {
  attributes: AppointmentAttributes
  appointmentID?: string
}

const PendingAppointmentCancelButton: FC<PendingAppointmentCancelButtonProps> = ({ attributes, appointmentID }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const confirmAlert = useDestructiveActionSheet()

  const { cancelId, status } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && cancelId && status !== AppointmentStatusConstants.CANCELLED) {
    const onPress = () => {
      logAnalyticsEvent(
        Events.vama_apt_cancel_clicks(
          appointmentID || '',
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
          'confirm',
        ),
      )
      dispatch(
        cancelAppointment(cancelId, appointmentID, true, getAppointmentAnalyticsStatus(attributes), attributes.appointmentType.toString(), getAppointmentAnalyticsDays(attributes)),
      )
    }

    const onCancel = () => {
      logAnalyticsEvent(
        Events.vama_apt_cancel_clicks(
          appointmentID || '',
          getAppointmentAnalyticsStatus(attributes),
          attributes.appointmentType.toString(),
          getAppointmentAnalyticsDays(attributes),
          'start',
        ),
      )
      confirmAlert({
        title: t('appointments.cancelRequest'),
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        buttons: [
          {
            text: t('cancelRequest'),
            onPress: onPress,
          },
          {
            text: t('keepRequest'),
          },
        ],
      })
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton
          onPress={onCancel}
          label={t('cancelRequest')}
          a11yHint={t('appointments.pending.cancelRequest.a11yHint')}
          buttonType={ButtonTypesConstants.buttonDestructive}
          {...testIdProps(t('cancelRequest'))}
        />
      </Box>
    )
  }

  return <></>
}

export default PendingAppointmentCancelButton
