import {
  APIError,
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
import { READ } from 'constants/secureMessaging'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { hasErrorCode } from 'utils/errors'
import createReducer from './createReducer'

// which folders to track pagination on
const trackedPagination = [SecureMessagingSystemFolderIdConstants.SENT, SecureMessagingSystemFolderIdConstants.DRAFTS]

export type SecureMessagingState = {
  loading: boolean
  loadingAttachments: boolean
  loadingFile: boolean
  loadingFileKey?: string
  hasLoadedRecipients: boolean
  hasLoadedInbox: boolean
  fileDownloadError?: Error
  secureMessagingTab?: SecureMessagingTabTypes
  error?: APIError
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
  saveDraftComplete: boolean
  saveDraftFailed: boolean
  savingDraft: boolean
  savedDraftID?: number
  sendMessageComplete: boolean
  sendMessageFailed: boolean
  sendingMessage: boolean
  replyTriageError: boolean
  termsAndConditionError: boolean
  messageIDsOfError?: Array<number>
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  loadingFile: false,
  loadingFileKey: undefined,
  loadingAttachments: false,
  hasLoadedRecipients: false,
  hasLoadedInbox: false,
  inbox: {} as SecureMessagingFolderData,
  inboxMessages: undefined,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as SecureMessagingFolderMap,
  messagesByFolderId: {} as SecureMessagingFolderMessagesMap,
  messagesById: {} as SecureMessagingMessageMap,
  threads: [] as SecureMessagingThreads,
  recipients: [] as SecureMessagingRecipientDataList,
  paginationMetaByFolderId: {
    [SecureMessagingSystemFolderIdConstants.INBOX]: {} as SecureMessagingPaginationMeta,
    [SecureMessagingSystemFolderIdConstants.SENT]: {} as SecureMessagingPaginationMeta,
    [SecureMessagingSystemFolderIdConstants.DRAFTS]: {} as SecureMessagingPaginationMeta,
  },
  saveDraftComplete: false,
  saveDraftFailed: false,
  savingDraft: false,
  sendMessageComplete: false,
  sendMessageFailed: false,
  sendingMessage: false,
  replyTriageError: false,
  termsAndConditionError: false,
  messageIDsOfError: undefined,
}

export default createReducer<SecureMessagingState>(initialSecureMessagingState, {
  SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES: (state, payload) => {
    return {
      ...state,
      ...payload,
      inboxMessages: undefined,
      loading: true,
    }
  },
  SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES: (state, { inboxMessages, error }) => {
    const messages = inboxMessages?.data
    const termsAndConditionError = hasErrorCode(SecureMessagingErrorCodesConstants.TERMS_AND_CONDITIONS, error)
    const messagesById = messages?.reduce(
      (obj, m) => {
        obj[m.attributes.messageId] = m.attributes
        return obj
      },
      { ...state.messagesById },
    )

    return {
      ...state,
      inboxMessages: messages,
      // TODO add to folderMessagesById(0)
      // TODO inject folderId?
      messagesById,
      loading: false,
      error,
      paginationMetaByFolderId: {
        ...state.paginationMetaByFolderId,
        [SecureMessagingSystemFolderIdConstants.INBOX]: inboxMessages?.meta?.pagination,
      },
      termsAndConditionError,
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

    // only track sent and drafts messages for now
    if (trackedPagination.includes(folderID)) {
      updatedPaginationMeta = {
        ...state.paginationMetaByFolderId,
        [folderID]: messageData?.meta?.pagination,
      }
    }

    const messagesById = messageData?.data.reduce(
      (obj, m) => {
        obj[m.attributes.messageId] = m.attributes
        return obj
      },
      { ...state.messagesById },
    )

    return {
      ...state,
      messagesByFolderId: messageMap,
      messagesById,
      loading: false,
      error,
      paginationMetaByFolderId: updatedPaginationMeta,
    }
  },
  SECURE_MESSAGING_START_GET_INBOX: (state, payload) => {
    return {
      ...state,
      ...payload,
      hasLoadedInbox: false,
    }
  },
  SECURE_MESSAGING_FINISH_GET_INBOX: (state, { inboxData, error }) => {
    return {
      ...state,
      inbox: inboxData?.data,
      hasLoadedInbox: true,
      error,
    }
  },
  SECURE_MESSAGING_START_GET_MESSAGE: (state, { setLoading }) => {
    return {
      ...state,
      loading: setLoading ? true : state.loading,
    }
  },
  SECURE_MESSAGING_FINISH_GET_MESSAGE: (state, { messageData, error, messageId }) => {
    let messagesById = state.messagesById
    const updatedInboxMessages = [...(state.inboxMessages || [])]

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
      messagesById && messagesById[messageID] ? (messagesById[messageID] = message) : (messagesById = { ...state.messagesById, [messageID]: message })

      // Find the inbox message (type SecureMessagingMessageData) that contains matching messageId in its attributes.
      const inboxMessage = updatedInboxMessages.find((m) => {
        // TODO: Figure out why the comparison fails without toString() even though they're both numbers
        return m.attributes.messageId.toString() === messageID.toString()
      })

      // Change message's readReceipt to read
      if (inboxMessage) {
        inboxMessage.attributes.readReceipt = READ
      }
    }

    const stateMessageIDsOfError = state.messageIDsOfError ? state.messageIDsOfError : []
    error && messageId && stateMessageIDsOfError.push(messageId)

    return {
      ...state,
      messagesById,
      loading: false,
      loadingAttachments: false,
      inboxMessages: updatedInboxMessages,
      messageIDsOfError: stateMessageIDsOfError,
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
      hasLoadedRecipients: false,
    }
  },
  SECURE_MESSAGING_FINISH_GET_RECIPIENTS: (state, { recipients, error }) => {
    return {
      ...state,
      recipients,
      error,
      hasLoadedRecipients: true,
    }
  },
  SECURE_MESSAGING_CLEAR_LOADED_MESSAGES: () => {
    return initialSecureMessagingState
  },
  SECURE_MESSAGING_START_SAVE_DRAFT: (state, payload) => {
    return {
      ...state,
      ...payload,
      savingDraft: true,
    }
  },
  SECURE_MESSAGING_FINISH_SAVE_DRAFT: (state, { messageID, error }) => {
    return {
      ...state,
      savedDraftID: messageID,
      error,
      saveDraftFailed: !!error,
      saveDraftComplete: !error,
      savingDraft: false,
    }
  },
  SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE: (state) => {
    return {
      ...state,
      savedDraftID: undefined,
      saveDraftComplete: false,
    }
  },
  SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED: (state) => {
    return {
      ...state,
      saveDraftComplete: false,
      saveDraftFailed: false,
    }
  },
  SECURE_MESSAGING_START_SEND_MESSAGE: (state, payload) => {
    return {
      ...state,
      ...payload,
      sendingMessage: true,
    }
  },
  SECURE_MESSAGING_FINISH_SEND_MESSAGE: (state, { error }) => {
    // error is triage error
    const replyTriageError = hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, error)
    return {
      ...state,
      error,
      sendMessageFailed: !!error,
      sendMessageComplete: !error,
      sendingMessage: false,
      replyTriageError,
    }
  },
  SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE: (state) => {
    return {
      ...state,
      sendMessageComplete: false,
    }
  },
  SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED: (state) => {
    return {
      ...state,
      sendMessageComplete: false,
      sendMessageFailed: false,
    }
  },
  SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR: (state) => {
    return {
      ...state,
      replyTriageError: false,
    }
  },

  SECURE_MESSAGING_RESET_HAS_LOADED_RECIPIENTS: (state) => {
    return {
      ...state,
      hasLoadedRecipients: false,
    }
  },
})
