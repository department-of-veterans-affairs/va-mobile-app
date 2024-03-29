import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useFolderMessages } from 'api/secureMessaging'
import { SecureMessagingMessageList } from 'api/types'
import {
  Box,
  ChildTemplate,
  ErrorComponent,
  LoadingComponent,
  MessageList,
  Pagination,
  PaginationProps,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { getMessagesListItems } from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoFolderMessages from '../NoFolderMessages/NoFolderMessages'

type FolderMessagesProps = StackScreenProps<HealthStackParamList, 'FolderMessages'>

function FolderMessages({ route }: FolderMessagesProps) {
  const { folderID, folderName } = route.params

  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const [page, setPage] = useState(1)
  const {
    data: folderMessagesData,
    isLoading: loadingFolderMessages,
    isError: folderMessagesError,
  } = useFolderMessages(folderID, page, {
    enabled: screenContentAllowed('WG_FolderMessages'),
  })
  const messages = folderMessagesData?.data || ([] as SecureMessagingMessageList)
  const paginationMetaData = folderMessagesData?.meta.pagination
  const title = t('text.raw', { text: folderName })

  const onMessagePress = (messageID: number, isDraft?: boolean): void => {
    const screen = isDraft ? 'EditDraft' : 'ViewMessage'
    const args = isDraft
      ? { messageID, attachmentFileToAdd: {}, attachmentFileToRemove: {} }
      : { messageID, folderID, currentPage: paginationMetaData?.currentPage || 1, messagesLeft: messages.length }

    navigateTo(screen, args)
  }

  if (folderMessagesError) {
    return (
      <ChildTemplate
        backLabel={t('messages')}
        backLabelOnPress={() => {
          navigateTo('SecureMessaging', { activeTab: 1 })
        }}
        title={title}>
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID} />
      </ChildTemplate>
    )
  }

  if (loadingFolderMessages) {
    const text = t('secureMessaging.messages.loading')
    return (
      <ChildTemplate
        backLabel={t('messages')}
        backLabelOnPress={() => {
          navigateTo('SecureMessaging', { activeTab: 1 })
        }}
        title={title}>
        <LoadingComponent text={text} />
      </ChildTemplate>
    )
  }

  if (messages.length === 0) {
    return (
      <ChildTemplate
        backLabel={t('messages')}
        backLabelOnPress={() => {
          navigateTo('SecureMessaging', { activeTab: 1 })
        }}
        title={title}>
        <NoFolderMessages />
      </ChildTemplate>
    )
  }

  function renderPagination() {
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
      tab: 'folder messages',
    }

    return (
      <Box
        flex={1}
        mt={theme.dimensions.paginationTopPadding}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigateTo('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  return (
    <ChildTemplate
      backLabel={t('messages')}
      backLabelOnPress={() => {
        navigateTo('SecureMessaging', { activeTab: 1 })
      }}
      title={title}>
      <Box mx={theme.dimensions.buttonPadding}>
        <Button label={t('secureMessaging.startNewMessage')} onPress={onPress} testID={'startNewMessageButtonTestID'} />
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <MessageList items={getMessagesListItems(messages, t, onMessagePress, folderName)} />
      </Box>
      {renderPagination()}
    </ChildTemplate>
  )
}

export default FolderMessages
