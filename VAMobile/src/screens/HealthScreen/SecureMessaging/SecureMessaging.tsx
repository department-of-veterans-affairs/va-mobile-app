import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button, SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFolderMessages, useFolders } from 'api/secureMessaging'
import { SecureMessagingFolderList, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { AlertWithHaptics, Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, SegmentedControlIndexes } from 'constants/secureMessaging'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { hasErrorCode } from 'utils/errors'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../HealthStackScreens'
import CernerAlertSM from './CernerAlertSM/CernerAlertSM'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'
import TermsAndConditions from './TermsAndConditions/TermsAndConditions'

type SecureMessagingScreen = StackScreenProps<HealthStackParamList, 'SecureMessaging'>

function SecureMessaging({ navigation, route }: SecureMessagingScreen) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { activeTab } = route.params
  const [secureMessagingTab, setSecureMessagingTab] = useState(0)
  const [termsAndConditionError, setTermsAndConditionError] = useState(false)
  const isFocused = useIsFocused()
  const {
    data: userAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchAuthServices,
    isFetching: fetchingAuthServices,
  } = useAuthorizedServices()
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const {
    data: foldersData,
    error: foldersError,
    refetch: refetchFolder,
    isFetching: refetchingFolders,
  } = useFolders({
    enabled:
      isFocused &&
      screenContentAllowed('WG_SecureMessaging') &&
      userAuthorizedServices?.secureMessaging &&
      smNotInDowntime,
  })
  const {
    error: inboxError,
    isFetched: inboxFetched,
    refetch: refetchInbox,
    isFetching: refetchingInbox,
  } = useFolderMessages(SecureMessagingSystemFolderIdConstants.INBOX, {
    enabled:
      isFocused &&
      screenContentAllowed('WG_SecureMessaging') &&
      userAuthorizedServices?.secureMessaging &&
      smNotInDowntime,
  })
  const folders = foldersData?.data || ([] as SecureMessagingFolderList)
  const inboxUnreadCount = foldersData?.inboxUnreadCount || 0
  const a11yHints = [t('secureMessaging.inbox.a11yHint', { inboxUnreadCount }), '']

  const inboxLabelCount = inboxUnreadCount !== 0 ? `(${inboxUnreadCount})` : ''
  const inboxLabel = `${t('secureMessaging.inbox')} ${inboxLabelCount}`.trim()
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]
  const controlIDs = ['inboxID', 'foldersID']
  const [scrollPage, setScrollPage] = useState(1)

  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }, [scrollPage])

  useFocusEffect(
    React.useCallback(() => {
      setSecureMessagingTab(activeTab)
    }, [activeTab]),
  )

  useEffect(() => {
    if (inboxFetched && inboxError && isErrorObject(inboxError)) {
      setTermsAndConditionError(hasErrorCode(SecureMessagingErrorCodesConstants.TERMS_AND_CONDITIONS, inboxError))
    }
  }, [inboxError, inboxFetched])

  const onTabUpdate = (index: number): void => {
    if (secureMessagingTab !== index) {
      if (index === SegmentedControlIndexes.FOLDERS) {
        _.forEach(folders, (folder) => {
          if (folder.attributes.name === FolderNameTypeConstants.drafts) {
            logAnalyticsEvent(Events.vama_sm_folders(folder.attributes.count))
          }
        })
      }
      if (!snackBar) {
        logAnalyticsEvent(Events.vama_snackbar_null('SecureMessaging tab change'))
      }
      snackBar?.hideAll()
      setSecureMessagingTab(index)
    }
  }
  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  const otherError = (foldersError || (inboxError && !termsAndConditionError)) && !refetchingFolders && !refetchingInbox

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('messages')}
      testID="messagesTestID"
      scrollViewProps={scrollViewProps}>
      {!smNotInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID} />
      ) : getUserAuthorizedServicesError && !fetchingAuthServices && !refetchingFolders && !refetchingInbox ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID}
          error={getUserAuthorizedServicesError}
          onTryAgain={refetchAuthServices}
        />
      ) : !userAuthorizedServices?.secureMessaging ? (
        <NotEnrolledSM />
      ) : termsAndConditionError ? (
        <TermsAndConditions />
      ) : (
        <>
          <Box mx={theme.dimensions.buttonPadding}>
            <Button
              label={t('secureMessaging.startNewMessage')}
              onPress={onPress}
              testID={'startNewMessageButtonTestID'}
            />
          </Box>
          <Box flex={1} justifyContent="flex-start">
            <Box
              mb={theme.dimensions.standardMarginBetween}
              mt={theme.dimensions.contentMarginTop}
              mx={theme.dimensions.gutter}>
              <SegmentedControl
                labels={controlLabels}
                onChange={onTabUpdate}
                selected={secureMessagingTab}
                a11yHints={a11yHints}
                a11yLabels={[t('secureMessaging.inbox')]}
                testIDs={controlIDs}
              />
            </Box>
            <CernerAlertSM />
            <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
              {secureMessagingTab === SegmentedControlIndexes.INBOX &&
                (otherError ? (
                  <Box mt={20} mb={theme.dimensions.buttonPadding}>
                    <AlertWithHaptics
                      variant="warning"
                      header={t('secureMessaging.inbox.messageDownError.title')}
                      description={t('secureMessaging.inbox.messageDownError.body')}
                      secondaryButton={{ label: t('refresh'), onPress: refetchInbox }}
                    />
                  </Box>
                ) : (
                  <Inbox setScrollPage={setScrollPage} />
                ))}
              {secureMessagingTab === SegmentedControlIndexes.FOLDERS && <Folders />}
            </Box>
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default SecureMessaging
