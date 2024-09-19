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

type AppointmentTypeOfCareProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentTypeOfCare({ attributes, subType, type }: AppointmentTypeOfCareProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { typeOfCare } = attributes
  let isPending = false

  if (typeOfCare) {
    let heading
    switch (subType) {
      case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      case AppointmentDetailsSubTypeConstants.Pending:
      case AppointmentDetailsSubTypeConstants.PastPending:
        isPending = true
        heading = t('appointments.typeOfCare.pendingTitle')
        break
      default:
        heading = t('appointments.typeOfCare.title')
    }
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
      case AppointmentDetailsTypeConstants.Phone:
      case AppointmentDetailsTypeConstants.VideoGFE:
      case AppointmentDetailsTypeConstants.VideoHome:
      case AppointmentDetailsTypeConstants.VideoVA:
      case AppointmentDetailsTypeConstants.VideoAtlas:
      case AppointmentDetailsTypeConstants.ClaimExam:
      case AppointmentDetailsTypeConstants.CommunityCare:
        const isNonPendingClaimExam = !isPending && type === AppointmentDetailsTypeConstants.ClaimExam
        return isNonPendingClaimExam ? null : (
          <Box>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {heading}
            </TextView>
            <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
              {typeOfCare}
            </TextView>
          </Box>
        )
      default:
        return <></>
    }
  }

  return <></>
}

export default AppointmentTypeOfCare
