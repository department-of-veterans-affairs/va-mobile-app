import { StackScreenProps } from '@react-navigation/stack'
import { ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect } from 'react'

import { fetchInboxMessages, listFolders, updateSecureMessagingTab } from 'store/actions'

import { AuthorizedServicesState, SecureMessagingState, StoreState } from 'store/reducers'
import { Box, ErrorComponent, SegmentedControl, VAScrollView } from 'components'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingTabTypes, SecureMessagingTabTypesConstants } from 'store/api/types'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import ComposeMessageFooter from './ComposeMessageFooter/ComposeMessageFooter'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'
import NotEnrolledSM from './NotEnrolledSM/NotEnrolledSM'
import TermsAndConditions from './TermsAndConditions/TermsAndConditions'

type SecureMessagingScreen = StackScreenProps<HealthStackParamList, 'SecureMessaging'>

export const getInboxUnreadCount = (state: StoreState): number => {
  const inbox = state && state.secureMessaging && state.secureMessaging.inbox
  return inbox?.attributes?.unreadCount || 0
}

const SecureMessaging: FC<SecureMessagingScreen> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('secureMessaging.inbox'), t('secureMessaging.folders')]
  const inboxUnreadCount = useSelector<StoreState, number>(getInboxUnreadCount)
  const { secureMessagingTab, termsAndConditionError } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)
  const { secureMessaging } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)

  const a11yHints = [t('secureMessaging.inbox.a11yHint', { inboxUnreadCount }), t('secureMessaging.folders.a11yHint')]

  const inboxLabelCount = inboxUnreadCount !== 0 ? `(${inboxUnreadCount})` : ''
  const inboxLabel = `${t('secureMessaging.inbox')} ${inboxLabelCount}`.trim()
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]

  useEffect(() => {
    if (secureMessaging) {
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
  }, [dispatch, secureMessaging])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID} />
  }

  if (!secureMessaging) {
    return <NotEnrolledSM />
  }

  if (termsAndConditionError) {
    return <TermsAndConditions />
  }

  const serviceErrorAlert = (): ReactElement => {
    // TODO error alert from state
    return <></>
  }

  const onTabUpdate = (selection: string): void => {
    const tab = selection as SecureMessagingTabTypes
    if (secureMessagingTab !== tab) {
      dispatch(updateSecureMessagingTab(tab))
    }
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <>
      <VAScrollView {...testIdProps('SecureMessaging-page')} contentContainerStyle={scrollStyles}>
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
          {serviceErrorAlert()}
          <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
            {secureMessagingTab === SecureMessagingTabTypesConstants.INBOX && <Inbox />}
            {secureMessagingTab === SecureMessagingTabTypesConstants.FOLDERS && <Folders />}
          </Box>
        </Box>
      </VAScrollView>
      <ComposeMessageFooter />
    </>
  )
}

export default SecureMessaging
