import FileViewer from 'react-native-file-viewer'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { SnackbarMessages } from 'components/SnackBar'
import { Events, UserAnalytics } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { READ, UNREAD } from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { AppThunk } from 'store'
import { contentTypes } from 'store/api/api'
import {
  APIError,
  ScreenIDTypes,
  SecureMessagingAttachment,
  SecureMessagingFolderData,
  SecureMessagingFolderList,
  SecureMessagingFolderMap,
  SecureMessagingFolderMessagesMap,
  SecureMessagingFormData,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageData,
  SecureMessagingMessageGetData,
  SecureMessagingMessageList,
  SecureMessagingMessageMap,
  SecureMessagingPaginationMeta,
  SecureMessagingRecipientDataList,
  SecureMessagingSaveDraftData,
  SecureMessagingSignatureDataAttributes,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingThreadGetData,
  SecureMessagingThreads,
} from 'store/api/types'
import {
  getAnalyticsTimers,
  logAnalyticsEvent,
  logNonFatalErrorToFirebase,
  setAnalyticsUserProperty,
} from 'utils/analytics'
import { isErrorObject, showSnackBar } from 'utils/common'
import { getCommonErrorFromAPIError, hasErrorCode } from 'utils/errors'
import { downloadFile, unlinkFile } from 'utils/filesystem'
import { registerReviewEvent } from 'utils/inAppReviews'

import * as api from '../api'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'

const secureMessagingNonFatalErrorString = 'Secure Messaging Service Error'

export type SecureMessagingState = {
  loading: boolean
  loadingInbox: boolean
  loadingFolders: boolean
  loadingAttachments: boolean
  loadingFile: boolean
  loadingFileKey?: string
  hasLoadedRecipients: boolean
  hasLoadedInbox: boolean
  fileDownloadError?: Error
  secureMessagingTab: number
  error?: APIError
  inbox: SecureMessagingFolderData
  inboxMessages: SecureMessagingMessageList
  folders: SecureMessagingFolderList
  folderById: SecureMessagingFolderMap
  messagesByFolderId: SecureMessagingFolderMessagesMap
  messagesById: SecureMessagingMessageMap
  threads: SecureMessagingThreads
  recipients: SecureMessagingRecipientDataList
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
  signature?: SecureMessagingSignatureDataAttributes
  loadingSignature: boolean
  movingMessage: boolean
  isUndo?: boolean
  deleteDraftComplete: boolean
  deleteDraftFailed: boolean
  deletingDraft: boolean
  inboxFirstRetrieval: boolean
}

export const initialSecureMessagingState: SecureMessagingState = {
  loading: false,
  loadingInbox: false,
  loadingFolders: false,
  loadingFile: false,
  loadingFileKey: undefined,
  loadingAttachments: false,
  hasLoadedRecipients: false,
  hasLoadedInbox: false,
  inbox: {} as SecureMessagingFolderData,
  inboxMessages: [] as SecureMessagingMessageList,
  folders: [] as SecureMessagingFolderList,
  folderById: {} as SecureMessagingFolderMap,
  messagesByFolderId: {} as SecureMessagingFolderMessagesMap,
  messagesById: {} as SecureMessagingMessageMap,
  threads: [] as SecureMessagingThreads,
  recipients: [] as SecureMessagingRecipientDataList,
  secureMessagingTab: 0,

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
  loadingSignature: false,
  movingMessage: false,
  isUndo: false,
  deleteDraftComplete: false,
  deleteDraftFailed: false,
  deletingDraft: false,
  inboxFirstRetrieval: true,
}

/**
 * Redux action to fetch the messages thread
 */
