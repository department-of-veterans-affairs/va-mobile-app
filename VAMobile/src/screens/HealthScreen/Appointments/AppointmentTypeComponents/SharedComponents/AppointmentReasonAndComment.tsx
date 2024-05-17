import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentReasonAndCommentProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentReasonAndComment({ attributes, subType, type }: AppointmentReasonAndCommentProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { comment, reason } = attributes
  switch (type) {
    case AppointmentDetailsTypeConstants.ClaimExam:
      return <></>
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header" my={theme.dimensions.condensedMarginBetween}>
            {t('appointments.pending.reasonTitle')}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {t('upcomingAppointmentDetails.reasonDetails', { reason: reason || t('appointments.notAvailable') })}
          </TextView>
        </Box>
      )
    default:
      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.condensedMarginBetween}>
            {t('upcomingAppointmentDetails.sharedProvider')}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.condensedMarginBetween}>
            {t('upcomingAppointmentDetails.reasonDetails', { reason: reason || t('appointments.notAvailable') })}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {t('upcomingAppointmentDetails.reasonComment', { comment: comment || t('appointments.notAvailable') })}
          </TextView>
        </Box>
      )
  }
}

export default AppointmentReasonAndComment
