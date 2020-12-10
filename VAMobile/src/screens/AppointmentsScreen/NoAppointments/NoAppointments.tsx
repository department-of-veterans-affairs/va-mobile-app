import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type NoAppointmentsProps = {
  subText: string
}

export const NoAppointments: FC<NoAppointmentsProps> = ({ subText }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()

  return (
    <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} {...testIdProps('No-appointments-screen')} alignItems="center">
      <TextView variant="MobileBodyBold" selectable={true} textAlign={'center'} accessibilityRole="header">
        {t('noAppointments.youDontHave')}
      </TextView>
      <Box>
        <TextView variant="MobileBody" selectable={true} textAlign={'center'} my={theme.dimensions.marginBetween}>
          {subText}
        </TextView>
      </Box>
      <ClickForActionLink
        displayedText={t('noAppointments.visitVA')}
        numberOrUrlLink={LINK_URL_SCHEDULE_APPOINTMENTS}
        linkType={LinkTypeOptionsConstants.url}
        linkUrlIconType={LinkUrlIconType.Arrow}
      />
    </Box>
  )
}

export default NoAppointments
