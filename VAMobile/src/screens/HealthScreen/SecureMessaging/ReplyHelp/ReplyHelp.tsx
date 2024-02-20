import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import { useTheme } from 'utils/hooks'

/**
 * View for Reply Help screen
 *
 * Returns ReplyHelp component
 */
function ReplyHelp() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <LargePanel
      testID="messageHelpTestID"
      title={t('secureMessaging.replyHelp.title')}
      rightButtonText={t('close')}
      rightButtonTestID="messagesHelpCloseTestID">
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
        <ClickToCallPhoneNumber
          ttyBypass={true}
          phone={t('911')}
          a11yLabel={t('secureMessaging.replyHelp.call911.a11y')}
          displayedText={t('secureMessaging.replyHelp.call911')}
        />
      </Box>
    </LargePanel>
  )
}

export default ReplyHelp
