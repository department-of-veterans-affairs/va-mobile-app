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

type AppointmentProviderProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentProvider({ attributes, subType, type }: AppointmentProviderProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { healthcareProvider } = attributes

  if (healthcareProvider) {
    let heading
    switch (subType) {
      case AppointmentDetailsSubTypeConstants.CanceledAndPending:
      case AppointmentDetailsSubTypeConstants.Pending:
      case AppointmentDetailsSubTypeConstants.PastPending:
        return <></>
      default:
        heading = t('appointments.provider.title')
    }
    switch (type) {
      case AppointmentDetailsTypeConstants.InPersonVA:
      case AppointmentDetailsTypeConstants.Phone:
      case AppointmentDetailsTypeConstants.VideoGFE:
      case AppointmentDetailsTypeConstants.VideoVA:
      case AppointmentDetailsTypeConstants.VideoAtlas:
      case AppointmentDetailsTypeConstants.VideoHome:
        return (
          <Box>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {heading}
            </TextView>
            <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
              {healthcareProvider}
            </TextView>
          </Box>
        )
      default:
        return <></>
    }
  }

  return <></>
}

export default AppointmentProvider
