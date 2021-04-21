import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, LoadingComponent, MessageList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { getMessagesListItems } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTranslation } from 'utils/hooks'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'

type InboxProps = Record<string, unknown>

const Inbox: FC<InboxProps> = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const { inboxMessages, loading } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  const onInboxMessagePress = (messageID: number): void => {
    navigateTo('ViewMessageScreen', { messageID })()
  }

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.messages.loading')} />
  }

  if (!inboxMessages?.length) {
    return <NoInboxMessages />
  }

  return (
    <Box {...testIdProps('', false, 'Inbox-page')}>
      <MessageList items={getMessagesListItems(inboxMessages || [], t, onInboxMessagePress)} title={t('secureMessaging.inbox')} />
    </Box>
  )
}

export default Inbox
