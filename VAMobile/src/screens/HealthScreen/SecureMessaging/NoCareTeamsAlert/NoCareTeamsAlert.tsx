import React from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, Box, LinkWithAnalytics } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

function NoCareTeamsAlert() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        variant="info"
        expandable={true}
        header={t('secureMessaging.noCareTeams.header')}
        description={t('secureMessaging.noCareTeams.body')}
        descriptionA11yLabel={a11yLabelVA(t('secureMessaging.noCareTeams.body'))}
        testID="noCareTeamsAlertTestID">
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_FACILITY_LOCATOR}
          text={t('upcomingAppointmentDetails.findYourVAFacility')}
          a11yLabel={a11yLabelVA(t('upcomingAppointmentDetails.findYourVAFacility'))}
          a11yHint={t('upcomingAppointmentDetails.findYourVAFacility.a11yHint')}
        />
      </AlertWithHaptics>
    </Box>
  )
}

export default NoCareTeamsAlert