export const getThread =
  (messageID: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getThread(messageID))))
    dispatch(dispatchStartGetThread())

    try {
      const excludeProvidedMessage = true
      const response = await api.get<SecureMessagingThreadGetData>(
        `/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=${excludeProvidedMessage}`,
      )
      dispatch(dispatchFinishGetThread({ threadData: response, messageID }))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getThread: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishGetThread({ messageID, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to fetch single message
 */
export const getMessage =
  (
    /** ID of the message we want to fetch */
    messageID: number,
    screenID?: ScreenIDTypes,
    /** Forces an API call.  By default we check the messages map before doing a fetch, but sometimes
     *  we need to refresh or might have only a summary in the map, which doesn't contain attachment info
     */
    force = false,
    /** Set to true if we want to display the inline activity indicator instead of of the one that takes up the whole screen */
    loadingAttachments = false,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessage(messageID))))

    const { demoMode } = getState().demo

    if (loadingAttachments) {
      dispatch(dispatchStartGetAttachmentList())
    } else {
      dispatch(dispatchStartGetMessage({ messageID }))
    }

    try {
      const { messagesById } = getState().secureMessaging
      let response
      // If no message contents, then this messageID was added during fetch folder/inbox message call and does not contain the full info yet
      // Message content of some kind is required on the reply/compose forms.
      if (
        !messagesById?.[messageID] ||
        (messagesById?.[messageID] && !messagesById[messageID].body && !messagesById[messageID].attachments) ||
        force
      ) {
        response = await api.get<SecureMessagingMessageGetData>(`/v0/messaging/health/messages/${messageID}`)
      }

      // If message is unread, refresh inbox to get up to date unreadCount
      if (messagesById?.[messageID] && messagesById[messageID].readReceipt !== READ) {
        if (!demoMode) {
          // dispatch(getInbox(screenID))
        }
      }
      await registerReviewEvent()
      dispatch(dispatchFinishGetMessage({ messageData: response, isDemoMode: demoMode }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getMessage: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishGetMessage({ error, messageId: messageID }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to update the messaging tab
 */
export const updateSecureMessagingTab =
  (secureMessagingTabIndex: number): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateSecureMessagingTab(secureMessagingTabIndex))
  }

export const downloadFileAttachment =
  (file: SecureMessagingAttachment, fileKey: string): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchStartDownloadFileAttachment(fileKey))

    try {
      const filePath = await downloadFile('GET', file.link, file.filename)
      dispatch(dispatchFinishDownloadFileAttachment())

      if (filePath) {
        await FileViewer.open(filePath, {
          onDismiss: async (): Promise<void> => {
            await unlinkFile(filePath)
          },
        })
      }
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `downloadFileAttachment: ${secureMessagingNonFatalErrorString}`)
        /** All download errors will be caught here so there is no special path
         *  for network connection errors
         */
        dispatch(dispatchFinishDownloadFileAttachment(error))
      }
    }
  }

/**
 * Redux action to save draft
 */
export const saveDraft =
  (
    messageData: SecureMessagingFormData,
    messages: SnackbarMessages,
    messageID?: number,
    isReply?: boolean,
    replyID?: number,
    refreshFolder?: boolean,
  ): AppThunk =>
  async (dispatch, getState) => {
    const retryFunction = () => dispatch(saveDraft(messageData, messages, messageID, isReply, replyID, refreshFolder))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartSaveDraft())
    try {
      let response
      if (messageID) {
        const url = isReply
          ? `/v0/messaging/health/message_drafts/${replyID}/replydraft/${messageID}`
          : `/v0/messaging/health/message_drafts/${messageID}`
        response = await api.put<SecureMessagingSaveDraftData>(url, messageData as unknown as api.Params)
      } else {
        const url = isReply
          ? `/v0/messaging/health/message_drafts/${replyID}/replydraft`
          : '/v0/messaging/health/message_drafts'
        response = await api.post<SecureMessagingSaveDraftData>(url, messageData as unknown as api.Params)
      }
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_sm_save_draft(totalTime, actionTime, messageData.category))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveDraft({ messageID: Number(response?.data?.id) }))
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `saveDraft: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishSaveDraft({ error }))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action to send message
 */
export const sendMessage =
  (
    messageData: SecureMessagingFormData,
    messages: SnackbarMessages,
    uploads?: Array<ImagePickerResponse | DocumentPickerResponse>,
    replyToID?: number,
  ): AppThunk =>
  async (dispatch, getState) => {
    let formData: FormData
    let postData
    if (uploads && uploads.length !== 0) {
      formData = new FormData()
      formData.append('message', JSON.stringify(messageData))

      uploads.forEach((attachment) => {
        let nameOfFile: string | undefined
        let typeOfFile: string | undefined
        let uriOfFile: string | undefined

        if ('assets' in attachment) {
          if (attachment.assets && attachment.assets.length > 0) {
            const { fileName, type, uri } = attachment.assets[0]
            nameOfFile = fileName
            typeOfFile = type
            uriOfFile = uri
          }
        } else if ('size' in attachment) {
          const { name, uri, type } = attachment
          nameOfFile = name
          typeOfFile = type
          uriOfFile = uri
        }
        // TODO: figure out why backend-upload reads images as 1 MB more than our displayed size (e.g. 1.15 MB --> 2.19 MB)
        formData.append(
          'uploads[]',
          JSON.parse(
            JSON.stringify({
              name: nameOfFile || '',
              uri: uriOfFile || '',
              type: typeOfFile || '',
            }),
          ),
        )
      })
      postData = formData
    } else {
      postData = messageData
    }
    const retryFunction = () => dispatch(sendMessage(messageData, messages, uploads, replyToID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartSendMessage()) //set loading to true
    try {
      await api.post<SecureMessagingMessageData>(
        replyToID ? `/v0/messaging/health/messages/${replyToID}/reply` : '/v0/messaging/health/messages',
        postData as unknown as api.Params,
        uploads && uploads.length !== 0 ? contentTypes.multipart : undefined,
      )

      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_sm_send_message(totalTime, actionTime, messageData.category, replyToID))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSendMessage(undefined))
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `sendMessage: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishSendMessage(error))
        const isReplyWithTriageError = replyToID && hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, error)
        !isReplyWithTriageError && showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Redux action to delete a saved draft
 */
