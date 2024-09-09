import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type NoAppointmentsProps = {
  showVAGovLink?: boolean
  subText: string
  subTextA11yLabel?: string
}

export function NoAppointments({ subText, subTextA11yLabel, showVAGovLink = true }: NoAppointmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  return (
    <Box
      flex={1}
      justifyContent="center"
      mx={theme.dimensions.gutter}
      {...testIdProps('Appointments: No-appointments-page')}
      alignItems="center">
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
      {showVAGovLink &&
        (true ? (
          <LinkWithAnalytics
            type="custom"
            onPress={() =>
              navigateTo('Webview', {
                url: LINK_URL_SCHEDULE_APPOINTMENTS,
                displayTitle: t('webview.vagov'),
                loadingMessage: t('webview.appointments.loading'),
                useSSO: true,
              })
            }
            text={t('noAppointments.visitVA')}
            a11yLabel={a11yLabelVA(t('noAppointments.visitVA'))}
            a11yHint={t('mobileBodyLink.a11yHint')}
          />
        ) : (
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_SCHEDULE_APPOINTMENTS}
            text={t('noAppointments.visitVA')}
            a11yLabel={a11yLabelVA(t('noAppointments.visitVA'))}
            a11yHint={t('mobileBodyLink.a11yHint')}
          />
        ))}
    </Box>
  )
}

export default NoAppointments
