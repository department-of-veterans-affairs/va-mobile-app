import React, { FC } from 'react'

import { Box, LoadingComponent, MessageList, Pagination, PaginationProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types/SecureMessagingData'
import { fetchInboxMessages } from 'store/slices/secureMessagingSlice'
import { getMessagesListItems } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'

type InboxProps = Record<string, unknown>

const Inbox: FC<InboxProps> = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()
  const { inboxMessages, loadingInbox, paginationMetaByFolderId } = useAppSelector((state) => state.secureMessaging)
  const paginationMetaData = paginationMetaByFolderId?.[SecureMessagingSystemFolderIdConstants.INBOX]

  const onInboxMessagePress = (messageID: number): void => {
    navigateTo('ViewMessageScreen', {
      messageID,
      folderID: SecureMessagingSystemFolderIdConstants.INBOX,
      currentPage: paginationMetaData?.currentPage || 1,
      messagesLeft: inboxMessages.length,
    })()
  }

  if (loadingInbox) {
    return <LoadingComponent text={t('secureMessaging.messages.loading')} />
  }

  if (!inboxMessages?.length) {
    return <NoInboxMessages />
  }

  const requestPage = (requestedPage: number) => {
    dispatch(fetchInboxMessages(requestedPage, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
  }

  const page = paginationMetaData?.currentPage || 1
  const paginationProps: PaginationProps = {
    onNext: () => {
      requestPage(page + 1)
    },
    onPrev: () => {
      requestPage(page - 1)
    },
    totalEntries: paginationMetaData?.totalEntries || 0,
    pageSize: paginationMetaData?.perPage || 0,
    page,
  }

  return (
    <Box {...testIdProps('', false, 'Inbox-page')}>
      <MessageList items={getMessagesListItems(inboxMessages || [], t, onInboxMessagePress)} title={t('secureMessaging.inbox')} />
      <Box mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default Inbox
