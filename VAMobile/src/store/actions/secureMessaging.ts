import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { Events, UserAnalytics } from 'constants/analytics'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { READ } from 'constants/secureMessaging'
import { ScreenIDTypesConstants, SecureMessagingFolderList, SecureMessagingFormData, SecureMessagingSignatureData, SecureMessagingSignatureDataAttributes } from 'store/api/types'
import FileViewer from 'react-native-file-viewer'

import { MockUsersEmail } from 'constants/common'
import {
  Params,
  ScreenIDTypes,
  SecureMessagingAttachment,
  SecureMessagingFolderGetData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageData,
  SecureMessagingMessageGetData,
  SecureMessagingRecipientDataList,
  SecureMessagingRecipients,
  SecureMessagingSaveDraftData,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingTabTypes,
  SecureMessagingThreadGetData,
} from 'store/api'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { StoreState } from 'store'
import { ThunkDispatch } from 'redux-thunk'
import { contentTypes } from 'store/api/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { downloadFile, unlinkFile } from 'utils/filesystem'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getfolderName } from 'utils/secureMessaging'
import { isErrorObject, showSnackBar } from 'utils/common'
import { registerReviewEvent } from 'utils/inAppReviews'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'

const dispatchStartFetchInboxMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES',
    payload: {},
  }
}

const dispatchFinishFetchInboxMessages = (inboxMessages?: SecureMessagingFolderMessagesGetData, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES',
    payload: {
      inboxMessages,
      error,
    },
  }
}

/**
 * Redux action to fetch inbox messages
 */
export const fetchInboxMessages = (page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(fetchInboxMessages(page, screenID))))
    dispatch(dispatchStartFetchInboxMessages())

    try {
      // TODO story #25035, remove once ready
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      if (signInEmail === MockUsersEmail.user_1414) {
        throw {
          json: {
            errors: [
              {
                code: SecureMessagingErrorCodesConstants.TERMS_AND_CONDITIONS,
              },
            ],
          },
        }
      }

      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inboxMessages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
      } as Params)
      dispatch(dispatchFinishFetchInboxMessages(inboxMessages, undefined))
      dispatch(getInbox())
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishFetchInboxMessages(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error, screenID), screenID))
      }
    }
  }
}

const dispatchStartListFolders = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_LIST_FOLDERS',
    payload: {},
  }
}

const dispatchFinishListFolders = (folderData?: SecureMessagingFoldersGetData, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_LIST_FOLDERS',
    payload: {
      folderData,
      error,
    },
  }
}

export const listFolders = (screenID?: ScreenIDTypes, forceRefresh = false): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
      dispatch(dispatchFinishListFolders(folders, undefined))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishListFolders(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error, screenID), screenID))
      }
    }
  }
}

const dispatchStartGetInbox = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_INBOX',
    payload: {},
  }
}

const dispatchFinishGetInbox = (inboxData?: SecureMessagingFolderGetData, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_INBOX',
    payload: {
      inboxData,
      error,
    },
  }
}

export const getInbox = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getInbox(screenID))))
    dispatch(dispatchStartGetInbox())

    try {
      //TODO what is the right refersh logic to ensure we don't invoke the API too frequently
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inbox = await api.get<SecureMessagingFolderGetData>(`/v0/messaging/health/folders/${folderID}`)

      dispatch(dispatchFinishGetInbox(inbox, undefined))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetInbox(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchStartListFolderMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES',
    payload: {},
  }
}

const dispatchFinishListFolderMessages = (folderID: number, messageData?: SecureMessagingFolderMessagesGetData, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES',
    payload: {
      messageData,
      folderID,
      error,
    },
  }
}

export const listFolderMessages = (folderID: number, page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolderMessages(folderID, page, screenID))))
    dispatch(dispatchStartListFolderMessages())

    try {
      const messages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
      } as Params)
      dispatch(dispatchFinishListFolderMessages(folderID, messages, undefined))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishListFolderMessages(folderID, undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchStartGetThread = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_THREAD',
    payload: {},
  }
}

const dispatchFinishGetThread = (threadData?: SecureMessagingThreadGetData, messageID?: number, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_THREAD',
    payload: {
      threadData,
      messageID,
      error,
    },
  }
}

