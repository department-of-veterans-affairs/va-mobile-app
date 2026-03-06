import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ViewStyle } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertWithHaptics, Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

function NoFolderMessages({ noRecipientsError }: { noRecipientsError: boolean }) {
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
        {noRecipientsError ? (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
            <AlertWithHaptics
              variant="info"
              expandable={true}
              header={t('secureMessaging.noCareTeams.header')}
              description={t('secureMessaging.noCareTeams.body')}
              testID="noCareTeamsAlertTestID">
              <LinkWithAnalytics
                type="custom"
                text={t('upcomingAppointmentDetails.findYourVAFacility')}
                onPress={() => Linking.openURL(WEBVIEW_URL_FACILITY_LOCATOR)}
              />
            </AlertWithHaptics>
          </Box>
        ) : (
          <Box mx={theme.dimensions.buttonPadding}>
            <Button
              label={t('secureMessaging.startNewMessage')}
              onPress={onPress}
              testID={'startNewMessageButtonTestID'}
            />
          </Box>
        )}
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView
            variant="MobileBodyBold"
            textAlign="center"
            accessibilityRole="header"
            mb={theme.dimensions.standardMarginBetween}>
            {t('secureMessaging.folders.noFolderMessages')}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            text={t('secureMessaging.goToInbox')}
            onPress={onGoToInbox}
            testID="noFolderMessagesGoToInbox"
          />
        </Box>
      </VAScrollView>
    </>
  )
}

export default NoFolderMessages
