import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type NoAppointmentsProps = {
  showVAGovLink?: boolean
  subText: string
  subTextA11yLabel?: string
}

export function NoAppointments({ subText, subTextA11yLabel, showVAGovLink = true }: NoAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box
      flex={1}
      justifyContent="center"
      mx={theme.dimensions.gutter}
      alignItems="center"
      mt={theme.dimensions.textAndButtonLargeMargin}>
      <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header" accessible={true}>
        {t('noAppointments.youDontHave')}
      </TextView>
      <TextView
        variant="MobileBody"
        textAlign="center"
        my={theme.dimensions.standardMarginBetween}
        accessible={true}
        accessibilityLabel={subTextA11yLabel}>
        {subText}
      </TextView>
      {showVAGovLink && (
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_SCHEDULE_APPOINTMENTS}
          text={t('noAppointments.visitVA')}
          a11yLabel={a11yLabelVA(t('noAppointments.visitVA'))}
          a11yHint={t('mobileBodyLink.a11yHint')}
        />
      )}
    </Box>
  )
}

export default NoAppointments
