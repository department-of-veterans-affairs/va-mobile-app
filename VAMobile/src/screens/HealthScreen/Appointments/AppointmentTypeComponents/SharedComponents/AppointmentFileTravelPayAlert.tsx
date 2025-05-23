import React from 'react'
import { useTranslation } from 'react-i18next'

import { Alert } from '@department-of-veterans-affairs/mobile-component-library'

import { AppointmentData } from 'api/types'
import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getDaysLeftToFileTravelPay, isEligibleForTravelPay } from 'utils/appointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type AppointmentFileTravelPayAlertProps = {
  appointment: AppointmentData
  appointmentRouteKey: string
}

function AppointmentFileTravelPayAlert({ appointment, appointmentRouteKey }: AppointmentFileTravelPayAlertProps) {
  const { attributes } = appointment
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const eligibleForTravelPay = isEligibleForTravelPay(attributes)
  const daysLeftToFile = getDaysLeftToFileTravelPay(attributes.startDateUtc)

  if (!eligibleForTravelPay || daysLeftToFile < 0) {
    return null
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <Alert
        variant="info"
        description={
          daysLeftToFile === 1
            ? t('travelPay.fileClaimAlert.description', { count: daysLeftToFile, days: daysLeftToFile })
            : t('travelPay.fileClaimAlert.description_plural', { count: daysLeftToFile, days: daysLeftToFile })
        }
        header={t('travelPay.fileClaimAlert.header')}
        primaryButton={{
          label: t('travelPay.fileClaimAlert.button'),
          onPress: () => {
            navigateTo('SubmitTravelPayClaimScreen', { appointment, appointmentRouteKey })
          },
        }}
        testID="appointmentFileTravelPayAlert"
      />
    </Box>
  )
}

export default AppointmentFileTravelPayAlert
