import React, { FC } from 'react'

import { AppointmentAttributes, AppointmentStatusConstants } from 'store/api'
import { Box, ButtonTypesConstants, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isAPendingAppointment } from 'utils/appointments'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type PendingAppointmentCancelButtonProps = {
  attributes: AppointmentAttributes
  appointmentID?: string
}

const PendingAppointmentCancelButton: FC<PendingAppointmentCancelButtonProps> = ({ attributes, appointmentID }) => {
  const isAppointmentPending = isAPendingAppointment(attributes)
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const { cancelId, status } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && status !== AppointmentStatusConstants.CANCELLED) {
    const cancelAppointment = navigateTo('AppointmentCancellationConfirmation', { cancelID: cancelId, appointmentID: appointmentID })

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton
          onPress={cancelAppointment}
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
