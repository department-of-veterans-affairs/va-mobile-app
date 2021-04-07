import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, DefaultList, LoadingComponent } from 'components'
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
    return <LoadingComponent />
  }

  if (!inboxMessages?.length) {
    return <NoInboxMessages />
  }

  return (
<<<<<<< HEAD
    <Box {...testIdProps('Inbox-page')}>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox'))} accessible={true}>
        <TextView variant="MobileBodyBold">{t('secureMessaging.inbox')}</TextView>
      </Box>
      {renderMessages(inboxMessages || [], t, onInboxMessagePress)}
=======
    <Box {...testIdProps('', false, 'Inbox-page')}>
      <DefaultList items={getMessagesListItems(inboxMessages || [], t, onInboxMessagePress)} title={t('secureMessaging.inbox')} />
>>>>>>> 4980bf05... update folder titles
    </Box>
  )
}

export default Inbox
