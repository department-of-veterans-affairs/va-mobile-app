import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'

/**
 * View for Reply Help screen
 *
 * Returns ReplyHelp component
 */
const ReplyHelp: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <LargePanel title={t('messagesHelp.title')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.replyHelp.onlyUseMessages')}
        </TextView>

        <TextView mt={theme.dimensions.condensedMarginBetween}>
          <TextView variant="MobileBody">{t('secureMessaging.replyHelp.yourCareTeam') + ' '}</TextView>
          <TextView variant="MobileBodyBold">{t('secureMessaging.replyHelp.3BusinessDays')}</TextView>
          <TextView variant="MobileBody">{' ' + t('secureMessaging.replyHelp.toReply')}</TextView>
        </TextView>

        <TextView variant="MobileBody" mt={standardMarginBetween}>
          {t('secureMessaging.replyHelp.ifYouNeedHelp')}
        </TextView>

        <Box mt={standardMarginBetween}>
          <VABulletList listOfText={[{ boldedTextPrefix: t('secureMessaging.replyHelp.ifYoureInCrisis'), text: t('secureMessaging.replyHelp.connectWithOur') }]} />
        </Box>

        <Box mt={standardMarginBetween}>
          <VeteransCrisisLineNumbers />
        </Box>

        <Box mt={standardMarginBetween}>
          <VABulletList listOfText={[{ boldedTextPrefix: t('secureMessaging.replyHelp.ifYouThink'), text: t('secureMessaging.replyHelp.call911OrGoTo') }]} />
        </Box>

        <Box mt={standardMarginBetween}>
          <ClickForActionLink
            displayedText={t('secureMessaging.replyHelp.call911')}
            a11yLabel={t('secureMessaging.replyHelp.call911.a11y')}
            numberOrUrlLink={t('secureMessaging.replyHelp.911')}
            linkType={LinkTypeOptionsConstants.call}
            {...a11yHintProp(t('secureMessaging.replyHelp.call911.a11yHint'))}
          />
        </Box>
      </Box>
    </LargePanel>
  )
}

export default ReplyHelp
