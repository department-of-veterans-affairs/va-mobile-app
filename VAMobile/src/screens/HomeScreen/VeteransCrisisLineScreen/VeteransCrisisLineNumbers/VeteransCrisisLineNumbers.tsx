import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { UserAnalytics } from 'constants/analytics'
import { a11yHintProp } from 'utils/accessibility'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_VETERANS_CRISIS_LINE_GET_HELP } = getEnv()

/**
 * View for Veterans Crisis Line phone/text/TTY numbers
 *
 * Returns VeteransCrisisLineNumbers component
 */
const VeteransCrisisLineNumbers: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  const fireAnalyticFn = (): void => {
    setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())
  }

  return (
    <>
      <Box>
        <ClickForActionLink
          testID="veteransCrisisLineCrisisCallNumberTestID"
          displayedText={t('veteransCrisisLine.crisisCallNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.crisisCallNumberDisplayed.a11y')}
          numberOrUrlLink={t('988')}
          linkType={LinkTypeOptionsConstants.call}
          fireAnalytic={fireAnalyticFn}
        />
      </Box>
      <Box mt={standardMarginBetween}>
        <ClickForActionLink
          testID="veteransCrisisLineTextNumberTestID"
          displayedText={t('veteransCrisisLine.textNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.textNumberDisplayed.a11y')}
          numberOrUrlLink={t('838255')}
          linkType={LinkTypeOptionsConstants.text}
          fireAnalytic={fireAnalyticFn}
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
        <ClickForActionLink
          testID="veteransCrisisLineHearingLossNumberTestID"
          displayedText={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          numberOrUrlLink={t('8007994889')}
          linkType={LinkTypeOptionsConstants.callTTY}
          fireAnalytic={fireAnalyticFn}
        />
      </Box>
    </>
  )
}

export default VeteransCrisisLineNumbers
