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

  if (typeOfCare) {
    let heading
    switch (subType) {
      case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      case AppointmentDetailsSubTypeConstants.Pending:
      case AppointmentDetailsSubTypeConstants.PastPending:
        heading = t('appointments.typeOfCare.pendingTitle')
        break
      default:
        heading = t('appointments.typeOfCare.title')
    }
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
      case AppointmentDetailsTypeConstants.Phone:
      case AppointmentDetailsTypeConstants.VideoVA:
        return (
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
