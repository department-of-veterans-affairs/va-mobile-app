import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, SegmentedControlIndexes } from 'constants/secureMessaging'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import {
  SecureMessagingState,
  fetchInboxMessages,
  listFolders,
  resetSaveDraftComplete,
  resetSaveDraftFailed,
  updateSecureMessagingTab,
} from 'store/slices'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../HealthStackScreens'
import CernerAlertSM from './CernerAlertSM/CernerAlertSM'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'
import TermsAndConditions from './TermsAndConditions/TermsAndConditions'

type SecureMessagingScreen = StackScreenProps<HealthStackParamList, 'SecureMessaging'>

export const getInboxUnreadCount = (state: RootState): number => {
  const inbox = state && state.secureMessaging && state.secureMessaging.inbox
  return inbox?.attributes.unreadCount || 0
}

function SecureMessaging({ navigation }: SecureMessagingScreen) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const inboxUnreadCount = useSelector<RootState, number>(getInboxUnreadCount)
  const { folders, secureMessagingTab, termsAndConditionError } = useSelector<RootState, SecureMessagingState>(
    (state) => state.secureMessaging,
  )
  const { data: userAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()
  const navigateTo = useRouteNavigation()
  const a11yHints = [t('secureMessaging.inbox.a11yHint', { inboxUnreadCount }), '']

  const inboxLabelCount = inboxUnreadCount !== 0 ? `(${inboxUnreadCount})` : ''
  const inboxLabel = `${t('secureMessaging.inbox')} ${inboxLabelCount}`.trim()
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  useEffect(() => {
    if (screenContentAllowed('WG_SecureMessaging') && userAuthorizedServices?.secureMessaging && smNotInDowntime) {
      dispatch(resetSaveDraftComplete())
      dispatch(resetSaveDraftFailed())
      // getInbox information is already fetched by HealthScreen page in order to display the unread messages tag
      // prefetch inbox message list
      dispatch(fetchInboxMessages(1, ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
      // fetch folders list
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
    }
  }, [dispatch, userAuthorizedServices?.secureMessaging, navigation, secureMessagingTab, smNotInDowntime])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID) || getUserAuthorizedServicesError) {
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

  if (termsAndConditionError) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('messages')}>
        <TermsAndConditions />
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
      dispatch(updateSecureMessagingTab(index))
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
