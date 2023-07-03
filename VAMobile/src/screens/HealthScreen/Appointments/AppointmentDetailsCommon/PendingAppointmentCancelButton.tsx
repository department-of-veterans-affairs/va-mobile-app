import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { Box, ButtonTypesConstants, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { cancelAppointment } from 'store/slices'
import { isAPendingAppointment } from 'utils/appointments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveAlert, useTheme } from 'utils/hooks'

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
  const confirmAlert = useDestructiveAlert()

  const { cancelId, status } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && status !== AppointmentStatusConstants.CANCELLED) {
    const onPress = () => {
      dispatch(cancelAppointment(cancelId, appointmentID, true))
    }

    const onCancel = () => {
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
