import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type NoAppointmentsProps = {
  subText: string
  subTextA11yLabel?: string
}

export const NoAppointments: FC<NoAppointmentsProps> = ({ subText, subTextA11yLabel }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} {...testIdProps('Appointments: No-appointments-page')} alignItems="center">
      <Box {...testIdProps(t('noAppointments.youDontHave'))} accessibilityRole="header" accessible={true}>
        <TextView variant="MobileBodyBold" textAlign="center">
          {t('noAppointments.youDontHave')}
        </TextView>
      </Box>
      <Box {...testIdProps(subTextA11yLabel || subText)} accessible={true}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween}>
          {subText}
        </TextView>
      </Box>
      <ClickForActionLink
        displayedText={t('noAppointments.visitVA')}
        numberOrUrlLink={LINK_URL_SCHEDULE_APPOINTMENTS}
        linkType={LinkTypeOptionsConstants.url}
        linkUrlIconType={LinkUrlIconType.Arrow}
        testID={t('noAppointments.visitVAA11yLabel')}
      />
    </Box>
  )
}

export default NoAppointments
