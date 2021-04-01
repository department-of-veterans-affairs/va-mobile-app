import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { getInbox, prefetchInboxMessages } from 'store/actions'

import { Box, ErrorComponent, SegmentedControl } from 'components'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'

type SecureMessagingScreen = StackScreenProps<HealthStackParamList, 'SecureMessaging'>

function getInboxUnreadCount(state: StoreState) {
  const inbox = state && state.secureMessaging && state.secureMessaging.inbox
  return inbox?.attributes?.unreadCount || 0
}

const SecureMessaging: FC<SecureMessagingScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('secureMessaging.inbox'), t('secureMessaging.folders')]
  // TODO also update a11y hints to have unread count just like controlLabels
  const a11yHints = [t('secureMessaging.inbox.a11yHint'), t('secureMessaging.folders.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const inboxUnreadCount = useSelector<StoreState, number>(getInboxUnreadCount)

  const inboxLabel = `${t('secureMessaging.inbox')} (${inboxUnreadCount})`
  const controlLabels = [inboxLabel, t('secureMessaging.folders')]

  useEffect(() => {
    // fetch inbox message list
    dispatch(prefetchInboxMessages(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
    // fetch inbox metadata
    dispatch(getInbox(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
  }, [dispatch])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID)) {
    return <ErrorComponent />
  }

  const serviceErrorAlert = (): ReactElement => {
    // TODO error alert from state
    return <></>
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <ScrollView {...testIdProps('SecureMessaging-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlLabels} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
        </Box>
        {serviceErrorAlert()}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === t('secureMessaging.inbox') && <Inbox />}
          {selectedTab === t('secureMessaging.folders') && <Folders />}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SecureMessaging
