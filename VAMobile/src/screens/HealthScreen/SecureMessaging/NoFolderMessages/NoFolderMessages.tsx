import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { SegmentedControlIndexes } from 'constants/secureMessaging'
import { logAnalyticsEvent } from 'utils/analytics'
import { updateSecureMessagingTab } from 'store/slices'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

function NoFolderMessages() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SegmentedControlIndexes.INBOX))
    navigateTo('SecureMessaging')
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
          <Button label={t('secureMessaging.startNewMessage')} onPress={onPress} testID={'startNewMessageButtonTestID'} />
        </Box>
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
            {t('secureMessaging.folders.noFolderMessages')}
          </TextView>
          <Box width={'100%'}>
            <Button label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
          </Box>
        </Box>
      </VAScrollView>
    </>
  )
}

export default NoFolderMessages
