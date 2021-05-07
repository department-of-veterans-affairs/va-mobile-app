import { READ } from 'constants/secureMessaging'
import {
  SecureMessagingAttachment,
  SecureMessagingFolderData,
  SecureMessagingFolderList,
  SecureMessagingFolderMap,
  SecureMessagingFolderMessagesMap,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageData,
  SecureMessagingMessageList,
  SecureMessagingMessageMap,
  SecureMessagingPaginationMeta,
  SecureMessagingRecipientDataList,
  SecureMessagingTabTypes,
  SecureMessagingThreads,
} from 'store/api'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import createReducer from './createReducer'

export type SecureMessagingState = {
  loading: boolean
  loadingAttachments: boolean
  loadingFile: boolean
  loadingFileKey?: string
  loadingRecipients?: boolean
  fileDownloadError?: Error
  secureMessagingTab?: SecureMessagingTabTypes
  error?: Error
  inbox?: SecureMessagingFolderData
  inboxMessages?: SecureMessagingMessageList
  folders?: SecureMessagingFolderList
  folderById?: SecureMessagingFolderMap
  messagesByFolderId?: SecureMessagingFolderMessagesMap
  messagesById?: SecureMessagingMessageMap
  threads?: SecureMessagingThreads
  recipients?: SecureMessagingRecipientDataList
  paginationMetaByFolderId?: {
    [key: number]: SecureMessagingPaginationMeta | undefined
  }
  sendMessageComplete: boolean
  sendingMessage: boolean
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  loadingFile: false,
  loadingFileKey: undefined,
  loadingAttachments: false,
  loadingRecipients: false,
  inbox: {} as SecureMessagingFolderData,
  inboxMessages: [] as SecureMessagingMessageList,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as SecureMessagingFolderMap,
  messagesByFolderId: {} as SecureMessagingFolderMessagesMap,
  messagesById: {} as SecureMessagingMessageMap,
  threads: [] as SecureMessagingThreads,
  recipients: [] as SecureMessagingRecipientDataList,
  paginationMetaByFolderId: {
    [SecureMessagingSystemFolderIdConstants.INBOX]: {} as SecureMessagingPaginationMeta,
    [SecureMessagingSystemFolderIdConstants.SENT]: {} as SecureMessagingPaginationMeta,
  },
  sendMessageComplete: false,
  sendingMessage: false,
}

