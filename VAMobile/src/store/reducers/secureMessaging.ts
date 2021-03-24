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
  SecureMessagingThreads,
} from 'store/api'
import createReducer from './createReducer'

export type SecureMessagingState = {
  loading: boolean
  loadingAttachments: boolean
  error?: Error
  inbox?: SecureMessagingFolderData
  inboxMessages?: SecureMessagingMessageList
  folders?: SecureMessagingFolderList
  folderById?: SecureMessagingFolderMap
  messagesByFolderId?: SecureMessagingFolderMessagesMap
  messagesById?: SecureMessagingMessageMap
  threads?: SecureMessagingThreads
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  loadingAttachments: false,
  inbox: {} as SecureMessagingFolderData,
  inboxMessages: [] as SecureMessagingMessageList,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as SecureMessagingFolderMap,
  messagesByFolderId: {} as SecureMessagingFolderMessagesMap,
  messagesById: {} as SecureMessagingMessageMap,
  threads: [] as SecureMessagingThreads,
}

export default createReducer<SecureMessagingState>(initialSecureMessagingState, {
  SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES: (state, { inboxMessages, error }) => {
    const messages = inboxMessages?.data

    return {
      ...state,
      inboxMessages: messages,
      // TODO add to folderMessagesById(0)
      // TODO map messages by Id and inject folderId?
      loading: false,
      error,
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
      folders: folderData?.data,
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
  SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES: (state, { messageData, error }) => {
    // TODO is this sufficient deepness of copying?
    const messageMap = Object.assign({}, state.messagesByFolderId, { folderID: messageData })

    return {
      ...state,
      messagesByFolderId: messageMap,
      loading: false,
      error,
    }
  },
  SECURE_MESSAGING_START_GET_INBOX: (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
  SECURE_MESSAGING_FINISH_GET_INBOX: (state, { inboxData, error }) => {
    return {
      ...state,
      inbox: inboxData?.data,
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

    if (!error && messageData?.data) {
      const messageID = messageData.data.id
      const message: SecureMessagingMessageAttributes = messageData.data.attributes
      const includedAttachments = messageData.included?.filter((included) => included.type === 'attachments')

      if (includedAttachments?.length) {
        const attachments: Array<SecureMessagingAttachment> = includedAttachments.map((attachment) => ({
          id: attachment.id,
          filename: attachment.attributes.name,
          link: attachment.links.download,
        }))

        message.attachments = attachments
      }
      messagesById = { ...state.messagesById, [messageID]: message }
    }

    return {
      ...state,
      messagesById,
      loading: false,
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
})
