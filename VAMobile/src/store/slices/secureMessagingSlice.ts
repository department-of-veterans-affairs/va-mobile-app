import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import FileViewer from 'react-native-file-viewer'

import * as api from '../api'
import {
  APIError,
  ScreenIDTypes,
  ScreenIDTypesConstants,
  SecureMessagingAttachment,
  SecureMessagingFolderData,
  SecureMessagingFolderGetData,
  SecureMessagingFolderList,
  SecureMessagingFolderMap,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFolderMessagesMap,
  SecureMessagingFoldersGetData,
  SecureMessagingFormData,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageData,
  SecureMessagingMessageGetData,
  SecureMessagingMessageList,
  SecureMessagingMessageMap,
  SecureMessagingPaginationMeta,
  SecureMessagingRecipientDataList,
  SecureMessagingRecipients,
  SecureMessagingSaveDraftData,
  SecureMessagingSignatureData,
  SecureMessagingSignatureDataAttributes,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingThreadGetData,
  SecureMessagingThreads,
} from 'store/api/types'
import { AppDispatch, AppThunk } from 'store'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Events, UserAnalytics } from 'constants/analytics'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { Params, contentTypes } from 'store/api/api'
import { READ, UNREAD } from 'constants/secureMessaging'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { SnackbarMessages } from 'components/SnackBar'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { downloadFile, unlinkFile } from 'utils/filesystem'
import { getAnalyticsTimers, logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError, hasErrorCode } from 'utils/errors'
import { isErrorObject, showSnackBar } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'

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
  moveMessageFailed: boolean
  deleteDraftComplete: boolean
  deleteDraftFailed: boolean
  deletingDraft: boolean
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
  moveMessageFailed: false,
  deleteDraftComplete: false,
  deleteDraftFailed: false,
  deletingDraft: false,
}

/**
 * Redux action to fetch inbox messages
 */
export const fetchInboxMessages =
  (page: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(fetchInboxMessages(page, screenID))))
    dispatch(dispatchStartFetchInboxMessages())

    try {
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inboxMessages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
      } as Params)
      dispatch(dispatchFinishFetchInboxMessages({ inboxMessages }))
      dispatch(getInbox())
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `fetchInboxMessages: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishFetchInboxMessages({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }

/**
 * Redux action to get inbox data
 */
export const getInbox =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getInbox(screenID))))
    dispatch(dispatchStartGetInbox())

    try {
      //TODO what is the right refersh logic to ensure we don't invoke the API too frequently
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inbox = await api.get<SecureMessagingFolderGetData>(`/v0/messaging/health/folders/${folderID}`)

      dispatch(dispatchFinishGetInbox({ inboxData: inbox }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getInbox: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishGetInbox({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to fetch the folders
 */
export const listFolders =
  (screenID?: ScreenIDTypes, forceRefresh = false): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolders(screenID))))
    dispatch(dispatchStartListFolders())

    try {
      let folders
      const currentStateFolders = getState().secureMessaging?.folders

      // Since users can't manage folders from within the app, they are unlikely to change
      // within a session.  Prevents multiple fetch calls for folders unless forceRefresh = true
      if (!currentStateFolders?.length || forceRefresh) {
        folders = await api.get<SecureMessagingFoldersGetData>('/v0/messaging/health/folders', { useCache: `${!forceRefresh}` })
      }
      dispatch(dispatchFinishListFolders({ folderData: folders }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `listFolders: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishListFolders({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error, screenID), screenID }))
      }
    }
  }

/**
 * Redux action to fetch folder's messages
 */
