import React, { FC } from 'react'

import { Box, CollapsibleView, CrisisLineCta, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const ComposeMessage: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  return (
    <VAScrollView {...testIdProps('Compose-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <CollapsibleView
            text={t('secureMessaging.composeMessage.whenWillIGetAReply')}
            showInTextArea={false}
            a11yHint={t('secureMessaging.composeMessage.whenWillIGetAReplyA11yHint')}>
            <TextView variant="MobileBody" {...testIdProps(t('secureMessaging.composeMessage.threeDaysToReceiveResponseA11yLabel'))} mt={theme.dimensions.condensedMarginBetween}>
              {t('secureMessaging.composeMessage.threeDaysToReceiveResponse')}
            </TextView>
            <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold">{t('secureMessaging.composeMessage.important')}</TextView>
              <TextView {...testIdProps(t('secureMessaging.composeMessage.pleaseCallHealthProviderA11yLabel'))}>
                {t('secureMessaging.composeMessage.pleaseCallHealthProvider')}
              </TextView>
            </TextView>
          </CollapsibleView>
        </Box>
        <TextArea>
          <TextView>To do: add form</TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ComposeMessage
