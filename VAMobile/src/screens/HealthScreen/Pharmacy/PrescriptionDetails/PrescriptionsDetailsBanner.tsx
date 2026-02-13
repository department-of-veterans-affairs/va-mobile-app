import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, Box, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

function PrescriptionsDetailsBanner() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  useEffect(() => {
    logAnalyticsEvent(Events.vama_cerner_alert())
  }, [])

  const getContent = () => {
    return (
      <>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          accessible
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('prescription.details.banner.body'))}
          mb={standardMarginBetween}>
          {t('prescription.details.banner.body')}
        </TextView>
      </>
    )
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <AlertWithHaptics
          variant="warning"
          expandable={true}
          focusOnError={false}
          header={t('prescription.details.banner.title')}
          analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}>
          {getContent()}
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionsDetailsBanner
