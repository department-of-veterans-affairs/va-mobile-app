import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type NoAppointmentsProps = {
  showVAGovLink?: boolean
  subText: string
  subTextA11yLabel?: string
}

export const NoAppointments: FC<NoAppointmentsProps> = ({ subText, subTextA11yLabel, showVAGovLink = true }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
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
      {showVAGovLink && (
        <ClickForActionLink
          {...a11yHintProp(t('mobileBodyLink.a11yHint'))}
          displayedText={t('noAppointments.visitVA')}
          numberOrUrlLink={LINK_URL_SCHEDULE_APPOINTMENTS}
          linkType={LinkTypeOptionsConstants.externalLink}
          a11yLabel={a11yLabelVA(t('noAppointments.visitVA'))}
        />
      )}
    </Box>
  )
}

export default NoAppointments
