import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView } from 'components'
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
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
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
    <LargePanel title={tc('veteransCrisisLine.title')} rightButtonText={tc('done')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
          {t('veteransCrisisLine.weAreHereForYou')}
        </TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('veteransCrisisLine.connectWithResponders')}
        </TextView>
        <ClickForActionLink
          testID="veteransCrisisLineCrisisCallNumberTestID"
          displayedText={t('veteransCrisisLine.crisisCallNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.crisisCallNumberDisplayed')}
          numberOrUrlLink={t('veteransCrisisLine.crisisCallNumber')}
          linkType={LinkTypeOptionsConstants.call}
          fireAnalytic={fireAnalyticFn}
          {...a11yHintProp(t('veteransCrisisLine.callA11yHint'))}
        />
        <Box mt={standardMarginBetween}>
          <ClickForActionLink
            testID="veteransCrisisLineTextNumberTestID"
            displayedText={t('veteransCrisisLine.textNumberDisplayed')}
            a11yLabel={t('veteransCrisisLine.textNumberDisplayed.a11y')}
            numberOrUrlLink={t('veteransCrisisLine.textNumber')}
            linkType={LinkTypeOptionsConstants.text}
            fireAnalytic={fireAnalyticFn}
            {...a11yHintProp(t('veteransCrisisLine.textA11yHint'))}
          />
        </Box>
        <Box mt={standardMarginBetween}>
          <ClickForActionLink
            testID="veteransCrisisLineConfidentialChatTestID"
            displayedText={t('veteransCrisisLine.startConfidentialChat')}
            a11yLabel={t('veteransCrisisLine.startConfidentialChat')}
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
            testID="veteransCrisisLineHearingLossNumberTestID"
            displayedText={t('veteransCrisisLine.hearingLossNumberDisplayed')}
            a11yLabel={t('veteransCrisisLine.hearingLossNumberDisplayed')}
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
