import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentAttributes } from 'store/api'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { Box, ButtonTypesConstants, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { cancelAppointment } from 'store/slices'
import { isAPendingAppointment } from 'utils/appointments'
import { isAndroid } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveAlert } from 'utils/hooks'
import { useTheme } from 'utils/hooks'

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
  const isAndroidDevice = isAndroid()

  const { cancelId, typeOfCare, status } = attributes || ({} as AppointmentAttributes)

  if (isAppointmentPending && status !== AppointmentStatusConstants.CANCELLED) {
    const onPress = () => {
      dispatch(cancelAppointment(cancelId, appointmentID, true))
    }

    const androidButtons = [
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.android.noKeep'),
      },
      {
        text: t('upcomingAppointmentDetails.cancelAppointment.android.yesCancel'),
        onPress,
      },
    ]
    const iosButtons = [
      {
        text: tc('cancel'),
      },
      {
        text: t('appointments.pending.cancelRequest.yes'),
        onPress,
      },
      {
        text: t('appointments.pending.cancelRequest.no'),
      },
    ]

    const onCancel = () => {
      confirmAlert({
        title: '',
        message: t('appointments.pending.cancelRequest.message', { typeOfCare }),
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        buttons: isAndroidDevice ? androidButtons : iosButtons,
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
