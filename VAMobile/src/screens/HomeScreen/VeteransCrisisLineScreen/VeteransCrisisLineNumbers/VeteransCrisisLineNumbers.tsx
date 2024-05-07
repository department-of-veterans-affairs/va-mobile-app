import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, LinkWithAnalytics } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_VETERANS_CRISIS_LINE_GET_HELP } = getEnv()

function VeteransCrisisLineNumbers() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const analyticsFunction = () => setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())

  const boxProps: BoxProps = {
    mt: theme.dimensions.standardMarginBetween,
  }

  return (
    <>
      <Box {...boxProps} mt={0}>
        <LinkWithAnalytics
          type="call"
          phoneNumber={t('988')}
          text={t('veteransCrisisLine.crisisCallNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.crisisCallNumberDisplayed.a11y')}
          analyticsOnPress={analyticsFunction}
        />
      </Box>
      <Box {...boxProps}>
        <LinkWithAnalytics
          type="text"
          textNumber={t('838255')}
          text={t('veteransCrisisLine.textNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.textNumberDisplayed.a11y')}
          analyticsOnPress={analyticsFunction}
          testID="veteransCrisisLineTextNumberTestID"
        />
      </Box>
      <Box {...boxProps}>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_VETERANS_CRISIS_LINE_GET_HELP}
          text={t('veteransCrisisLine.startConfidentialChat')}
          a11yLabel={t('veteransCrisisLine.startConfidentialChat')}
          a11yHint={t('veteransCrisisLine.crisisUrlA11yHint')}
          analyticsOnPress={analyticsFunction}
          testID="veteransCrisisLineConfidentialChatTestID"
        />
      </Box>
      <Box {...boxProps}>
        <LinkWithAnalytics
          type="call TTY"
          TTYnumber={t('8007994889')}
          text={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          analyticsOnPress={analyticsFunction}
          testID="veteransCrisisLineHearingLossNumberTestID"
        />
      </Box>
    </>
  )
}

export default VeteransCrisisLineNumbers