export const getThread = (messageID: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getThread(messageID))))
    dispatch(dispatchStartGetThread())

    try {
      const response = await api.get<SecureMessagingThreadGetData>(`/v0/messaging/health/messages/${messageID}/thread`)
      dispatch(dispatchFinishGetThread(response, messageID))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetThread(undefined, messageID, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchStartGetMessage = (): ReduxAction => ({
  type: 'SECURE_MESSAGING_START_GET_MESSAGE',
  payload: {},
})

const dispatchFinishGetMessage = (messageData?: SecureMessagingMessageGetData, error?: api.APIError, messageId?: number): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE',
    payload: {
      messageData,
      error,
      messageId,
    },
  }
}

const dispatchStartGetAttachmentList = (): ReduxAction => ({
  type: 'SECURE_MESSAGING_START_GET_ATTACHMENT_LIST',
  payload: {},
})

/**  */
export const getMessage = (
  /** ID of the message we want to fetch */
  messageID: number,
  screenID?: ScreenIDTypes,
  /** Forces an API call.  By default we check the messages map before doing a fetch, but sometimes
   *  we need to refresh or might have only a summary in the map, which doesn't contain attachment info
   */
  force = false,
  /** Set to true if we want to display the inline activity indicator instead of of the one that takes up the whole screen */
  loadingAttachments = false,
): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessage(messageID))))

    const { demoMode } = getState().demo

    if (loadingAttachments) {
      dispatch(dispatchStartGetAttachmentList())
    } else {
      dispatch(dispatchStartGetMessage())
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
        if (demoMode) {
          const { inbox } = getState().secureMessaging
          inbox.attributes.unreadCount -= 1
        } else {
          dispatch(getInbox())
        }
      }
      await registerReviewEvent()
      dispatch(dispatchFinishGetMessage(response))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetMessage(undefined, error, messageID))
      }
    }
  }
}

const dispatchUpdateSecureMessagingTab = (secureMessagingTab: SecureMessagingTabTypes): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_UPDATE_TAB',
    payload: {
      secureMessagingTab,
    },
  }
}

/**
 * Redux action to update the secure messaging tab
 */
export const updateSecureMessagingTab = (secureMessagingTab: SecureMessagingTabTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateSecureMessagingTab(secureMessagingTab))
  }
}

const dispatchStartDownloadFileAttachment = (fileKey: string): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT',
    payload: {
      fileKey,
    },
  }
}

const dispatchFinishDownloadFileAttachment = (error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to download a file attachment
 */
export const downloadFileAttachment = (file: SecureMessagingAttachment, fileKey: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
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
        /** All download errors will be caught here so there is no special path
         *  for network connection errors
         */
        dispatch(dispatchFinishDownloadFileAttachment(error))
      }
    }
  }
}

const dispatchStartGetMessageRecipients = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_RECIPIENTS',
    payload: {},
  }
}

const dispatchFinishGetMessageRecipients = (recipients?: SecureMessagingRecipientDataList, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_RECIPIENTS',
    payload: {
      recipients: recipients || [],
      error,
    },
  }
}

/**
 * Redux action to get all possible recipients of a message
 */
export const getMessageRecipients = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageRecipients(screenID))))
    dispatch(dispatchStartGetMessageRecipients())

    try {
      const recipientsData = await api.get<SecureMessagingRecipients>('/v0/messaging/health/recipients')
      const preferredList = recipientsData?.data.filter((recipient) => recipient.attributes.preferredTeam)
      dispatch(dispatchFinishGetMessageRecipients(preferredList))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetMessageRecipients(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

/**
 * Redux action to start the get message signature
 */
const dispatchStartGetMessageSignature = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_SIGNATURE',
    payload: {},
  }
}

/**
 * Redux action to finish the get message signature
 */
const dispatchFinishGetMessageSignature = (signature?: SecureMessagingSignatureDataAttributes, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_SIGNATURE',
    payload: {
      signature,
      error,
    },
  }
}

/**
 * Redux action to get message signature
 */
export const getMessageSignature = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageSignature(screenID))))
    dispatch(dispatchStartGetMessageSignature())

    try {
      const signatureData = await api.get<SecureMessagingSignatureData>('/v0/messaging/health/messages/signature')
      const signature = signatureData?.data.attributes
      dispatch(dispatchFinishGetMessageSignature(signature))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetMessageSignature(undefined, error))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
      }
    }
  }
}

