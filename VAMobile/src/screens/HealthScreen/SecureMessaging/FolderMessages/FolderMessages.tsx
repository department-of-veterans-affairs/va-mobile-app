import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { Box, ErrorComponent, LoadingComponent, MessageList, Pagination, PaginationProps, VAScrollView } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { useError, useTheme, useTranslation } from 'utils/hooks'

import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { getMessagesListItems } from 'utils/secureMessaging'
import { listFolderMessages } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import ComposeMessageFooter from '../ComposeMessageFooter/ComposeMessageFooter'
import NoFolderMessages from '../NoFolderMessages/NoFolderMessages'

type FolderMessagesProps = StackScreenProps<HealthStackParamList, 'FolderMessages'>

const FolderMessages: FC<FolderMessagesProps> = ({ navigation, route }) => {
  const { folderID, folderName } = route.params

  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()
  const theme = useTheme()
  const { messagesByFolderId, loading, paginationMetaByFolderId } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)
  const trackedPagination = [SecureMessagingSystemFolderIdConstants.SENT, SecureMessagingSystemFolderIdConstants.DRAFTS]

  useEffect(() => {
    // Load first page messages
    dispatch(listFolderMessages(folderID, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
  }, [dispatch, folderID])

  const onMessagePress = (messageID: number, isDraft?: boolean): void => {
    const screen = isDraft ? 'EditDraft' : 'ViewMessageScreen'
    const args = isDraft ? { messageID, attachmentFileToAdd: {}, attachmentFileToRemove: {} } : { messageID }
    navigation.navigate(screen, args)
  }

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.messages.loading')} />
  }

  const folderMessages = messagesByFolderId ? messagesByFolderId[folderID] : { data: [], links: {}, meta: {} }
  const messages = folderMessages ? folderMessages.data : []

  if (messages.length === 0) {
    return <NoFolderMessages folderName={folderName} />
  }

  const requestPage = (requestedPage: number) => {
    // request the next page
    dispatch(listFolderMessages(folderID, requestedPage, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
  }

  // Render pagination for sent and drafts folderMessages only
  const renderPagination = (): ReactNode => {
    if (!trackedPagination.includes(folderID)) {
      return <></>
    }

    const paginationMetaData = paginationMetaByFolderId?.[folderID]
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
      <Box flex={1} mt={theme.dimensions.paginationTopPadding} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Pagination {...paginationProps} />
      </Box>
    )
  }

  return (
    <>
      <VAScrollView {...testIdProps('', false, 'FolderMessages-page')}>
        <MessageList items={getMessagesListItems(messages, t, onMessagePress, folderName)} title={folderName} />
        {renderPagination()}
      </VAScrollView>
      <ComposeMessageFooter />
    </>
  )
}

export default FolderMessages
