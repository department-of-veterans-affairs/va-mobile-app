import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentPreferredModalityProps = {
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentPreferredModality({ subType, type }: AppointmentPreferredModalityProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.CanceledAndPending:
    case AppointmentDetailsSubTypeConstants.Pending:
    case AppointmentDetailsSubTypeConstants.PastPending:
      let modality = ''
      switch (type) {
        case AppointmentDetailsTypeConstants.VideoAtlas:
        case AppointmentDetailsTypeConstants.VideoGFE:
        case AppointmentDetailsTypeConstants.VideoHome:
        case AppointmentDetailsTypeConstants.VideoVA:
          modality = t('video')
          break
        case AppointmentDetailsTypeConstants.ClaimExam:
        case AppointmentDetailsTypeConstants.CommunityCare:
        case AppointmentDetailsTypeConstants.CompensationPension:
        case AppointmentDetailsTypeConstants.InPersonVA:
          modality = t('appointments.pending.officeVisit')
          break
        case AppointmentDetailsTypeConstants.Phone:
          modality = t('appointmentList.phoneOnly')
          break
      }
      return (
        <Box>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appointments.pending.preferredModality')}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {modality}
          </TextView>
        </Box>
      )
    default:
      return <></>
  }
}

export default AppointmentPreferredModality
