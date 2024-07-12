import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, LinkWithAnalytics, TextView } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

import VeteransCrisisLineNumbers from './VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'

const { LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
function VeteransCrisisLineScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <LargePanel title={t('veteransCrisisLine.title')} rightButtonText={t('done')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
          {t('veteransCrisisLine.weAreHereForYou')}
        </TextView>
        <Box mt={standardMarginBetween}>
          <TextView variant="MobileBody" paragraphSpacing={true}>
            {t('veteransCrisisLine.connectWithResponders')}
          </TextView>
        </Box>
        <VeteransCrisisLineNumbers />
        <Box mt={standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('veteransCrisisLine.getMoreResources')}
          </TextView>
        </Box>
        <Box mt={standardMarginBetween}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_VETERANS_CRISIS_LINE}
            text={t('veteransCrisisLine.urlDisplayed')}
            a11yLabel={t('veteransCrisisLine.urlA11yLabel')}
            a11yHint={t('veteransCrisisLine.urlA11yHint')}
            analyticsOnPress={() => setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())}
            testID="veteransCrisisLineGetMoreResourcesTestID"
          />
        </Box>
      </Box>
    </LargePanel>
  )
}

export default VeteransCrisisLineScreen