export default createReducer<SecureMessagingState>(initialSecureMessagingState, {
  SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES: (state, { inboxMessages, error }) => {
    const messages = inboxMessages?.data

    return {
      ...state,
      inboxMessages: messages,
      // TODO add to folderMessagesById(0)
      // TODO map messages by Id and inject folderId?
      loading: false,
      error,
      paginationMetaByFolderId: {
        ...state.paginationMetaByFolderId,
        [SecureMessagingSystemFolderIdConstants.INBOX]: inboxMessages?.meta?.pagination,
      },
    }
  },
  SECURE_MESSAGING_START_LIST_FOLDERS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_LIST_FOLDERS: (state, { folderData }) => {
    return {
      ...state,
      folders: folderData?.data || state.folders,
      // TODO map to foldersbyId
      loading: false,
    }
  },
  SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES: (state, { messageData, folderID, error }) => {
    const messageMap = {
      ...state.messagesByFolderId,
      [folderID]: messageData,
    }
    let updatedPaginationMeta = {
      ...state.paginationMetaByFolderId,
    }

    // only track sent messages for now
    if (folderID === SecureMessagingSystemFolderIdConstants.SENT) {
      updatedPaginationMeta = {
        ...state.paginationMetaByFolderId,
        [SecureMessagingSystemFolderIdConstants.SENT]: messageData?.meta?.pagination,
      }
    }

    return {
      ...state,
      messagesByFolderId: messageMap,
      loading: false,
      error,
      paginationMetaByFolderId: updatedPaginationMeta,
    }
  },
  SECURE_MESSAGING_START_GET_INBOX: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_GET_INBOX: (state, { inboxData, error }) => {
    return {
      ...state,
      inbox: inboxData?.data,
      loading: false,
      error,
    }
  },
  SECURE_MESSAGING_START_GET_MESSAGE: (state, { setLoading }) => {
    return {
      ...state,
      loading: setLoading ? true : state.loading,
    }
  },
  SECURE_MESSAGING_FINISH_GET_MESSAGE: (state, { messageData, error }) => {
    let messagesById = state.messagesById
    const updatedInboxMessages = [...(state.inboxMessages || [])]
    const updatedInbox = { ...(state.inbox || { attributes: { unreadCount: 0 } }) }

    if (!error && messageData?.data) {
      const messageID = messageData.data.id
      const message: SecureMessagingMessageAttributes = messageData.data.attributes
      const includedAttachments = messageData.included?.filter((included) => included.type === 'attachments')

      if (includedAttachments?.length) {
        const attachments: Array<SecureMessagingAttachment> = includedAttachments.map((attachment) => ({
          id: attachment.id,
          filename: attachment.attributes.name,
          link: attachment.links.download,
          size: attachment.attributes.attachmentSize,
        }))

        message.attachments = attachments
      }
      messagesById = { ...state.messagesById, [messageID]: message }

      // Find the inbox message (type SecureMessagingMessageData) that contains matching messageId in its attributes.
      const inboxMessage = updatedInboxMessages.find((m) => {
        // TODO: Figure out why the comparison fails without toString() even though they're both numbers
        return m.attributes.messageId.toString() === messageID.toString()
      })
      const isUnread = inboxMessage?.attributes.readReceipt !== READ
      // If the message is unread, change message's readReceipt to read, decrement inbox unreadCount
      if (inboxMessage && isUnread) {
        inboxMessage.attributes.readReceipt = READ
        updatedInbox.attributes.unreadCount -= 1
      }
    }
    const inbox = state.inbox || ({} as SecureMessagingFolderData)
    return {
      ...state,
      messagesById,
      loading: false,
      inboxMessages: updatedInboxMessages,
      inbox: {
        ...inbox,
        attributes: {
          ...inbox?.attributes,
          unreadCount: updatedInbox.attributes.unreadCount || 0,
        },
      },
      error,
    }
  },
  SECURE_MESSAGING_START_GET_ATTACHMENT_LIST: (state) => {
    return {
      ...state,
      loadingAttachments: true,
    }
  },
  SECURE_MESSAGING_START_GET_THREAD: (state) => {
    return {
      ...state,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_GET_THREAD: (state, { threadData, messageID, error }) => {
    let messagesById = state.messagesById
    const threads = state.threads || []

    if (!error && threadData?.data && messageID) {
      const threadIDs = [messageID]
      const threadMap = threadData.data.reduce((map: SecureMessagingMessageMap, message: SecureMessagingMessageData) => {
        map[message.id] = message.attributes
        threadIDs.push(message.attributes.messageId)
        return map
      }, {})

      messagesById = { ...messagesById, ...threadMap }
      const existingThreadIndex: number = threads.findIndex((t) => t.includes(messageID))
      if (existingThreadIndex !== -1) {
        threads[existingThreadIndex] = threadIDs
      } else {
        threads.push(threadIDs)
      }
    }

    return {
      ...state,
      messagesById,
      threads,
      loading: false,
      loadingAttachments: false,
      error,
    }
  },
  SECURE_MESSAGING_UPDATE_TAB: (state, { secureMessagingTab }) => {
    return {
      ...state,
      secureMessagingTab,
    }
  },
  SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT: (state, payload) => {
    const { fileKey } = payload

    return {
      ...state,
      fileDownloadError: undefined,
      loadingFile: true,
      loadingFileKey: fileKey, //payload is the attachment list id of the file that is being downloaded
    }
  },
  SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT: (state, payload) => {
    const { error } = payload

    return {
      ...state,
      fileDownloadError: error,
      loadingFile: false,
      loadingFileKey: undefined,
    }
  },
  SECURE_MESSAGING_START_GET_RECIPIENTS: (state, payload) => {
    return {
      ...state,
      ...payload,
      loadingRecipients: true,
    }
  },
  SECURE_MESSAGING_FINISH_GET_RECIPIENTS: (state, { recipients, error }) => {
    return {
      ...state,
      recipients,
      error,
      loadingRecipients: false,
    }
  },
  SECURE_MESSAGING_CLEAR_LOADED_MESSAGES: () => {
    return initialSecureMessagingState
  },
  SECURE_MESSAGING_START_SEND_MESSAGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      sendingMessage: true,
    }
  },
  SECURE_MESSAGING_FINISH_SEND_MESSAGE: (state, { error }) => {
    return {
      ...state,
      error,
      sendMessageComplete: !error,
      sendingMessage: false,
    }
  },
  SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE: (state) => {
    return {
      ...state,
      sendMessageComplete: false,
    }
  },
})