const dispatchStartSaveDraft = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_SAVE_DRAFT',
    payload: {},
  }
}

const dispatchFinishSaveDraft = (messageID?: number, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT',
    payload: {
      messageID,
      error,
    },
  }
}

export const resetSaveDraftComplete = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE',
    payload: {},
  }
}

/**
 * Redux action to reset saveDraftFailed attribute to false
 */
export const resetSaveDraftFailed = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED',
    payload: {},
  }
}

/**
 * Redux action to save a message draft - If a messageID is included, perform a PUT to
 * update an existing draft instead.  If the draft is a reply, call reply-specific endpoints
 */
export const saveDraft = (messageData: SecureMessagingFormData, messageID?: number, isReply?: boolean, replyID?: number, refreshFolder?: boolean): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchSetTryAgainFunction(() => dispatch(saveDraft(messageData))))
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
      await logAnalyticsEvent(Events.vama_sm_save_draft(totalTime, actionTime))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(dispatchFinishSaveDraft(Number(response?.data?.id)))

      if (refreshFolder) {
        dispatch(listFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      }
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishSaveDraft(undefined, error))
      }
    }
  }
}

const dispatchStartSendMessage = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_SEND_MESSAGE',
    payload: {},
  }
}

const dispatchFinishSendMessage = (error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE',
    payload: {
      error,
    },
  }
}

export const resetSendMessageComplete = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE',
    payload: {},
  }
}

/**
 * Redux action to reset sendMessageFailed attribute to false
 */
export const resetSendMessageFailed = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED',
    payload: {},
  }
}

/**
 * Redux action to send a new message - unnecessary to update the store because
 * the form flow will redirect you to the inbox after clicking "Send", which will
 * make an API call to get the latest contents anyway.
 */
export const sendMessage = (messageData: SecureMessagingFormData, uploads?: Array<ImagePickerResponse | DocumentPickerResponse>, replyToID?: number): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
    dispatch(dispatchSetTryAgainFunction(() => dispatch(sendMessage(messageData, uploads))))
    dispatch(dispatchStartSendMessage()) //set loading to true
    try {
      await api.post<SecureMessagingMessageData>(
        replyToID ? `/v0/messaging/health/messages/${replyToID}/reply` : '/v0/messaging/health/messages',
        postData as unknown as api.Params,
        uploads && uploads.length !== 0 ? contentTypes.multipart : undefined,
      )

      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_sm_send_message(totalTime, actionTime))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_sm())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      await registerReviewEvent()
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
      dispatch(dispatchFinishSendMessage())
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishSendMessage(error))
      }
    }
  }
}

export const dispatchClearLoadedMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_CLEAR_LOADED_MESSAGES',
    payload: {},
  }
}

export const resetReplyTriageError = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR',
    payload: {},
  }
}

/**
 * Redux action to reset hasLoadedRecipients attribute to false
 */
export const resetHasLoadedRecipients = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_HAS_LOADED_RECIPIENTS',
    payload: {},
  }
}

/**
 * Redux action to start the move of a message to another folder
 */
const dispatchStartMoveMessage = (isUndo?: boolean): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_MOVE_MESSAGE',
    payload: {
      isUndo,
    },
  }
}

/**
 * Redux action to finish the move of a message to another folder
 */
const dispatchFinishMoveMessage = (isUndo?: boolean, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_MOVE_MESSAGE',
    payload: {
      error,
      isUndo,
    },
  }
}

/**
 * Redux action that moves a message to another folder
 */
export const moveMessage = (
  messageID: number,
  newFolderID: number,
  currentFolderID: number,
  folderToRefresh: number,
  currentPage: number,
  messagesLeft: number,
  isUndo: boolean,
  folders: SecureMessagingFolderList,
  withNavBar: boolean,
): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const retryFunction = () => dispatch(moveMessage(messageID, newFolderID, currentFolderID, folderToRefresh, currentPage, messagesLeft, isUndo, folders, withNavBar))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartMoveMessage(isUndo))

    try {
      await api.patch(`/v0/messaging/health/messages/${messageID}/move`, { folder_id: newFolderID } as unknown as api.Params)
      refreshFoldersAfterMove(dispatch, messageID, newFolderID, currentFolderID, folderToRefresh, currentPage, messagesLeft, isUndo, folders, withNavBar)
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishMoveMessage(undefined, error))
        showSnackBar(getSnackBarMessage(newFolderID, folders, isUndo, true), dispatch, retryFunction, false, true)
      }
    }
  }
}

