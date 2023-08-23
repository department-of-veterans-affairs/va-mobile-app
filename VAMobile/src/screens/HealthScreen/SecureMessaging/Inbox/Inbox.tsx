import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LoadingComponent, MessageList, Pagination, PaginationProps } from 'components'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, fetchInboxMessages } from 'store/slices'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types/SecureMessagingData'
import { getMessagesListItems } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'

type InboxProps = Record<string, unknown>

const Inbox: FC<InboxProps> = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { inboxMessages, loadingInbox, paginationMetaByFolderId } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
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
    tab: 'inbox messages',
  }

  return (
    <Box {...testIdProps('', false, 'Inbox-page')}>
      <MessageList items={getMessagesListItems(inboxMessages || [], t, onInboxMessagePress, FolderNameTypeConstants.inbox)} title={t('secureMessaging.inbox')} />
      <Box mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    </Box>
  )
}

export default Inbox