export const deleteDraft =
  (messageID: number, messages: SnackbarMessages): AppThunk =>
  async (dispatch) => {
    const retryFunction = () => dispatch(deleteDraft(messageID, messages))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartDeleteDraft())

    try {
      await callDeleteMessageApi(messageID)

      dispatch(dispatchFinishDeleteDraft(undefined))
      showSnackBar(messages.successMsg, dispatch, undefined, true, false, true)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `deleteDraft: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishDeleteDraft(error))
        showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true)
      }
    }
  }

/**
 * Delete a message
 */
export const callDeleteMessageApi = async (messageID: number): Promise<void> => {
  await api.del(`/v0/messaging/health/messages/${messageID}`)
}

/**
 * Redux slice that will create the actions and reducers
 */
const secureMessagingSlice = createSlice({
  name: 'secureMessaging',
  initialState: initialSecureMessagingState,
  reducers: {
    dispatchStartGetThread: (state) => {
      state.loading = true
    },

    dispatchFinishGetThread: (
      state,
      action: PayloadAction<{ threadData?: SecureMessagingThreadGetData; messageID?: number; error?: api.APIError }>,
    ) => {
      const { threadData, messageID, error } = action.payload

      let messagesById = state.messagesById
      const threads = state.threads || []

      if (!error && threadData?.data && messageID) {
        const threadIDs = [messageID]
        const threadMap = threadData.data.reduce(
          (map: SecureMessagingMessageMap, message: SecureMessagingMessageData) => {
            map[message.id] = message.attributes
            threadIDs.push(message.attributes.messageId)
            return map
          },
          {},
        )

        messagesById = { ...messagesById, ...threadMap }
        const existingThreadIndex: number = threads.findIndex((t) => t.includes(messageID))
        if (existingThreadIndex !== -1) {
          threads[existingThreadIndex] = threadIDs
        } else {
          threads.push(threadIDs)
        }
      }

      state.messagesById = messagesById
      state.threads = threads
      state.loading = false
      state.loadingAttachments = false
      state.error = error
    },

    dispatchStartGetMessage: (state, action: PayloadAction<Record<string, unknown> | undefined>) => {
      const { messageID, setLoading } = action.payload || {}
      state.loading = setLoading ? true : state.loading
      state.messageIDsOfError = state.messageIDsOfError?.filter((id) => id !== messageID)
    },

    dispatchFinishGetMessage: (
      state,
      action: PayloadAction<{
        messageData?: SecureMessagingMessageGetData
        error?: api.APIError
        messageId?: number
        isDemoMode?: boolean
      }>,
    ) => {
      const { messageId, messageData, error, isDemoMode } = action.payload

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

        state.messagesById[messageID] = message

        // Find the inbox message (type SecureMessagingMessageData) that contains matching messageId in its attributes.
        const inboxMessage = state.inboxMessages.find((m) => {
          // TODO: Figure out why the comparison fails without toString() even though they're both numbers
          return m.attributes.messageId.toString() === messageID.toString()
        })

        // Change message's readReceipt to read
        if (inboxMessage) {
          if (isDemoMode && inboxMessage.attributes.readReceipt === UNREAD) {
            state.inbox.attributes.unreadCount -= 1
          }

          inboxMessage.attributes.readReceipt = READ
        }
      }

      state.messageIDsOfError = state.messageIDsOfError ? state.messageIDsOfError : []
      error && messageId && state.messageIDsOfError.push(messageId)
      state.loading = false
      state.loadingAttachments = false
      state.error = error
    },

    dispatchStartGetAttachmentList: (state) => {
      state.loadingAttachments = true
    },

    dispatchStartDownloadFileAttachment: (state, action: PayloadAction<string>) => {
      const fileKey = action.payload

      state.fileDownloadError = undefined
      state.loadingFile = true
      state.loadingFileKey = fileKey //payload is the attachment list id of the file that is being downloaded
    },

    dispatchFinishDownloadFileAttachment: (state, action: PayloadAction<Error | undefined>) => {
      const error = action.payload

      return {
        ...state,
        fileDownloadError: error,
        loadingFile: false,
        loadingFileKey: undefined,
      }
    },

    dispatchStartSaveDraft: (state) => {
      state.savingDraft = true
    },

    dispatchFinishSaveDraft: (state, action: PayloadAction<{ messageID?: number; error?: api.APIError }>) => {
      const { messageID, error } = action.payload
      return {
        ...state,
        savedDraftID: messageID,
        error,
        saveDraftFailed: !!error,
        saveDraftComplete: !error,
        savingDraft: false,
      }
    },

    resetSaveDraftComplete: (state) => {
      state.savedDraftID = undefined
      state.saveDraftComplete = false
    },

    resetSaveDraftFailed: (state) => {
      state.saveDraftComplete = false
      state.saveDraftFailed = false
    },

    dispatchStartSendMessage: (state) => {
      state.sendingMessage = true
    },

    dispatchFinishSendMessage: (state, action: PayloadAction<api.APIError | undefined>) => {
      const error = action?.payload
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

    resetSendMessageComplete: (state) => {
      state.sendMessageComplete = false
    },

    resetSendMessageFailed: (state) => {
      state.sendMessageComplete = false
      state.sendMessageFailed = false
    },

    dispatchClearLoadedMessages: () => {
      return { ...initialSecureMessagingState }
    },

    resetReplyTriageError: (state) => {
      state.replyTriageError = false
    },

    resetHasLoadedRecipients: (state) => {
      state.hasLoadedRecipients = false
    },

    dispatchStartDeleteDraft: (state) => {
      state.deletingDraft = true
    },

    dispatchFinishDeleteDraft: (state, action: PayloadAction<api.APIError | undefined>) => {
      const error = action.payload
      state.deletingDraft = false
      state.deleteDraftComplete = !error
      state.deleteDraftFailed = !!error
    },

    dispatchResetDeleteDraftComplete: (state) => {
      state.deleteDraftComplete = false
    },

    dispatchResetDeleteDraftFailed: (state) => {
      state.deleteDraftComplete = false
      state.deleteDraftFailed = false
    },

    dispatchUpdateSecureMessagingTab: (state, action: PayloadAction<number>) => {
      state.secureMessagingTab = action.payload
    },
  },
})

export const {
  dispatchFinishGetThread,
  dispatchStartGetThread,
  dispatchFinishGetMessage,
  dispatchStartGetAttachmentList,
  dispatchStartGetMessage,
  dispatchUpdateSecureMessagingTab,
  dispatchStartDownloadFileAttachment,
  dispatchFinishDownloadFileAttachment,
  dispatchFinishSaveDraft,
  dispatchStartSaveDraft,
  resetSaveDraftComplete,
  resetSaveDraftFailed,
  dispatchFinishSendMessage,
  dispatchStartSendMessage,
  resetSendMessageComplete,
  resetSendMessageFailed,
  dispatchClearLoadedMessages,
  resetHasLoadedRecipients,
  resetReplyTriageError,
  dispatchFinishDeleteDraft,
  dispatchResetDeleteDraftComplete,
  dispatchResetDeleteDraftFailed,
  dispatchStartDeleteDraft,
} = secureMessagingSlice.actions

export default secureMessagingSlice.reducer
