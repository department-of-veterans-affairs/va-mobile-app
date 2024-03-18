import React from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, BoxProps } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { makeLinkAnalytics, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_VETERANS_CRISIS_LINE_GET_HELP } = getEnv()

function VeteransCrisisLineNumbers() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const analyticsWithUserProperty = (protocol: string, url: string) => {
    const analytics = makeLinkAnalytics(protocol, url)

    return {
      ...analytics,
      onPress: () => {
        setAnalyticsUserProperty(UserAnalytics.vama_uses_vcl())
        analytics.onPress()
      },
    }
  }

  const boxProps: BoxProps = {
    mt: theme.dimensions.standardMarginBetween,
    mr: 'auto',
  }

  return (
    <>
      <Box {...boxProps} mt="0">
        <Link
          type="call"
          phoneNumber={t('988')}
          text={t('veteransCrisisLine.crisisCallNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.crisisCallNumberDisplayed.a11y')}
          analytics={analyticsWithUserProperty('tel', t('988'))}
        />
      </Box>
      <Box {...boxProps}>
        <Link
          type="text"
          textNumber={t('838255')}
          text={t('veteransCrisisLine.textNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.textNumberDisplayed.a11y')}
          analytics={analyticsWithUserProperty('sms', t('838255'))}
          testID="veteransCrisisLineTextNumberTestID"
        />
      </Box>
      <Box {...boxProps}>
        <Link
          type="url"
          url={LINK_URL_VETERANS_CRISIS_LINE_GET_HELP}
          text={t('veteransCrisisLine.startConfidentialChat')}
          a11yLabel={t('veteransCrisisLine.startConfidentialChat')}
          a11yHint={t('veteransCrisisLine.crisisUrlA11yHint')}
          analytics={analyticsWithUserProperty('https', LINK_URL_VETERANS_CRISIS_LINE_GET_HELP)}
          testID="veteransCrisisLineConfidentialChatTestID"
        />
      </Box>
      <Box {...boxProps}>
        <Link
          type="call TTY"
          TTYnumber={t('8007994889')}
          text={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          a11yLabel={t('veteransCrisisLine.hearingLossNumberDisplayed')}
          analytics={analyticsWithUserProperty('tel', t('8007994889'))}
          testID="veteransCrisisLineHearingLossNumberTestID"
        />
      </Box>
    </>
  )
}

export default VeteransCrisisLineNumbers
