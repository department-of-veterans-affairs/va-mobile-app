import _ from 'underscore'

import { FolderMap, FolderMessagesMap, SecureMessageMap, SecureMessageSummaryData, SecureMessagesList, SecureMessagingFolderList } from 'store/api'
import createReducer from './createReducer'

export type SecureMessagingState = {
  loading: boolean
  error?: Error
  message?: SecureMessageSummaryData
  inboxMessages?: SecureMessagesList
  folders?: SecureMessagingFolderList
  folderById?: FolderMap
  messagesByFolderId?: FolderMessagesMap
  messagesById?: SecureMessageMap
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  message: {} as SecureMessageSummaryData,
  inboxMessages: [] as SecureMessagesList,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as FolderMap,
  messagesByFolderId: {} as FolderMessagesMap,
  messagesById: {} as SecureMessageMap,
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
  SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES: (state, { messageData, folderID, error }) => {
    // TODO is this sufficient deepness of copying?
    const messageMap = Object.assign({}, state.messagesByFolderId, { folderID: messageData })

    return {
      ...state,
      messagesByFolderId: messageMap,
      loading: false,
    }
  },
})
