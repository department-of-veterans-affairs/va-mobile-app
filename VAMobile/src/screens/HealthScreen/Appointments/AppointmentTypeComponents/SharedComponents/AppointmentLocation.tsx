import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
} from 'utils/appointments'
import { useTheme } from 'utils/hooks'

type AppointmentLocationProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentLocation({ attributes, subType, type }: AppointmentLocationProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { location } = attributes

  // let heading
  // switch (subType) {
  //   case AppointmentDetailsSubTypeConstants.CanceledAndPending:
  //   case AppointmentDetailsSubTypeConstants.Pending:
  //     return <></>
  //   default:
  //     heading = t('appointments.provider.title')
  // }
  // return (
  //   <Box>
  //     <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
  //       {heading}
  //     </TextView>
  //     <TextView variant="MobileBody" paragraphSpacing={true}>
  //       {healthcareProvider}
  //     </TextView>
  //   </Box>
  // )

  return <></>
}

export default AppointmentLocation
