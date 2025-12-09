import React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { AlertWithHaptics, Box, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function CernerAlertSM() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const linkProps: LinkProps = {
    type: 'url',
    url: LINK_URL_GO_TO_PATIENT_PORTAL,
    text: t('goToMyVAHealth'),
    a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
    testID: 'goToMyVAHealthTestID',
    variant: 'base',
  }

  function accordionContent() {
    return (
      <>
        <TextView
          variant="MobileBody"
          mb={theme.dimensions.standardMarginBetween}
          accessibilityLabel={a11yLabelVA(t('cernerAlertSM.sendingAMessage'))}
          accessibilityHint={a11yLabelVA(t('cernerAlertSM.sendingAMessage'))}>
          {t('cernerAlertSM.sendingAMessage')}
        </TextView>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics {...linkProps} />
        </Box>
      </>
    )
  }

  return (
    <AlertWithHaptics
      variant="warning"
      expandable={true}
      focusOnError={false}
      header={t('cernerAlert.header.some')}
      headerA11yLabel={a11yLabelVA(t('cernerAlert.header.some'))}
      analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}
      testID="cernerAlertTestID">
      {accordionContent()}
    </AlertWithHaptics>
  )
}

export default CernerAlertSM
