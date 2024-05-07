import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

function NoFolderMessages() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    navigateTo('SecureMessaging', { activeTab: 0 })
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  return (
    <>
      <VAScrollView contentContainerStyle={scrollStyles}>
        <Box mx={theme.dimensions.buttonPadding}>
          <Button
            label={t('secureMessaging.startNewMessage')}
            onPress={onPress}
            testID={'startNewMessageButtonTestID'}
          />
        </Box>
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView
            variant="MobileBodyBold"
            textAlign="center"
            accessibilityRole="header"
            mb={theme.dimensions.standardMarginBetween}>
            {t('secureMessaging.folders.noFolderMessages')}
          </TextView>
          <LinkWithAnalytics type="custom" text={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
        </Box>
      </VAScrollView>
    </>
  )
}

export default NoFolderMessages
