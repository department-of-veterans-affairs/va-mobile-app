import {
  SecureMessagingFolderData,
  SecureMessagingFolderList,
  SecureMessagingFolderMap,
  SecureMessagingFolderMessagesMap,
  SecureMessagingMessageList,
  SecureMessagingMessageMap,
} from 'store/api'
import createReducer from './createReducer'

export type SecureMessagingState = {
  loading: boolean
  error?: Error
  inbox?: SecureMessagingFolderData
  inboxMessages?: SecureMessagingMessageList
  folders?: SecureMessagingFolderList
  folderById?: SecureMessagingFolderMap
  messagesByFolderId?: SecureMessagingFolderMessagesMap
  messagesById?: SecureMessagingMessageMap
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  inbox: {} as SecureMessagingFolderData,
  inboxMessages: [] as SecureMessagingMessageList,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as SecureMessagingFolderMap,
  messagesByFolderId: {} as SecureMessagingFolderMessagesMap,
  messagesById: {} as SecureMessagingMessageMap,
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
  SECURE_MESSAGING_START_GET_MESSAGE_THREAD: (state) => {
    return {
      ...state,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_GET_MESSAGE_THREAD: (state, { error }) => {
    //threadData, messageData
    return {
      ...state,
      loading: false,
      error,
    }
  },
})
