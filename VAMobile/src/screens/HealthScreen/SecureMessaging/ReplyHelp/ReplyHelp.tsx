import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
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
    <LargePanel testID="messageHelpTestID" title={t('secureMessaging.replyHelp.title')} rightButtonText={t('close')} rightButtonTestID="messagesHelpCloseTestID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.replyHelp.onlyUseMessages')}
        </TextView>

        <TextView mt={theme.dimensions.condensedMarginBetween} paragraphSpacing={true}>
          <TextView variant="MobileBody">{t('secureMessaging.replyHelp.yourCareTeam') + ' '}</TextView>
          <TextView variant="MobileBodyBold">{t('secureMessaging.replyHelp.3BusinessDays')}</TextView>
          <TextView variant="MobileBody">{' ' + t('secureMessaging.replyHelp.toReply')}</TextView>
        </TextView>

        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('secureMessaging.replyHelp.ifYouNeedHelp')}
        </TextView>

        <VABulletList
          listOfText={[
            {
              boldedTextPrefix: t('secureMessaging.replyHelp.ifYoureInCrisis'),
              text: t('secureMessaging.replyHelp.connectWithOur'),
              a11yLabel: t('secureMessaging.replyHelp.ifYoureInCrisis') + t('secureMessaging.replyHelp.connectWithOur'),
            },
          ]}
        />

        <VeteransCrisisLineNumbers />

        <Box mt={standardMarginBetween}>
          <VABulletList
            listOfText={[
              {
                boldedTextPrefix: t('secureMessaging.replyHelp.ifYouThink'),
                text: t('secureMessaging.replyHelp.call911OrGoTo'),
                a11yLabel: t('secureMessaging.replyHelp.ifYouThink') + t('secureMessaging.replyHelp.call911OrGoTo'),
              },
            ]}
          />
        </Box>

        <ClickForActionLink
          displayedText={t('secureMessaging.replyHelp.call911')}
          a11yLabel={t('secureMessaging.replyHelp.call911.a11y')}
          numberOrUrlLink={t('911')}
          linkType={LinkTypeOptionsConstants.call}
        />
      </Box>
    </LargePanel>
  )
}

export default ReplyHelp
