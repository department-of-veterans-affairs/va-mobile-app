import React from 'react'

import { Alert } from '@department-of-veterans-affairs/mobile-component-library'
import { t } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import Box from 'components/Box'
import { useTheme } from 'utils/hooks'

export type AppointmentAfterVisitErrorProps = {
  attributes: AppointmentAttributes
}

export default function AppointmentAfterVisitError({ attributes }: AppointmentAfterVisitErrorProps) {
  const theme = useTheme()
  // Currently only Cerner appointments have AVS PDFs (VistA will in the future -- currently only a web version)
  if (!attributes.isCerner || !attributes.avsError) return null

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <Alert
        expandable={true}
        initializeExpanded={false}
        testID="avs-error-alert"
        variant="error"
        header={t('appointments.afterVisitSummary.error.header')}
        description={t('appointments.afterVisitSummary.error.description')}
      />
    </Box>
  )
}
