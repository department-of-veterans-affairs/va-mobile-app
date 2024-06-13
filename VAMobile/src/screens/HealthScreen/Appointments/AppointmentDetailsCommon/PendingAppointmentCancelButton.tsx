import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { UseMutateFunction } from '@tanstack/react-query'

import { AppointmentAttributes, AppointmentStatusConstants } from 'api/types'
import { Box } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus, isAPendingAppointment } from 'utils/appointments'
import { showSnackBar } from 'utils/common'
import { useAppDispatch, useDestructiveActionSheet, useTheme } from 'utils/hooks'

type PendingAppointmentCancelButtonProps = {
  attributes: AppointmentAttributes
  appointmentID?: string
  goBack: () => void
  cancelAppointment: UseMutateFunction<unknown, Error, string, unknown>
}

function PendingAppointmentCancelButton({
  attributes,
  appointmentID,
  cancelAppointment,
  goBack,
}: PendingAppointmentCancelButtonProps) {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
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
      if (cancelId) {
        const mutateOptions = {
          onSuccess: () => {
            goBack()
            showSnackBar(t('appointments.requestCanceled'), dispatch, undefined, true, false, true)
            logAnalyticsEvent(
              Events.vama_appt_cancel(
                true,
                appointmentID,
                getAppointmentAnalyticsStatus(attributes),
                attributes.appointmentType.toString(),
                getAppointmentAnalyticsDays(attributes),
              ),
            )
          },
          onError: () => {
            showSnackBar(
              t('appointments.requestNotCanceled'),
              dispatch,
              () => {
                cancelAppointment(cancelId, mutateOptions)
              },
              false,
              true,
              true,
            )
          },
        }
        cancelAppointment(cancelId, mutateOptions)
      }
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
        <Button
          onPress={onCancel}
          label={t('cancelRequest')}
          a11yHint={t('appointments.pending.cancelRequest.a11yHint')}
          buttonType={ButtonVariants.Destructive}
          testID={t('cancelRequest')}
        />
      </Box>
    )
  }

  return <></>
}

export default PendingAppointmentCancelButton