export const listFolderMessages =
  (folderID: number, page: number, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolderMessages(folderID, page, screenID))))
    dispatch(dispatchStartListFolderMessages())

    try {
      const messages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
      } as Params)
      dispatch(dispatchFinishListFolderMessages({ folderID: folderID, messageData: messages }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `listFolderMessages: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishListFolderMessages({ folderID: folderID, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
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
      const response = await api.get<SecureMessagingThreadGetData>(`/v1/messaging/health/messages/${messageID}/thread?excludeProvidedMessage=${excludeProvidedMessage}`)
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
      if (!messagesById?.[messageID] || (messagesById?.[messageID] && !messagesById[messageID].body && !messagesById[messageID].attachments) || force) {
        response = await api.get<SecureMessagingMessageGetData>(`/v0/messaging/health/messages/${messageID}`)
      }

      // If message is unread, refresh inbox to get up to date unreadCount
      if (messagesById?.[messageID] && messagesById[messageID].readReceipt !== READ) {
        if (!demoMode) {
          dispatch(getInbox(screenID))
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
 * Redux action to fetch recipients
 */
export const getMessageRecipients =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageRecipients(screenID))))
    dispatch(dispatchStartGetMessageRecipients())

    try {
      const recipientsData = await api.get<SecureMessagingRecipients>('/v0/messaging/health/recipients')
      const preferredList = recipientsData?.data.filter((recipient) => recipient.attributes.preferredTeam)
      dispatch(dispatchFinishGetMessageRecipients({ recipients: preferredList }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getMessageRecipients: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishGetMessageRecipients({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to fetch user signature
 */
export const getMessageSignature =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageSignature(screenID))))
    dispatch(dispatchStartGetMessageSignature())

    try {
      const signatureData = await api.get<SecureMessagingSignatureData>('/v0/messaging/health/messages/signature')
      const signature = signatureData?.data.attributes
      dispatch(dispatchFinishGetMessageSignature({ signature }))
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getMessageSignature: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishGetMessageSignature({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux action to save draft
 */
export const saveDraft =
  (messageData: SecureMessagingFormData, messages: SnackbarMessages, messageID?: number, isReply?: boolean, replyID?: number, refreshFolder?: boolean): AppThunk =>
  async (dispatch, getState) => {
    const retryFunction = () => dispatch(saveDraft(messageData, messages, messageID, isReply, replyID, refreshFolder))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartSaveDraft())
    try {
      let response
      if (messageID) {
        const url = isReply ? `/v0/messaging/health/message_drafts/${replyID}/replydraft/${messageID}` : `/v0/messaging/health/message_drafts/${messageID}`
        response = await api.put<SecureMessagingSaveDraftData>(url, messageData as unknown as api.Params)
      } else {
        const url = isReply ? `/v0/messaging/health/message_drafts/${replyID}/replydraft` : '/v0/messaging/health/message_drafts'
        response = await api.post<SecureMessagingSaveDraftData>(url, messageData as unknown as api.Params)
      }
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_sm_save_draft(totalTime, actionTime, messageData.category))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveDraft({ messageID: Number(response?.data?.id) }))

      if (refreshFolder) {
        dispatch(listFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      }
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
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
  (messageData: SecureMessagingFormData, messages: SnackbarMessages, uploads?: Array<ImagePickerResponse | DocumentPickerResponse>, replyToID?: number): AppThunk =>
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
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
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

const refreshFoldersAfterMove = (
  dispatch: AppDispatch,
  messages: SnackbarMessages,
  messageID: number,
  newFolderID: number,
  currentFolderID: number,
  folderToRefresh: number,
  currentPage: number,
  messagesLeft: number,
  isUndo: boolean,
  folders: SecureMessagingFolderList,
) => {
  const page = currentPage === 1 ? currentPage : messagesLeft === 1 && isUndo === false ? currentPage - 1 : currentPage
  const folderScreenID = ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID

  if (folderToRefresh === SecureMessagingSystemFolderIdConstants.INBOX) {
    dispatch(fetchInboxMessages(page, folderScreenID))
  } else {
    dispatch(listFolderMessages(folderToRefresh, page, folderScreenID))
  }

  dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
  dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID, true))
  dispatch(dispatchFinishMoveMessage({ isUndo }))

  showSnackBar(
    isUndo && messages.undoMsg ? messages.undoMsg : messages.successMsg,
    dispatch,
    () => {
      dispatch(moveMessage(messages, messageID, currentFolderID, newFolderID, folderToRefresh, currentPage, messagesLeft, true, folders))
    },
    isUndo,
    false,
    true,
  )
}

/**
 * Redux action to move message to another folder or to the trash
 */
export const moveMessage =
  (
    messages: SnackbarMessages,
    messageID: number,
    newFolderID: number,
    currentFolderID: number,
    folderToRefresh: number,
    currentPage: number,
    messagesLeft: number,
    isUndo: boolean,
    folders: SecureMessagingFolderList,
  ): AppThunk =>
  async (dispatch) => {
    const retryFunction = () => dispatch(moveMessage(messages, messageID, newFolderID, currentFolderID, folderToRefresh, currentPage, messagesLeft, isUndo, folders))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartMoveMessage(isUndo))

    try {
      if (newFolderID === SecureMessagingSystemFolderIdConstants.DELETED) {
        await callDeleteMessageApi(messageID)
      } else {
        await callMoveMessageApi(messageID, newFolderID)
      }

      const folder = (): string => {
        switch (newFolderID) {
          case SecureMessagingSystemFolderIdConstants.SENT:
            return 'sent'
          case SecureMessagingSystemFolderIdConstants.INBOX:
            return 'inbox'
          case SecureMessagingSystemFolderIdConstants.DELETED:
            return 'deleted'
          case SecureMessagingSystemFolderIdConstants.DRAFTS:
            return 'drafts'
          default:
            return 'custom'
        }
      }

      await logAnalyticsEvent(Events.vama_sm_move_outcome(folder()))
      refreshFoldersAfterMove(dispatch, messages, messageID, newFolderID, currentFolderID, folderToRefresh, currentPage, messagesLeft, isUndo, folders)
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `moveMessage: ${secureMessagingNonFatalErrorString}`)
        dispatch(dispatchFinishMoveMessage({ error }))
        showSnackBar(isUndo && messages.undoErrorMsg ? messages.undoErrorMsg : messages.errorMsg, dispatch, retryFunction, false, true, true)
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

      dispatch(listFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))

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
 * Move a message
 * @param messageID - the messageID number
 * @param newFolderID - the new folder for the message
 */
export const callMoveMessageApi = async (messageID: number, newFolderID: number): Promise<void> => {
  await api.patch(`/v0/messaging/health/messages/${messageID}/move`, { folder_id: newFolderID } as unknown as api.Params)
}

/**
 * Redux slice that will create the actions and reducers
 */
const secureMessagingSlice = createSlice({
  name: 'secureMessaging',
  initialState: initialSecureMessagingState,
  reducers: {
    dispatchStartFetchInboxMessages: (state) => {
      state.loadingInbox = true
    },

    dispatchFinishFetchInboxMessages: (state, action: PayloadAction<{ inboxMessages?: SecureMessagingFolderMessagesGetData; error?: api.APIError }>) => {
      const { inboxMessages, error } = action.payload
      const messages = inboxMessages ? inboxMessages.data : []
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
        loadingInbox: false,
        error,
        paginationMetaByFolderId: {
          ...state.paginationMetaByFolderId,
          [SecureMessagingSystemFolderIdConstants.INBOX]: inboxMessages?.meta?.pagination,
        },
        termsAndConditionError,
      }
    },

    dispatchStartListFolders: (state) => {
      state.loadingFolders = true
    },

    dispatchFinishListFolders: (state, action: PayloadAction<{ folderData?: SecureMessagingFoldersGetData; error?: api.APIError }>) => {
      const { folderData, error } = action.payload
      state.folders = folderData?.data || state.folders
      state.loadingFolders = false
      state.error = error
    },

    dispatchStartGetInbox: (state) => {
      state.hasLoadedInbox = false
    },

    dispatchFinishGetInbox: (state, action: PayloadAction<{ inboxData?: SecureMessagingFolderGetData; error?: api.APIError }>) => {
      const { inboxData, error } = action.payload
      state.inbox = inboxData ? inboxData.data : ({} as SecureMessagingFolderData)
      state.hasLoadedInbox = true
      state.error = error
    },

    dispatchStartListFolderMessages: (state) => {
      state.loading = true
    },

    dispatchFinishListFolderMessages: (state, action: PayloadAction<{ folderID: number; messageData?: SecureMessagingFolderMessagesGetData; error?: api.APIError }>) => {
      const { folderID, messageData, error } = action.payload
      const messageMap = {
        ...state.messagesByFolderId,
        [folderID]: messageData,
      }
      let updatedPaginationMeta = {
        ...state.paginationMetaByFolderId,
      }

      updatedPaginationMeta = {
        ...state.paginationMetaByFolderId,
        [folderID]: messageData?.meta?.pagination,
      }

      const messagesById = messageData
        ? messageData.data.reduce(
            (obj, m) => {
              obj[m.attributes.messageId] = m.attributes
              return obj
            },
            { ...state.messagesById },
          )
        : ({} as SecureMessagingMessageMap)

      state.messagesByFolderId = messageMap
      state.messagesById = messagesById
      state.loading = false
      state.error = error
      state.paginationMetaByFolderId = updatedPaginationMeta
    },

    dispatchStartGetThread: (state) => {
      state.loading = true
    },

    dispatchFinishGetThread: (state, action: PayloadAction<{ threadData?: SecureMessagingThreadGetData; messageID?: number; error?: api.APIError }>) => {
      const { threadData, messageID, error } = action.payload

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

    dispatchFinishGetMessage: (state, action: PayloadAction<{ messageData?: SecureMessagingMessageGetData; error?: api.APIError; messageId?: number; isDemoMode?: boolean }>) => {
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

    dispatchStartGetMessageRecipients: (state) => {
      state.hasLoadedRecipients = false
    },

    dispatchFinishGetMessageRecipients: (state, action: PayloadAction<{ recipients?: SecureMessagingRecipientDataList; error?: api.APIError }>) => {
      const { recipients, error } = action.payload
      return {
        ...state,
        recipients: recipients || [],
        error,
        hasLoadedRecipients: true,
      }
    },

    dispatchStartGetMessageSignature: (state) => {
      state.loadingSignature = true
    },

    dispatchFinishGetMessageSignature: (state, action: PayloadAction<{ signature?: SecureMessagingSignatureDataAttributes; error?: api.APIError }>) => {
      const { signature, error } = action.payload
      return {
        ...state,
        signature,
        error,
        loadingSignature: false,
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

    dispatchStartMoveMessage: (state, action: PayloadAction<boolean>) => {
      state.isUndo = action.payload
      state.movingMessage = true
      state.moveMessageFailed = false
    },

    dispatchFinishMoveMessage: (state, action: PayloadAction<{ isUndo?: boolean; error?: api.APIError }>) => {
      const { isUndo, error } = action.payload
      state.movingMessage = false
      state.isUndo = isUndo
      state.moveMessageFailed = !!error
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
  dispatchFinishFetchInboxMessages,
  dispatchStartFetchInboxMessages,
  dispatchFinishListFolders,
  dispatchStartListFolders,
  dispatchFinishGetInbox,
  dispatchStartGetInbox,
  dispatchFinishListFolderMessages,
  dispatchStartListFolderMessages,
  dispatchFinishGetThread,
  dispatchStartGetThread,
  dispatchFinishGetMessage,
  dispatchStartGetAttachmentList,
  dispatchStartGetMessage,
  dispatchUpdateSecureMessagingTab,
  dispatchStartDownloadFileAttachment,
  dispatchFinishDownloadFileAttachment,
  dispatchFinishGetMessageRecipients,
  dispatchStartGetMessageRecipients,
  dispatchFinishGetMessageSignature,
  dispatchStartGetMessageSignature,
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
  dispatchFinishMoveMessage,
  dispatchResetDeleteDraftComplete,
  dispatchResetDeleteDraftFailed,
  dispatchStartDeleteDraft,
  dispatchStartMoveMessage,
} = secureMessagingSlice.actions

export default secureMessagingSlice.reducer
