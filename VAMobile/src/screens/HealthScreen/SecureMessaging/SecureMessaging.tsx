import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button, SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFolderMessages, useFolders } from 'api/secureMessaging'
import { SecureMessagingFolderList, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { Box, ErrorComponent, FeatureLandingTemplate } from 'components'
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
  const { data: userAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const {
    data: foldersData,
    isError: foldersError,
    isFetched: smFetch,
  } = useFolders({
    enabled: screenContentAllowed('WG_SecureMessaging') && userAuthorizedServices?.secureMessaging && smNotInDowntime,
  })
  const {
    isError: inboxError,
    error: errorDetails,
    isFetched: inboxFetched,
  } = useFolderMessages(SecureMessagingSystemFolderIdConstants.INBOX, 1, {
    enabled: screenContentAllowed('WG_SecureMessaging') && userAuthorizedServices?.secureMessaging && smNotInDowntime,
  })
  const folders = foldersData?.data || ([] as SecureMessagingFolderList)
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0)
  const a11yHints = [t('secureMessaging.inbox.a11yHint', { inboxUnreadCount }), '']

  const inboxLabelCount = inboxUnreadCount !== 0 ? `(${inboxUnreadCount})` : ''
  const inboxLabel = `${t('secureMessaging.inbox')} ${inboxLabelCount}`.trim()
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]

  useEffect(() => {
    if (smFetch && isFocused) {
      const foldersList = foldersData?.data || ([] as SecureMessagingFolderList)
      _.forEach(foldersList, (folder) => {
        if (folder.attributes.name === FolderNameTypeConstants.inbox) {
          setInboxUnreadCount(folder.attributes.unreadCount)
        }
      })
    }
  }, [smFetch, foldersData, isFocused])

  useFocusEffect(
    React.useCallback(() => {
      setSecureMessagingTab(activeTab)
    }, [activeTab]),
  )

  useEffect(() => {
    if (inboxFetched && inboxError && isErrorObject(errorDetails)) {
      setTermsAndConditionError(hasErrorCode(SecureMessagingErrorCodesConstants.TERMS_AND_CONDITIONS, errorDetails))
    }
  }, [errorDetails, inboxError, inboxFetched])

  if (termsAndConditionError) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('messages')}>
        <TermsAndConditions />
      </FeatureLandingTemplate>
    )
  }

  if (foldersError || (inboxError && !termsAndConditionError) || getUserAuthorizedServicesError || !smNotInDowntime) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('messages')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (!userAuthorizedServices?.secureMessaging) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('messages')}>
        <NotEnrolledSM />
      </FeatureLandingTemplate>
    )
  }

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

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('messages')}
      testID="messagesTestID">
      <Box mx={theme.dimensions.buttonPadding}>
        <Button label={t('secureMessaging.startNewMessage')} onPress={onPress} testID={'startNewMessageButtonTestID'} />
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
          />
        </Box>
        <CernerAlertSM />
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {secureMessagingTab === SegmentedControlIndexes.INBOX && <Inbox />}
          {secureMessagingTab === SegmentedControlIndexes.FOLDERS && <Folders />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default SecureMessaging
