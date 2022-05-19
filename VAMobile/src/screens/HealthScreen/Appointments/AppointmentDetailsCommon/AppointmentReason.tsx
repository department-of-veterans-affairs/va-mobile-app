import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type AppointmentReasonProps = {
  reason: string
}

const AppointmentReason: FC<AppointmentReasonProps> = ({ reason }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  return (
    <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('upcomingAppointmentDetails.reason')}
      </TextView>
      <TextView variant="MobileBody">{reason}</TextView>
    </Box>
  )
}

export default AppointmentReason