/**
 * Redux action that moves a message to the delete folder
 */
export const moveMessageToTrash = (
  messageID: number,
  currentFolderID: number,
  folderToRefresh: number,
  currentPage: number,
  messagesLeft: number,
  isUndo: boolean,
  folders: SecureMessagingFolderList,
  withNavBar: boolean,
): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const retryFunction = () => dispatch(moveMessageToTrash(messageID, currentFolderID, folderToRefresh, currentPage, messagesLeft, isUndo, folders, withNavBar))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartMoveMessage(isUndo))

    try {
      await deleteMessage(messageID)
      refreshFoldersAfterMove(
        dispatch,
        messageID,
        SecureMessagingSystemFolderIdConstants.DELETED,
        currentFolderID,
        folderToRefresh,
        currentPage,
        messagesLeft,
        isUndo,
        folders,
        withNavBar,
      )
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishMoveMessage(undefined, error))
        showSnackBar(getSnackBarMessage(currentFolderID, folders, isUndo, true), dispatch, retryFunction, false, true, withNavBar)
      }
    }
  }
}

// method to refresh the folders after move and handle the undo
const refreshFoldersAfterMove = (
  dispatch: ThunkDispatch<StoreState, undefined, ReduxAction>,
  messageID: number,
  newFolderID: number,
  currentFolderID: number,
  folderToRefresh: number,
  currentPage: number,
  messagesLeft: number,
  isUndo: boolean,
  folders: SecureMessagingFolderList,
  withNavBar: boolean,
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
  dispatch(dispatchFinishMoveMessage(false))

  const message = getSnackBarMessage(newFolderID, folders, isUndo, false)

  showSnackBar(
    message,
    dispatch,
    () => {
      if (currentFolderID !== SecureMessagingSystemFolderIdConstants.DELETED) {
        dispatch(moveMessage(messageID, currentFolderID, newFolderID, folderToRefresh, currentPage, messagesLeft, true, folders, withNavBar))
      } else {
        dispatch(moveMessageToTrash(messageID, currentFolderID, folderToRefresh, currentPage, messagesLeft, true, folders, withNavBar))
      }
    },
    isUndo,
    false,
    withNavBar,
  )
}

// method to create the snackbar message for the move message
const getSnackBarMessage = (folderID: number, folders: SecureMessagingFolderList, isUndo: boolean, isError: boolean) => {
  const folderName = getfolderName(folderID.toString(), folders)
  const folderString =
    folderID !== SecureMessagingSystemFolderIdConstants.INBOX && folderID !== SecureMessagingSystemFolderIdConstants.DELETED ? `${folderName} folder` : folderName

  const messageString = !isUndo ? `${isError ? 'Failed to move message' : 'Message moved'}` : `${isError ? 'Failed to move message back' : 'Message moved back'}`

  return `${messageString} to ${folderString}`
}

/**
 * Redux action to start to delete draft
 */
const dispatchStartDeleteDraft = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_DELETE_DRAFT',
    payload: {},
  }
}

/**
 * Redux action to finish the delete draft
 */
const dispatchFinishDeleteDraft = (error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_DELETE_DRAFT',
    payload: {
      error,
    },
  }
}

export const deleteDraft = (messageID: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    const retryFunction = () => dispatch(deleteDraft(messageID))
    dispatch(dispatchSetTryAgainFunction(retryFunction))
    dispatch(dispatchStartDeleteDraft())

    try {
      await deleteMessage(messageID)

      dispatch(listFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))

      dispatch(dispatchFinishDeleteDraft())
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishDeleteDraft(error))
        showSnackBar('Error deleting draft', dispatch, retryFunction, false, true)
      }
    }
  }
}

/**
 * Delete a message
 */
export const deleteMessage = async (messageID: number): Promise<void> => {
  await api.del(`/v0/messaging/health/messages/${messageID}`)
}

/**
 * Redux action to reset deleteDraftCompleted attribute to false
 */
export const resetDeleteDraftComplete = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_DELETE_DRAFT_COMPLETE',
    payload: {},
  }
}

/**
 * Redux action to reset deleteDraftFailed attribute to false
 */
export const resetDeleteDraftFailed = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_DELETE_DRAFT_FAILED',
    payload: {},
  }
}
