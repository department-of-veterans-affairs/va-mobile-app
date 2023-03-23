import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, ErrorComponent, FeatureLandingTemplate, SegmentedControl } from 'components'
import { DowntimeFeatureTypeConstants, SecureMessagingTabTypes, SecureMessagingTabTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, fetchInboxMessages, listFolders, resetSaveDraftComplete, resetSaveDraftFailed, updateSecureMessagingTab } from 'store/slices'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CernerAlert from '../CernerAlert'
import ComposeMessageButton from './ComposeMessageButton/ComposeMessageButton'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'
import TermsAndConditions from './TermsAndConditions/TermsAndConditions'

type SecureMessagingScreen = StackScreenProps<HealthStackParamList, 'SecureMessaging'>

export const getInboxUnreadCount = (state: RootState): number => {
  const inbox = state && state.secureMessaging && state.secureMessaging.inbox
  return inbox?.attributes?.unreadCount || 0
}

const SecureMessaging: FC<SecureMessagingScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const controlValues = [t('secureMessaging.inbox'), t('secureMessaging.folders')]
  const inboxUnreadCount = useSelector<RootState, number>(getInboxUnreadCount)
  const { secureMessagingTab, termsAndConditionError } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
  const { secureMessaging } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)

  const a11yHints = [t('secureMessaging.inbox.a11yHint', { inboxUnreadCount }), t('secureMessaging.folders.a11yHint')]

  const inboxLabelCount = inboxUnreadCount !== 0 ? `(${inboxUnreadCount})` : ''
  const inboxLabel = `${t('secureMessaging.inbox')} ${inboxLabelCount}`.trim()
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  useEffect(() => {
    if (secureMessaging && smNotInDowntime) {
      dispatch(resetSaveDraftComplete())
      dispatch(resetSaveDraftFailed())
      // getInbox information is already fetched by HealthScreen page in order to display the unread messages tag
      // prefetch inbox message list
      dispatch(fetchInboxMessages(1, ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
      // sets the inbox tab on initial load
      if (!secureMessagingTab) {
        dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
      }
      // fetch folders list
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
    }
  }, [dispatch, secureMessaging, navigation, secureMessagingTab, smNotInDowntime])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={tc('health')} backLabelOnPress={navigation.goBack} title={tc('messages')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (!secureMessaging) {
    return (
      <FeatureLandingTemplate backLabel={tc('health')} backLabelOnPress={navigation.goBack} title={tc('messages')}>
        <NotEnrolledSM />
      </FeatureLandingTemplate>
    )
  }

  if (termsAndConditionError) {
    return (
      <FeatureLandingTemplate backLabel={tc('health')} backLabelOnPress={navigation.goBack} title={tc('messages')}>
        <TermsAndConditions />
      </FeatureLandingTemplate>
    )
  }

  const serviceErrorAlert = (): ReactElement => {
    // TODO error alert from state
    return <></>
  }

  const onTabUpdate = (selection: string): void => {
    const tab = selection as SecureMessagingTabTypes
    if (secureMessagingTab !== tab) {
      snackBar?.hideAll()
      dispatch(updateSecureMessagingTab(tab))
    }
  }

  return (
    <FeatureLandingTemplate backLabel={tc('health')} backLabelOnPress={navigation.goBack} title={tc('messages')}>
      <ComposeMessageButton />
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl
            values={controlValues}
            titles={controlLabels}
            onChange={onTabUpdate}
            selected={controlValues.indexOf(secureMessagingTab || SecureMessagingTabTypesConstants.INBOX)}
            accessibilityHints={a11yHints}
          />
        </Box>
        <CernerAlert />
        {serviceErrorAlert()}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {secureMessagingTab === SecureMessagingTabTypesConstants.INBOX && <Inbox />}
          {secureMessagingTab === SecureMessagingTabTypesConstants.FOLDERS && <Folders />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default SecureMessaging
