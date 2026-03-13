import React from 'react'

import { Alert } from '@department-of-veterans-affairs/mobile-component-library'
import { t } from 'i18next'

import { AppointmentAttributes, SummaryObject } from 'api/types'
import Box from 'components/Box'
import { AVS_BINARY_ERRORS_WITH_ALERT } from 'constants/appointments'
import { useTheme } from 'utils/hooks'

export type AppointmentAfterVisitErrorProps = {
  attributes: AppointmentAttributes
}

const hasRetrievalError = (binary: SummaryObject) => AVS_BINARY_ERRORS_WITH_ALERT.includes(binary.error || '')

export default function AppointmentAfterVisitError({ attributes }: AppointmentAfterVisitErrorProps) {
  const theme = useTheme()
  // Currently only Cerner appointments have AVS PDFs (VistA will in the future -- currently only a web version)
  const hasError = attributes.avsError || attributes.avsPdf?.some(hasRetrievalError)
  if (!attributes.isCerner || !hasError) return null

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
