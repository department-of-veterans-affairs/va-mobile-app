import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { UserAnalytics } from 'constants/analytics'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useExternalLink, useTheme } from 'utils/hooks'
import VeteransCrisisLineNumbers from './VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import getEnv from 'utils/env'

const { LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  const fireAnalyticFn = (): void => {
    setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())
  }

  const redirectToVeteransCrisisLineLink = (): void => {
    fireAnalyticFn()
    launchExternalLink(LINK_URL_VETERANS_CRISIS_LINE)
  }

  return (
    <LargePanel title={t('veteransCrisisLine.title')} rightButtonText={t('done')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
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
          <TextView
            variant="MobileBody"
            color="link"
            onPress={redirectToVeteransCrisisLineLink}
            accessibilityRole="link"
            {...a11yHintProp(t('veteransCrisisLine.urlA11yHint'))}
            {...testIdProps(t('veteransCrisisLine.urlA11yLabel'))}
            testID="veteransCrisisLineGetMoreResourcesTestID">
            {t('veteransCrisisLine.urlDisplayed')}
          </TextView>
        </Box>
      </Box>
    </LargePanel>
  )
}

export default VeteransCrisisLineScreen
