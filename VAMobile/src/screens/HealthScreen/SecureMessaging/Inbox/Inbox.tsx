import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useIsFocused } from '@react-navigation/native'

import { useFolderMessages } from 'api/secureMessaging'
import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import { Box, LoadingComponent, MessageList, Pagination, PaginationProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { getMessagesListItems } from 'utils/secureMessaging'

import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'

type InboxProps = Record<string, unknown>

function Inbox({}: InboxProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()
  const [page, setPage] = useState(1)
  const { data: inboxMessagesData, isLoading: loadingInbox } = useFolderMessages(
    SecureMessagingSystemFolderIdConstants.INBOX,
    page,
    { enabled: isFocused },
  )
  const paginationMetaData = inboxMessagesData?.meta.pagination

  const onInboxMessagePress = (messageID: number): void => {
    navigateTo('SecureMessaging', { activeTab: 0 }) // ensures that when we back out of the message that the inbox is present
    navigateTo('ViewMessage', {
      messageID,
      folderID: SecureMessagingSystemFolderIdConstants.INBOX,
      currentPage: paginationMetaData?.currentPage || 1,
      messagesLeft: inboxMessagesData?.data?.length,
    })
  }

  if (loadingInbox && isFocused) {
    return <LoadingComponent text={t('secureMessaging.messages.loading')} />
  }

  if (!inboxMessagesData?.data?.length) {
    return <NoInboxMessages />
  }

  const paginationProps: PaginationProps = {
    onNext: () => {
      setPage(page + 1)
    },
    onPrev: () => {
      setPage(page - 1)
    },
    totalEntries: paginationMetaData?.totalEntries || 0,
    pageSize: paginationMetaData?.perPage || 0,
    page,
    tab: 'inbox messages',
  }

  return (
    <Box>
      <MessageList
        items={getMessagesListItems(
          inboxMessagesData?.data || [],
          t,
          onInboxMessagePress,
          FolderNameTypeConstants.inbox,
        )}
        title={t('secureMessaging.inbox')}
      />
      <Box mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default Inbox
