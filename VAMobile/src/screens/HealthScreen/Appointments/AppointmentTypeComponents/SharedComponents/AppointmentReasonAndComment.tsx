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
  const isClaimExam = type === AppointmentDetailsTypeConstants.ClaimExam
  const isCommunityCare = type === AppointmentDetailsTypeConstants.CommunityCare
  const reasonText = t('upcomingAppointmentDetails.reasonDetails', { reason: reason || t('appointments.notAvailable') })
  const commentText = t('upcomingAppointmentDetails.reasonComment', {
    comment: comment || t('appointments.notAvailable'),
  })

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
            {t('appointments.pending.reasonTitle')}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {isCommunityCare ? commentText : reasonText}
          </TextView>
        </Box>
      )
    default:
      return isClaimExam ? null : (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('upcomingAppointmentDetails.sharedProvider')}
          </TextView>
          <TextView variant="MobileBody">{reasonText}</TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {commentText}
          </TextView>
        </Box>
      )
  }
}

export default AppointmentReasonAndComment
