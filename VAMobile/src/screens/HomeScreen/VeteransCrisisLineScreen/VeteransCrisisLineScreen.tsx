import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { UserAnalytics } from 'constants/analytics'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_VETERANS_CRISIS_LINE_GET_HELP, LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.HOME)
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
    <VAScrollView {...testIdProps('Veterans-Crisis-Line-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
            {t('veteransCrisisLine.weAreHereForYou')}
          </TextView>
          <Box mt={standardMarginBetween}>
            <TextView variant="MobileBody">{t('veteransCrisisLine.connectWithResponders')}</TextView>
          </Box>
          <Box mt={standardMarginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.crisisCallNumberDisplayed')}
              accessibilityLabel={t('veteransCrisisLine.crisisCallNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.crisisCallNumber')}
              linkType={LinkTypeOptionsConstants.call}
              fireAnalytic={fireAnalyticFn}
              {...a11yHintProp(t('veteransCrisisLine.callA11yHint'))}
            />
          </Box>
          <Box mt={standardMarginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.textNumberDisplayed')}
              accessibilityLabel={t('veteransCrisisLine.textNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.textNumber')}
              linkType={LinkTypeOptionsConstants.text}
              fireAnalytic={fireAnalyticFn}
              {...a11yHintProp(t('veteransCrisisLine.textA11yHint'))}
            />
          </Box>
          <Box mt={standardMarginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.startConfidentialChat')}
              numberOrUrlLink={LINK_URL_VETERANS_CRISIS_LINE_GET_HELP}
              linkType={LinkTypeOptionsConstants.url}
              fireAnalytic={fireAnalyticFn}
              {...a11yHintProp(t('veteransCrisisLine.crisisUrlA11yHint'))}
            />
          </Box>
          <Box mt={standardMarginBetween}>
            <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween / 2}>
              {t('contactVA.tty.body')}
            </TextView>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.hearingLossNumberDisplayed')}
              accessibilityLabel={t('veteransCrisisLine.hearingLossNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.hearingLossNumber')}
              linkType={LinkTypeOptionsConstants.callTTY}
              fireAnalytic={fireAnalyticFn}
              {...a11yHintProp(t('veteransCrisisLine.callA11yHint'))}
            />
          </Box>
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
              {...testIdProps(t('veteransCrisisLine.urlA11yLabel'))}>
              {t('veteransCrisisLine.urlDisplayed')}
            </TextView>
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default VeteransCrisisLineScreen
