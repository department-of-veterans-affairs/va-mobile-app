import React from 'react'
import { useTranslation } from 'react-i18next'

import { Alert } from '@department-of-veterans-affairs/mobile-component-library'
import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { AppointmentData } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getDaysLeftToFileTravelPay, isEligibleForTravelPay } from 'utils/appointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { showOfflineSnackbar, useAppIsOnline } from 'utils/hooks/offline'
import { useTravelClaimSubmissionMutationState } from 'utils/travelPay'

type AppointmentFileTravelPayAlertProps = {
  appointment: AppointmentData
  appointmentRouteKey: string
}

function AppointmentFileTravelPayAlert({ appointment, appointmentRouteKey }: AppointmentFileTravelPayAlertProps) {
  const { attributes } = appointment
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const mutationState = useTravelClaimSubmissionMutationState(appointment.id)
  const mutationStatus = mutationState?.status
  const isConnected = useAppIsOnline()
  const snackbar = useSnackbar()

  const eligibleForTravelPay = isEligibleForTravelPay(attributes)
  const daysLeftToFile = getDaysLeftToFileTravelPay(attributes.startDateUtc)

  if (!eligibleForTravelPay || daysLeftToFile < 0 || mutationStatus === 'pending') {
    return null
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <Alert
        variant="info"
        header={t('travelPay.fileClaimAlert.header')}
        primaryButton={{
          label: t('travelPay.fileClaimAlert.button'),
          onPress: () => {
            if (!isConnected) {
              showOfflineSnackbar(snackbar, t)
              return
            }

            navigateTo('SubmitTravelPayClaimScreen', {
              appointment,
              appointmentRouteKey,
            })
          },
          testID: 'appointmentFileTravelPayAlertPrimaryButtonTestID',
        }}
        testID="appointmentFileTravelPayAlert">
        {mutationStatus === 'error' && (
          <TextView mb={theme.dimensions.condensedMarginBetween}>{t('travelPay.fileClaimAlert.error')}</TextView>
        )}
        <TextView>
          {t('travelPay.fileClaimAlert.description', { count: daysLeftToFile, days: daysLeftToFile })}
        </TextView>
      </Alert>
    </Box>
  )
}

export default AppointmentFileTravelPayAlert
